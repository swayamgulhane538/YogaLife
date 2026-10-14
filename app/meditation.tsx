import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguageStore } from '@/stores/languageStore';
import { useProgressStore } from '@/stores/progressStore';
import { playAlarmSound, stopAlarmSound } from '@/components/alarm/RingtonePlayer';

const DURATION_OPTIONS = [5, 10, 15, 20]; // in minutes

const MEDITATION_CUES = [
  {
    en: 'Settle into a comfortable posture. Gently close your eyes and let your shoulders drop.',
    hi: 'एक सुखद मुद्रा में बैठें। धीरे से आंखें बंद करें और कंधों को ढीला छोड़ दें।',
  },
  {
    en: 'Observe your thoughts without judgment, watching them drift like clouds across the vast sky.',
    hi: 'विचारों को बिना किसी निर्णय के साक्षी भाव से देखें, जैसे खुले आकाश में तैरते बादल।',
  },
  {
    en: 'Feel the cool air enter your nostrils, and the warm air gently release.',
    hi: 'नासिका से प्रवेश करती शीतल प्राणवायु और बाहर निकलती कोमल ऊष्मा को महसूस करें।',
  },
  {
    en: 'Release all tension from your forehead, jaw, neck, and heart space.',
    hi: 'माथे, जबड़े, गर्दन और हृदय से हर प्रकार का तनाव विसर्जित कर दें।',
  },
  {
    en: 'Rest in the timeless stillness of pure awareness and inner peace.',
    hi: 'विशुद्ध चेतना, मौन और अंतरंग शांति की गहराई में विश्राम करें।',
  },
];

