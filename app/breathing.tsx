import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguageStore } from '@/stores/languageStore';
import { useProgressStore } from '@/stores/progressStore';
import { speak, stopSpeaking } from '@/utils/tts';

interface BreathPattern {
  id: string;
  name: { en: string; hi: string };
  desc: { en: string; hi: string };
  phases: {
    phase: 'inhale' | 'hold1' | 'exhale' | 'hold2';
    duration: number; // in seconds
    labelEn: string;
    labelHi: string;
    speechEn: string;
    speechHi: string;
  }[];
}

const PATTERNS: BreathPattern[] = [
  {
    id: 'box',
    name: { en: 'Box Breathing', hi: 'संवृत्ति (बॉक्स ब्रीदिंग)' },
    desc: {
      en: 'Equal 4-4-4-4 for focus and nervous system balance',
      hi: 'एकाग्रता और मानसिक स्थिरता हेतु 4-4-4-4 का सम चक्र',
    },
    phases: [
      { phase: 'inhale', duration: 4, labelEn: 'Inhale', labelHi: 'श्वास लें', speechEn: 'Inhale slowly', speechHi: 'धीमी गहरी सांस लें' },
      { phase: 'hold1', duration: 4, labelEn: 'Hold', labelHi: 'रोकें', speechEn: 'Hold your breath', speechHi: 'सांस रोकें' },
      { phase: 'exhale', duration: 4, labelEn: 'Exhale', labelHi: 'श्वास छोड़ें', speechEn: 'Exhale completely', speechHi: 'सांस बाहर छोड़ें' },
      { phase: 'hold2', duration: 4, labelEn: 'Hold Empty', labelHi: 'खाली रोकें', speechEn: 'Hold and pause', speechHi: 'विश्राम में रुकें' },
    ],
  },
  {
    id: '478',
    name: { en: '4-7-8 Relaxing Breath', hi: '4-7-8 गहरी शांति' },
    desc: {
      en: 'Dr. Weil technique for deep anxiety relief and better sleep',
      hi: 'गहन तनाव मुक्ति और सुखद नींद के लिए प्रामाणिक तकनीक',
    },
    phases: [
      { phase: 'inhale', duration: 4, labelEn: 'Inhale', labelHi: 'श्वास लें', speechEn: 'Inhale through nose', speechHi: 'नाक से सांस लें' },
      { phase: 'hold1', duration: 7, labelEn: 'Hold', labelHi: 'रोकें', speechEn: 'Hold breath gently', speechHi: 'सांस रोके रखें' },
      { phase: 'exhale', duration: 8, labelEn: 'Exhale', labelHi: 'श्वास छोड़ें', speechEn: 'Exhale with whoosh', speechHi: 'मुख से सांस छोड़ें' },
    ],
  },
  {
    id: 'deep',
    name: { en: 'Deep Yogic Breath', hi: 'दीर्घ प्राणायाम' },
    desc: {
      en: 'Gentle expansion of abdominal and thoracic lung capacity',
      hi: 'फेफड़ों की पूर्ण क्षमता और प्राण ऊर्जा का विस्तार',
    },
    phases: [
      { phase: 'inhale', duration: 5, labelEn: 'Inhale Deeply', labelHi: 'गहरा श्वास लें', speechEn: 'Breathe in fully', speechHi: 'गहरी सांस भरें' },
      { phase: 'hold1', duration: 2, labelEn: 'Pause', labelHi: 'हल्का ठहराव', speechEn: 'Gentle pause', speechHi: 'हल्का सा रुकें' },
      { phase: 'exhale', duration: 5, labelEn: 'Exhale Slowly', labelHi: 'धीरे श्वास छोड़ें', speechEn: 'Release slowly', speechHi: 'धीरे-धीरे सांस छोड़ें' },
      { phase: 'hold2', duration: 2, labelEn: 'Rest', labelHi: 'विश्राम', speechEn: 'Relax', speechHi: 'शांत रहें' },
    ],
  },
];

