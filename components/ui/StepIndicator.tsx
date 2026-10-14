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
import { Colors } from '../../constants/theme';
import { useLanguageStore } from '../../stores/languageStore';

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep?: () => void;
  onNextStep?: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
  compact = false,
  style,
}) => {
  const { t } = useLanguageStore();

  const isPrevDisabled = !onPrevStep || currentStep <= 1;
  const isNextDisabled = !onNextStep || currentStep >= totalSteps;

  const validTotal = Math.max(1, totalSteps);
  const clampedStep = Math.min(Math.max(1, currentStep), validTotal);

  return (
    <View style={[styles.container, style]}>
      {/* Navigation Row */}
      <View style={styles.navRow}>
        <TouchableOpacity
          onPress={onPrevStep}
          disabled={isPrevDisabled}
          style={[styles.arrowButton, isPrevDisabled && styles.arrowButtonDisabled]}
          accessibilityLabel={t('Previous Step', 'पिछला चरण')}
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={isPrevDisabled ? Colors.textMuted : Colors.deepForest}
          />
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.stepText}>
            <Text style={styles.stepKeyword}>{t('Step', 'चरण')} </Text>
            <Text style={styles.stepNumber}>{clampedStep}</Text>
            <Text style={styles.stepOf}> {t('of', 'का')} </Text>
            <Text style={styles.stepTotal}>{validTotal}</Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress={onNextStep}
          disabled={isNextDisabled}
          style={[styles.arrowButton, isNextDisabled && styles.arrowButtonDisabled]}
          accessibilityLabel={t('Next Step', 'अगला चरण')}
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color={isNextDisabled ? Colors.textMuted : Colors.deepForest}
          />
        </TouchableOpacity>
      </View>

      {/* Progress Dots Indicator */}
      {!compact && validTotal > 1 && (
        <View style={styles.dotsContainer}>
          {Array.from({ length: validTotal }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < clampedStep;
            const isCurrent = stepNum === clampedStep;

            return (
              <View
                key={`step-dot-${stepNum}`}
                style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  isCurrent && styles.dotCurrent,
                  !isCompleted && !isCurrent && styles.dotFuture,
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.softGreenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButtonDisabled: {
    backgroundColor: '#F3F4F3',
    opacity: 0.5,
  },
  textContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  stepKeyword: {
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  stepNumber: {
    fontWeight: '700',
    color: Colors.deepForest,
  },
  stepOf: {
    color: Colors.textMuted,
  },
  stepTotal: {
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D2DED2',
  },
  dotFuture: {
    width: 7,
    backgroundColor: '#D9E3D9',
  },
  dotCompleted: {
    width: 7,
    backgroundColor: Colors.sageGreen,
  },
  dotCurrent: {
    width: 22,
    backgroundColor: Colors.deepForest,
  },
});

export default StepIndicator;