export default function MeditationScreen() {
  const { t, language } = useLanguageStore();
  const addPractice = useProgressStore((state) => state.addPractice);

  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [secondsRemaining, setSecondsRemaining] = useState(selectedMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [cueIndex, setCueIndex] = useState(0);

  // Pulse animation for meditative aura
  const auraScale = useRef(new Animated.Value(1)).current;
  const auraOpacity = useRef(new Animated.Value(0.4)).current;

  // Sync remaining seconds when duration changed in idle state
  const handleSelectDuration = (mins: number) => {
    if (!isActive) {
      setSelectedMinutes(mins);
      setSecondsRemaining(mins * 60);
    }
  };

  // Start meditative pulsing animation loop
  useEffect(() => {
    let anim: Animated.CompositeAnimation | null = null;
    if (isActive) {
      anim = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(auraScale, {
              toValue: 1.35,
              duration: 4000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(auraScale, {
              toValue: 1.0,
              duration: 4000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(auraOpacity, {
              toValue: 0.15,
              duration: 4000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(auraOpacity, {
              toValue: 0.5,
              duration: 4000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      anim.start();
    } else {
      auraScale.setValue(1);
      auraOpacity.setValue(0.4);
    }

    return () => {
      if (anim) anim.stop();
    };
  }, [isActive, auraScale, auraOpacity]);

  // Main countdown timer
  useEffect(() => {
    let timer: any = null;

    if (isActive) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Session Completed!
            clearInterval(timer);
            setIsActive(false);
            playAlarmSound('bell');

            const practicedSecs = selectedMinutes * 60;
            addPractice({
              poseId: 'meditation',
              durationSeconds: practicedSecs,
              completed: true,
            });

            Alert.alert(
              t('Meditation Complete', 'ध्यान सत्र पूर्ण'),
              t(
                'Om Shanti. May this peaceful stillness accompany you throughout your day.',
                'ॐ शांति। यह आंतरिक शांति और सौम्यता दिनभर आपके साथ बनी रहे।'
              ),
              [{ text: t('Namaste', 'नमस्ते') }]
            );

            return 0;
          }

          // Cycle guidance cue every 30 seconds
          if (prev % 30 === 0) {
            setCueIndex((curr) => (curr + 1) % MEDITATION_CUES.length);
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, selectedMinutes, addPractice, t]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    const practicedDuration = selectedMinutes * 60 - secondsRemaining;
    if (practicedDuration >= 30) {
      addPractice({
        poseId: 'meditation',
        durationSeconds: practicedDuration,
        completed: false,
      });
    }
    setSecondsRemaining(selectedMinutes * 60);
    setCueIndex(0);
  };

  const handleBack = () => {
    const practicedDuration = selectedMinutes * 60 - secondsRemaining;
    if (practicedDuration >= 30) {
      addPractice({
        poseId: 'meditation',
        durationSeconds: practicedDuration,
        completed: false,
      });
    }
    stopAlarmSound();
    router.back();
  };

  const formattedTime = useMemo(() => {
    const m = Math.floor(secondsRemaining / 60);
    const s = secondsRemaining % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [secondsRemaining]);

  const currentCue = MEDITATION_CUES[cueIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.deepForest} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('Meditation', 'ध्यान साधना')}</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Duration Selectors */}
        <View style={styles.durationSelector}>
          {DURATION_OPTIONS.map((mins) => {
            const isSelected = selectedMinutes === mins;
            return (
              <TouchableOpacity
                key={`duration-${mins}`}
                onPress={() => handleSelectDuration(mins)}
                disabled={isActive}
                style={[
                  styles.durationChip,
                  isSelected && styles.durationChipActive,
                  isActive && !isSelected && styles.durationChipDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.durationText,
                    isSelected && styles.durationTextActive,
                  ]}
                >
                  {mins} {t('min', 'मिनट')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Meditative Pulsing Visualizer */}
        <View style={styles.visualizerContainer}>
          {/* Animated Aura Glow Rings */}
          <Animated.View
            style={[
              styles.auraRing,
              styles.auraOuter,
              {
                opacity: auraOpacity,
                transform: [{ scale: auraScale }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.auraRing,
              styles.auraMiddle,
              {
                opacity: auraOpacity,
                transform: [{ scale: auraScale }],
              },
            ]}
          />

          {/* Central Lotus Glowing Circle */}
          <View style={styles.coreCircle}>
            <Ionicons name="flower-outline" size={54} color={Colors.white} />
            <Text style={styles.countdownText}>{formattedTime}</Text>
          </View>
        </View>

        {/* Guidance Cue Box */}
        <View style={styles.cueCard}>
          <Ionicons
            name="sparkles"
            size={18}
            color={Colors.mutedGold}
            style={styles.cueIcon}
          />
          <Text style={styles.cueText}>
            {language === 'hi' ? currentCue.hi : currentCue.en}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={24} color={Colors.textSecondary} />
            <Text style={styles.secondaryControlText}>{t('Reset', 'रीसेट')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryControl}
            onPress={handleStartPause}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isActive ? 'pause' : 'play'}
              size={28}
              color={Colors.white}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.primaryControlText}>
              {isActive ? t('Pause', 'विराम') : t('Begin Meditation', 'ध्यान शुरू करें')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.softGreenBg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 12,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.deepForest,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  durationSelector: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  durationChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: '#D4E2D4',
  },
  durationChipActive: {
    backgroundColor: Colors.deepForest,
    borderColor: Colors.deepForest,
  },
  durationChipDisabled: {
    opacity: 0.5,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  durationTextActive: {
    color: Colors.white,
  },
  visualizerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  auraRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.sageGreen,
  },
  auraOuter: {
    width: 260,
    height: 260,
  },
  auraMiddle: {
    width: 210,
    height: 210,
  },
  coreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.deepForest,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  countdownText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 6,
    letterSpacing: 1,
  },
  cueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  cueIcon: {
    marginRight: 12,
  },
  cueText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  secondaryControl: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.cardBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#D4E2D4',
  },
  secondaryControlText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  primaryControl: {
    flex: 2,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.deepForest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  primaryControlText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});