export default function BreathingScreen() {
  const { t, language } = useLanguageStore();
  const addPractice = useProgressStore((state) => state.addPractice);

  const [activePatternIndex, setActivePatternIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const currentPattern = PATTERNS[activePatternIndex];
  const currentPhase = currentPattern.phases[currentPhaseIndex];

  // Stop TTS when unmounting
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Main Breathing Timer Loop
  useEffect(() => {
    let interval: any = null;

    if (isActive) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);

        setPhaseSecondsLeft((prevLeft) => {
          if (prevLeft <= 1) {
            // Transition to next phase
            const nextIdx = (currentPhaseIndex + 1) % currentPattern.phases.length;
            if (nextIdx === 0) {
              setCompletedCycles((c) => c + 1);
            }
            setCurrentPhaseIndex(nextIdx);
            return currentPattern.phases[nextIdx].duration;
          }
          return prevLeft - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentPhaseIndex, currentPattern]);

  // Handle phase visual animation & TTS announcement
  useEffect(() => {
    if (!isActive) return;

    const phase = currentPattern.phases[currentPhaseIndex];

    // Announce phase with TTS
    const speechText = language === 'hi' ? phase.speechHi : phase.speechEn;
    speak(speechText, {
      language,
      rate: 0.9,
    });

    // Animate breathing circle
    if (phase.phase === 'inhale') {
      Animated.timing(scaleAnim, {
        toValue: 1.45,
        duration: phase.duration * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else if (phase.phase === 'exhale') {
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: phase.duration * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isActive, currentPhaseIndex, currentPattern, language, scaleAnim]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(currentPattern.phases[0].duration);
  };

  const handlePause = () => {
    setIsActive(false);
    stopSpeaking();
  };

  const handleReset = () => {
    setIsActive(false);
    stopSpeaking();
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Track practice if practiced for at least 30 seconds
    if (totalSeconds >= 30) {
      addPractice({
        poseId: 'pranayama',
        durationSeconds: totalSeconds,
        completed: true,
      });
    }

    setTotalSeconds(0);
    setCompletedCycles(0);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(currentPattern.phases[0].duration);
  };

  const handleBack = () => {
    if (totalSeconds >= 20) {
      addPractice({
        poseId: 'pranayama',
        durationSeconds: totalSeconds,
        completed: true,
      });
    }
    stopSpeaking();
    router.back();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    if (!currentPhase) return Colors.deepForest;
    switch (currentPhase.phase) {
      case 'inhale':
        return '#0288D1';
      case 'hold1':
      case 'hold2':
        return Colors.mutedGold;
      case 'exhale':
        return Colors.deepForest;
      default:
        return Colors.deepForest;
    }
  };

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
          <Text style={styles.headerTitle}>{t('Pranayama', 'प्राणायाम')}</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Pattern Selector Chips */}
        <View style={styles.patternSelector}>
          {PATTERNS.map((pattern, idx) => {
            const isSelected = activePatternIndex === idx;
            return (
              <TouchableOpacity
                key={pattern.id}
                onPress={() => {
                  if (!isActive) {
                    setActivePatternIndex(idx);
                    setCurrentPhaseIndex(0);
                    setPhaseSecondsLeft(pattern.phases[0].duration);
                  }
                }}
                disabled={isActive}
                style={[
                  styles.patternChip,
                  isSelected && styles.patternChipActive,
                  isActive && !isSelected && styles.patternChipDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.patternChipText,
                    isSelected && styles.patternChipTextActive,
                  ]}
                >
                  {language === 'hi' ? pattern.name.hi : pattern.name.en}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Pattern Subtitle */}
        <Text style={styles.patternDesc}>
          {language === 'hi' ? currentPattern.desc.hi : currentPattern.desc.en}
        </Text>

        {/* Breathing Animation Canvas */}
        <View style={styles.circleContainer}>
          {/* Outer Ambient Glow */}
          <Animated.View
            style={[
              styles.outerCircle,
              {
                borderColor: getPhaseColor(),
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />

          {/* Core Interactive Breathing Circle */}
          <Animated.View
            style={[
              styles.innerCircle,
              {
                backgroundColor: getPhaseColor(),
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.circleContent}>
              <Text style={styles.phaseLabel}>
                {isActive
                  ? language === 'hi'
                    ? currentPhase.labelHi
                    : currentPhase.labelEn
                  : t('Ready', 'तैयार')}
              </Text>
              {isActive && (
                <Text style={styles.secondsCounter}>{phaseSecondsLeft}s</Text>
              )}
            </View>
          </Animated.View>
        </View>

        {/* Session Stats (Cycles & Timer) */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{formatTime(totalSeconds)}</Text>
            <Text style={styles.statLabel}>{t('Elapsed Time', 'सत्र समय')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{completedCycles}</Text>
            <Text style={styles.statLabel}>{t('Cycles Completed', 'पूर्ण चक्र')}</Text>
          </View>
        </View>

        {/* Bottom Control Buttons */}
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
            style={[styles.primaryControl, { backgroundColor: getPhaseColor() }]}
            onPress={isActive ? handlePause : handleStart}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isActive ? 'pause' : 'play'}
              size={30}
              color={Colors.white}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.primaryControlText}>
              {isActive ? t('Pause', 'रोकें') : t('Start', 'आरंभ करें')}
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
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  patternSelector: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 8,
  },
  patternChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: '#D4E2D4',
  },
  patternChipActive: {
    backgroundColor: Colors.deepForest,
    borderColor: Colors.deepForest,
  },
  patternChipDisabled: {
    opacity: 0.5,
  },
  patternChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  patternChipTextActive: {
    color: Colors.white,
  },
  patternDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  circleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  outerCircle: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 2,
    opacity: 0.35,
  },
  innerCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  circleContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },
  secondsCounter: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.deepForest,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0EAE0',
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
    flex: 1.8,
    height: 52,
    borderRadius: 26,
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
