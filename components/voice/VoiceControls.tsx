/**
 * YogaLife App Voice Controls Component
 * Touch-friendly audio control bar with speed pills, action buttons, and animated speaking indicator.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../../stores/languageStore';

export interface VoiceControlsProps {
  isPlaying: boolean;
  isSpeaking: boolean;
  speed: number;
  onPlayPause: () => void;
  onStop: () => void;
  onReplay: () => void;
  onSpeedChange: (speed: number) => void;
  style?: ViewStyle;
}

const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5];

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isPlaying,
  isSpeaking,
  speed,
  onPlayPause,
  onStop,
  onReplay,
  onSpeedChange,
  style,
}) => {
  const { language } = useLanguageStore();

  // Pulse animation for the speaking indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    if (isSpeaking) {
      animation = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.35,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1.0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 1.0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.5,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
      opacityAnim.setValue(0.4);
    }

    return () => {
      animation?.stop();
    };
  }, [isSpeaking, pulseAnim, opacityAnim]);

  return (
    <View style={[styles.container, style]}>
      {/* Top Bar: Action Buttons & Speaking Indicator */}
      <View style={styles.controlsRow}>
        {/* Replay Button */}
        <TouchableOpacity
          style={styles.circleButton}
          onPress={onReplay}
          accessibilityLabel={language === 'hi' ? 'दोहराएं' : 'Replay step'}
          accessibilityRole="button"
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={22} color="#2D5016" />
        </TouchableOpacity>

        {/* Primary Play / Pause Button */}
        <TouchableOpacity
          style={[styles.primaryButton, isPlaying && styles.primaryButtonActive]}
          onPress={onPlayPause}
          accessibilityLabel={
            isPlaying
              ? language === 'hi'
                ? 'रोकें'
                : 'Pause session'
              : language === 'hi'
              ? 'प्रारंभ करें'
              : 'Play session'
          }
          accessibilityRole="button"
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={26}
            color="#FFFFFF"
            style={!isPlaying ? styles.playIconOffset : undefined}
          />
        </TouchableOpacity>

        {/* Stop Button */}
        <TouchableOpacity
          style={styles.circleButton}
          onPress={onStop}
          accessibilityLabel={language === 'hi' ? 'समाप्त करें' : 'Stop session'}
          accessibilityRole="button"
          activeOpacity={0.7}
        >
          <Ionicons name="square" size={18} color="#2D5016" />
        </TouchableOpacity>

        {/* Speaking Status Indicator */}
        <View style={styles.indicatorContainer}>
          <Animated.View
            style={[
              styles.speakingDot,
              isSpeaking ? styles.speakingDotActive : styles.speakingDotInactive,
              {
                transform: [{ scale: pulseAnim }],
                opacity: opacityAnim,
              },
            ]}
          />
          <Text style={styles.indicatorText}>
            {isSpeaking
              ? language === 'hi'
                ? 'निर्देश जारी'
                : 'Speaking'
              : isPlaying
              ? language === 'hi'
                ? 'ध्यान केंद्रित करें'
                : 'Holding'
              : language === 'hi'
              ? 'विश्राम'
              : 'Paused'}
          </Text>
        </View>
      </View>

      {/* Speed Selector Pills */}
      <View style={styles.speedRow}>
        <Text style={styles.speedLabel}>
          {language === 'hi' ? 'गति:' : 'Speed:'}
        </Text>
        <View style={styles.speedPillsContainer}>
          {SPEED_OPTIONS.map((opt) => {
            const isSelected = Math.abs(speed - opt) < 0.05;
            return (
              <TouchableOpacity
                key={`speed-${opt}`}
                style={[styles.speedPill, isSelected && styles.speedPillActive]}
                onPress={() => onSpeedChange(opt)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${opt}x speed`}
              >
                <Text
                  style={[
                    styles.speedPillText,
                    isSelected && styles.speedPillTextActive,
                  ]}
                >
                  {opt}x
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8DC', // Warm Cream
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0EAE0',
    shadowColor: '#1A3A0A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  circleButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#8FBC8F', // Sage Green
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A3A0A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  primaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2D5016', // Deep Forest Green
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A3A0A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonActive: {
    backgroundColor: '#1A3A0A', // Dark Forest
  },
  playIconOffset: {
    marginLeft: 3, // Visual optical center for triangle play icon
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(143, 188, 143, 0.25)', // Soft Sage overlay
  },
  speakingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  speakingDotActive: {
    backgroundColor: '#2D5016', // Vibrant Forest Green
  },
  speakingDotInactive: {
    backgroundColor: '#8A8A8A', // Muted Gray
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D5016',
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(45, 80, 22, 0.12)',
    paddingTop: 10,
  },
  speedLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  speedPillsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  speedPill: {
    minWidth: 46,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(143, 188, 143, 0.3)', // Soft Sage pill
    borderWidth: 1,
    borderColor: 'transparent',
  },
  speedPillActive: {
    backgroundColor: '#2D5016', // Deep Forest
    borderColor: '#1A3A0A',
  },
  speedPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D5016',
  },
  speedPillTextActive: {
    color: '#FFFFF0', // Soft Ivory
  },
});

export default VoiceControls;
