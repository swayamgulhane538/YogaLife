/**
 * YogaLife App Synchronized Subtitles Component
 * Displays narrated instruction text, breathing cues, and body focus indicators
 * with smooth fade transitions and bilingual Hindi/English typography.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface SubtitlesProps {
  text: string;
  language: 'en' | 'hi';
  breathing?: string;
  bodyFocus?: string;
  isVisible: boolean;
  style?: ViewStyle;
}

export const Subtitles: React.FC<SubtitlesProps> = ({
  text,
  language,
  breathing,
  bodyFocus,
  isVisible,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(8)).current;

  // Trigger smooth transition whenever instruction text updates
  useEffect(() => {
    if (isVisible && text && text.trim().length > 0) {
      fadeAnim.setValue(0);
      slideAnim.setValue(8);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [text, isVisible, fadeAnim, slideAnim]);

  if (!isVisible || !text || text.trim().length === 0) {
    return null;
  }

  // Helper to format breathing label and icon
  const getBreathingInfo = (b?: string) => {
    if (!b) return null;

    const lower = b.toLowerCase();
    if (lower === 'inhale') {
      return {
        icon: 'arrow-up-circle-outline' as const,
        label: language === 'hi' ? 'धीरे-धीरे सांस लें' : 'Inhale slowly',
      };
    }
    if (lower === 'exhale') {
      return {
        icon: 'arrow-down-circle-outline' as const,
        label: language === 'hi' ? 'धीरे-धीरे सांस छोड़ें' : 'Exhale smoothly',
      };
    }
    if (lower === 'hold') {
      return {
        icon: 'pause-circle-outline' as const,
        label: language === 'hi' ? 'श्वास रोकें' : 'Hold breath gently',
      };
    }
    if (lower === 'normal') {
      return {
        icon: 'leaf-outline' as const,
        label: language === 'hi' ? 'स्वाभाविक श्वास' : 'Breathe naturally',
      };
    }

    // Custom breathing text
    return {
      icon: 'pulse-outline' as const,
      label: b,
    };
  };

  const breathingInfo = getBreathingInfo(breathing);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
    >
      {/* Badges Row: Breathing & Body Focus */}
      {(breathingInfo || bodyFocus) && (
        <View style={styles.badgesRow}>
          {breathingInfo && (
            <View style={styles.breathingBadge}>
              <Ionicons
                name={breathingInfo.icon}
                size={15}
                color="#8FBC8F"
                style={styles.badgeIcon}
              />
              <Text style={styles.breathingBadgeText}>{breathingInfo.label}</Text>
            </View>
          )}

          {bodyFocus && (
            <View style={styles.focusBadge}>
              <Ionicons
                name="locate-outline"
                size={15}
                color="#DAA520"
                style={styles.badgeIcon}
              />
              <Text style={styles.focusBadgeText}>
                {language === 'hi'
                  ? `ध्यान: ${bodyFocus}`
                  : `Focus: ${bodyFocus}`}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Instruction Narration Text */}
      <Text
        style={[
          styles.instructionText,
          language === 'hi' && styles.hindiTextAdjustment,
        ]}
      >
        {text}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(26, 58, 10, 0.88)', // Deep Forest translucent overlay
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.35)', // Muted Light Gold glow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  breathingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(143, 188, 143, 0.22)', // Sage green tint
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(143, 188, 143, 0.4)',
  },
  breathingBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFF0',
  },
  focusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(218, 165, 32, 0.2)', // Light gold tint
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.4)',
  },
  focusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFF0',
  },
  badgeIcon: {
    marginRight: 5,
  },
  instructionText: {
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  hindiTextAdjustment: {
    lineHeight: 28,
    fontSize: 18,
  },
});

export default Subtitles;
