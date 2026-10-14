/**
 * YogaLife 3D Engine - AnimationPlayer
 * Playback control overlay for 3D yoga animations.
 * Features:
 * - Play / Pause hero button with feedback
 * - Speed selector (0.5x, 1x, 1.5x, 2x)
 * - Interactive step indicator (◀ Step X of Y ▶)
 * - Animated progress bar
 * - Replay button
 * - Semi-transparent dark wellness container for high contrast over 3D scenes
 * - Hindi & English localization support
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../../constants/theme';
import { useLanguageStore } from '../../stores/languageStore';

export interface AnimationPlayerProps {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  progress: number; // 0 to 1
  onPlayPause: () => void;
  onReplay: () => void;
  onSpeedChange: (speed: number) => void;
  onStepChange: (step: number) => void;
  style?: StyleProp<ViewStyle>;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

export const AnimationPlayer: React.FC<AnimationPlayerProps> = ({
  isPlaying,
  speed,
  currentStep,
  totalSteps,
  progress,
  onPlayPause,
  onReplay,
  onSpeedChange,
  onStepChange,
  style,
}) => {
  const { t } = useLanguageStore();

  const clampedProgress = Math.max(0, Math.min(1, progress || 0));
  const progressPercent: `${number}%` = `${Math.round(clampedProgress * 100)}%`;

  const canGoPrev = currentStep > 1;
  const canGoNext = currentStep < totalSteps;

  const handlePrevStep = () => {
    if (canGoPrev) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (canGoNext) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <View style={[styles.cardContainer, style]}>
      {/* 1. Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progressPercent }]} />
        </View>
        <Text style={styles.progressText}>{progressPercent}</Text>
      </View>

      {/* 2. Secondary Row: Step Navigation & Speed Selector */}
      <View style={styles.secondaryRow}>
        {/* Step Indicator */}
        <View style={styles.stepNavigator}>
          <TouchableOpacity
            style={[styles.stepBtn, !canGoPrev && styles.stepBtnDisabled]}
            onPress={handlePrevStep}
            disabled={!canGoPrev}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={canGoPrev ? Colors.softIvory : 'rgba(255, 255, 255, 0.25)'}
            />
          </TouchableOpacity>

          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>
              {t('Step', 'चरण')} {currentStep}{' '}
              <Text style={styles.stepTotalText}>
                {t('of', '/')} {totalSteps}
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.stepBtn, !canGoNext && styles.stepBtnDisabled]}
            onPress={handleNextStep}
            disabled={!canGoNext}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={canGoNext ? Colors.softIvory : 'rgba(255, 255, 255, 0.25)'}
            />
          </TouchableOpacity>
        </View>

        {/* Speed Selector */}
        <View style={styles.speedSelector}>
          {SPEED_OPTIONS.map((rate) => {
            const isActive = Math.abs(speed - rate) < 0.05;
            return (
              <TouchableOpacity
                key={rate}
                style={[styles.speedPill, isActive && styles.speedPillActive]}
                onPress={() => onSpeedChange(rate)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.speedText, isActive && styles.speedTextActive]}
                >
                  {rate}x
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Primary Action Row: Replay & Large Centered Play/Pause Button */}
      <View style={styles.primaryRow}>
        {/* Replay Button */}
        <TouchableOpacity
          style={styles.replayBtn}
          onPress={onReplay}
          activeOpacity={0.7}
          accessibilityLabel={t('Replay', 'पुनः चलाएं')}
        >
          <Ionicons name="refresh" size={22} color={Colors.softIvory} />
        </TouchableOpacity>

        {/* Large Centered Play/Pause Hero Button */}
        <TouchableOpacity
          style={styles.playPauseHeroBtn}
          onPress={onPlayPause}
          activeOpacity={0.85}
          accessibilityLabel={
            isPlaying ? t('Pause', 'रोकें') : t('Play', 'चलाएं')
          }
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={28}
            color={Colors.cardBg}
            style={isPlaying ? undefined : styles.playIconOffset}
          />
        </TouchableOpacity>

        {/* Placeholder / Symmetric Spacer with Step Info Icon */}
        <View style={styles.spacerBtn}>
          <Ionicons
            name="body-outline"
            size={20}
            color="rgba(255, 255, 255, 0.45)"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(26, 58, 10, 0.90)', // Dark forest semi-transparent
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(143, 188, 143, 0.35)',
    ...Shadows.md,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.sageGreen,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.warmCream,
    width: 36,
    textAlign: 'right',
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.35,
  },
  stepBadge: {
    paddingHorizontal: 6,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.softIvory,
  },
  stepTotalText: {
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  speedSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 2,
  },
  speedPill: {
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderRadius: 12,
  },
  speedPillActive: {
    backgroundColor: Colors.sageGreen,
  },
  speedText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  speedTextActive: {
    color: Colors.darkForest,
    fontWeight: '700',
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  replayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  playPauseHeroBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.sageGreen,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.warmCream,
    ...Shadows.lg,
  },
  playIconOffset: {
    marginLeft: 3, // Optically center play triangle icon
  },
  spacerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimationPlayer;
