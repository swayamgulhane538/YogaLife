import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Dimensions,
  Platform,
  Switch,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguageStore } from '@/stores/languageStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useProgressStore } from '@/stores/progressStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { getPoseById, yogaPoses } from '@/data/poses';
import { yogaSessions, YogaSession } from '@/data/sessions';
import { getInstructionsForPose } from '@/data/instructions';
import { YogaScene, YogaSceneRef } from '@/components/3d/YogaScene';
import { VoiceGuidance, VoiceGuidanceHandle } from '@/components/voice/VoiceGuidance';
import { Subtitles } from '@/components/voice/Subtitles';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { playAlarmSound, stopAlarmSound } from '@/components/alarm/RingtonePlayer';
import { SyncState } from '@/utils/syncEngine';

const { height } = Dimensions.get('window');
const SCENE_HEIGHT = Math.min(380, Math.max(280, Math.round(height * 0.44)));

export default function SessionPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, language } = useLanguageStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const addPractice = useProgressStore((state) => state.addPractice);
  const currentStreak = useProgressStore((state) => state.currentStreak);
  const { beginnerMode, setBeginnerMode, voiceSpeed, setVoiceSpeed } = useSettingsStore();

  // 1. Identify if ID is a curated Session or a single Pose
  const sessionData = useMemo<YogaSession | undefined>(() => {
    return yogaSessions.find((s) => s.id.toLowerCase() === (id || '').toLowerCase());
  }, [id]);

  // Pose Sequence determination
  const poseSequence = useMemo<string[]>(() => {
    if (sessionData && sessionData.poseSequence.length > 0) {
      return sessionData.poseSequence;
    }
    // Single pose fallback
    const singlePose = getPoseById(id as string);
    return singlePose ? [singlePose.id] : ['tadasana'];
  }, [sessionData, id]);

  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const currentPoseId = poseSequence[currentPoseIndex] || 'tadasana';
  const currentPose = useMemo(() => getPoseById(currentPoseId) || yogaPoses[0], [currentPoseId]);

  // Current Pose Instructions
  const instructions = useMemo(() => {
    return getInstructionsForPose(currentPoseId);
  }, [currentPoseId]);

  // Playback & Synchronization State
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Component Refs
  const sceneRef = useRef<YogaSceneRef | null>(null);
  const voiceRef = useRef<VoiceGuidanceHandle | null>(null);

  const favorite = isFavorite(currentPose.id);

  // Active step text & metadata
  const currentStep = instructions.steps[currentStepIndex] || instructions.steps[0];
  const totalSteps = Math.max(1, instructions.steps.length);

  // Session elapsed timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && !showCompletionModal) {
      timer = setInterval(() => {
        setTotalSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, showCompletionModal]);

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      stopAlarmSound();
    };
  }, []);

  // Voice step sync callback
  const handleStepChange = useCallback((stepIdx: number) => {
    setCurrentStepIndex(stepIdx);
  }, []);

  // Voice engine state callback
  const handleVoiceStateChange = useCallback(
    (state: SyncState) => {
      setIsPlaying(state.isPlaying);
      if (state.currentStep !== undefined) {
        setCurrentStepIndex(state.currentStep);
      }

      // Check if session ended
      if (state.isComplete) {
        handleStepCompletion();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPoseIndex, poseSequence.length]
  );

  // Step Completion & Pose Sequence Flow
  const handleStepCompletion = () => {
    if (currentPoseIndex < poseSequence.length - 1) {
      // Advance to next pose in sequence!
      const nextPoseIdx = currentPoseIndex + 1;
      setCurrentPoseIndex(nextPoseIdx);
      setCurrentStepIndex(0);
    } else {
      // Entire session finished!
      setIsPlaying(false);
      setShowCompletionModal(true);
      playAlarmSound('bell');

      // Save practice to progressStore
      addPractice({
        poseId: id as string,
        durationSeconds: Math.max(totalSessionSeconds, 60),
        completed: true,
      });
    }
  };

  // User Play/Pause Toggle
  const handleTogglePlayPause = () => {
    if (isPlaying) {
      voiceRef.current?.pause();
      sceneRef.current?.pause();
      setIsPlaying(false);
    } else {
      voiceRef.current?.resume();
      sceneRef.current?.play();
      setIsPlaying(true);
    }
  };

  // Step Navigation: Next
  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      voiceRef.current?.nextStep();
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleStepCompletion();
    }
  };

  // Step Navigation: Previous
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      voiceRef.current?.prevStep();
      setCurrentStepIndex((prev) => prev - 1);
    } else if (currentPoseIndex > 0) {
      // Go back to previous pose in routine
      setCurrentPoseIndex((p) => p - 1);
      setCurrentStepIndex(0);
    }
  };

  // Replay current step
  const handleReplayStep = () => {
    voiceRef.current?.replay();
    sceneRef.current?.replay();
  };

  // Restart Entire Session
  const handleRestartSession = () => {
    setCurrentPoseIndex(0);
    setCurrentStepIndex(0);
    setTotalSessionSeconds(0);
    setIsPlaying(true);
    setShowCompletionModal(false);
    voiceRef.current?.goToStep(0);
    sceneRef.current?.replay();
  };

  // Speed adjustments
  const handleCycleSpeed = () => {
    const speeds = [0.8, 1.0, 1.2];
    const nextIdx = (speeds.indexOf(voiceSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx] || 1.0;
    setVoiceSpeed(nextSpeed);
    sceneRef.current?.setSpeed(nextSpeed);
  };

  // Exit session
  const handleExit = () => {
    voiceRef.current?.stop();
    sceneRef.current?.pause();
    stopAlarmSound();

    if (totalSessionSeconds >= 30) {
      addPractice({
        poseId: id as string,
        durationSeconds: totalSessionSeconds,
        completed: false,
      });
    }

    router.back();
  };

  const formattedTime = useMemo(() => {
    const m = Math.floor(totalSessionSeconds / 60);
    const s = totalSessionSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [totalSessionSeconds]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Invisible Synchronized Voice Guidance Engine */}
        <VoiceGuidance
          ref={voiceRef}
          poseId={currentPoseId}
          language={language}
          isActive={isPlaying && !showCompletionModal}
          speed={voiceSpeed}
          onStepChange={handleStepChange}
          onStateChange={handleVoiceStateChange}
        />

        {/* TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topBarBtn}
            onPress={handleExit}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.deepForest} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            {poseSequence.length > 1 && (
              <Text style={styles.sequenceBadge}>
                {t('Pose', 'आसन')} {currentPoseIndex + 1}/{poseSequence.length}
              </Text>
            )}
            <Text style={styles.topPoseName} numberOfLines={1}>
              {language === 'hi'
                ? currentPose.hindiName || currentPose.sanskritName
                : currentPose.sanskritName}
            </Text>
          </View>

          <View style={styles.topRightActions}>
            <LanguageSelector variant="compact" />
            <TouchableOpacity
              style={styles.favoriteBtn}
              onPress={() => toggleFavorite(currentPose.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={22}
                color={favorite ? Colors.error : Colors.deepForest}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3D SCENE (YogaScene component ~50% height) */}
        <View style={[styles.sceneWrapper, { height: SCENE_HEIGHT }]}>
          <YogaScene
            ref={sceneRef}
            poseId={currentPoseId}
            isPlaying={isPlaying}
            speed={voiceSpeed}
            showCameraControls={true}
            style={styles.sceneCanvas}
          />

          {/* Time & Speed Floating Pill */}
          <View style={styles.floatingTimer}>
            <Ionicons name="timer-outline" size={13} color={Colors.white} />
            <Text style={styles.floatingTimerText}>{formattedTime}</Text>
          </View>
        </View>

        {/* SUBTITLE & INSTRUCTION STEP */}
        <View style={styles.subtitleContainer}>
          <Subtitles
            text={
              currentStep
                ? language === 'hi'
                  ? currentStep.textHi
                  : currentStep.textEn
                : ''
            }
            language={language}
            breathing={currentStep?.breathe}
            bodyFocus={
              language === 'hi'
                ? currentStep?.bodyFocusHi || currentStep?.bodyFocus
                : currentStep?.bodyFocus
            }
            isVisible={true}
          />

          {/* STEP INDICATOR */}
          <StepIndicator
            currentStep={currentStepIndex + 1}
            totalSteps={totalSteps}
            onPrevStep={handlePrevStep}
            onNextStep={handleNextStep}
          />
        </View>

        {/* VOICE & PLAYBACK CONTROLS */}
        <View style={styles.controlsSection}>
          {/* Main Control Bar */}
          <View style={styles.mainControlsRow}>
            {/* Prev Step */}
            <TouchableOpacity
              style={styles.iconControlBtn}
              onPress={handlePrevStep}
              activeOpacity={0.7}
            >
              <Ionicons name="play-skip-back" size={24} color={Colors.deepForest} />
            </TouchableOpacity>

            {/* Play/Pause */}
            <TouchableOpacity
              style={styles.playPauseBtn}
              onPress={handleTogglePlayPause}
              activeOpacity={0.85}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color={Colors.white}
              />
            </TouchableOpacity>

            {/* Next Step */}
            <TouchableOpacity
              style={styles.iconControlBtn}
              onPress={handleNextStep}
              activeOpacity={0.7}
            >
              <Ionicons name="play-skip-forward" size={24} color={Colors.deepForest} />
            </TouchableOpacity>

            {/* Replay Step */}
            <TouchableOpacity
              style={styles.iconControlBtn}
              onPress={handleReplayStep}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={22} color={Colors.deepForest} />
            </TouchableOpacity>

            {/* Speed Pill */}
            <TouchableOpacity
              style={styles.speedBtn}
              onPress={handleCycleSpeed}
              activeOpacity={0.8}
            >
              <Text style={styles.speedBtnText}>{voiceSpeed}x</Text>
            </TouchableOpacity>
          </View>

          {/* Options Row (Beginner Mode & Restart) */}
          <View style={styles.optionsRow}>
            <View style={styles.beginnerToggleRow}>
              <Text style={styles.beginnerLabel}>{t('Beginner Mode', 'शुरुआती मोड')}</Text>
              <Switch
                value={beginnerMode}
                onValueChange={setBeginnerMode}
                trackColor={{ false: '#DCE6DC', true: Colors.sageGreen }}
                thumbColor={beginnerMode ? Colors.deepForest : '#FFFFFF'}
              />
            </View>

            <TouchableOpacity
              style={styles.restartBtn}
              onPress={handleRestartSession}
              activeOpacity={0.7}
            >
              <Ionicons name="reload-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.restartBtnText}>
                {t('Restart Session', 'सत्र पुनः आरंभ')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CONGRATULATIONS COMPLETION MODAL */}
        <Modal
          visible={showCompletionModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCompletionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.trophyWrap}>
                <Ionicons name="trophy" size={48} color={Colors.mutedGold} />
              </View>

              <Text style={styles.modalHeading}>
                {t('Session Completed!', 'अभ्यास पूर्ण हुआ!')}
              </Text>
              <Text style={styles.modalSubheading}>
                {t(
                  'Wonderful practice! You honored your body, breath, and inner self.',
                  'उत्कृष्ट योग साधना! आपने शरीर, मन और श्वास में सामंजस्य स्थापित किया।'
                )}
              </Text>

              {/* Stats Summary */}
              <View style={styles.modalStatsGrid}>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatVal}>{formattedTime}</Text>
                  <Text style={styles.modalStatLbl}>{t('Duration', 'अवधि')}</Text>
                </View>
                <View style={styles.modalStatDivider} />
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatVal}>{poseSequence.length}</Text>
                  <Text style={styles.modalStatLbl}>{t('Poses Done', 'पूर्ण आसन')}</Text>
                </View>
                <View style={styles.modalStatDivider} />
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatVal}>{currentStreak + 1}</Text>
                  <Text style={styles.modalStatLbl}>{t('Streak Day', 'दैनिक क्रम')}</Text>
                </View>
              </View>

              {/* Actions */}
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setShowCompletionModal(false);
                  router.replace('/(tabs)');
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>
                  {t('Back to Home', 'होम पर जाएं')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={handleRestartSession}
              >
                <Text style={styles.modalSecondaryBtnText}>
                  {t('Practice Again', 'पुनः अभ्यास करें')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
    paddingBottom: 10,
    backgroundColor: Colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EFE6',
  },
  topBarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.softGreenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  sequenceBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.deepForest,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topPoseName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteBtn: {
    padding: 6,
  },
  sceneWrapper: {
    width: '100%',
    backgroundColor: '#FAF5ED',
    position: 'relative',
  },
  sceneCanvas: {
    flex: 1,
  },
  floatingTimer: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(26, 58, 10, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  floatingTimerText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  subtitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F0',
  },
  controlsSection: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E8F0E8',
  },
  mainControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconControlBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.softGreenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.deepForest,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  speedBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.softGreenBg,
    borderWidth: 1,
    borderColor: '#D4E2D4',
  },
  speedBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.deepForest,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F5F0',
  },
  beginnerToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  beginnerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  restartBtnText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...Shadows.lg,
  },
  trophyWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.deepForest,
    textAlign: 'center',
  },
  modalSubheading: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 20,
  },
  modalStatsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.softGreenBg,
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginBottom: 20,
  },
  modalStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  modalStatVal: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.deepForest,
  },
  modalStatLbl: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  modalStatDivider: {
    width: 1,
    backgroundColor: '#D4E2D4',
  },
  modalPrimaryBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.deepForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    ...Shadows.sm,
  },
  modalPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  modalSecondaryBtn: {
    paddingVertical: 10,
  },
  modalSecondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.deepForest,
  },
});
