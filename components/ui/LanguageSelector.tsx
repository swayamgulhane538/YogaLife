/**
 * YogaLife App Language Selector Component
 * Pill-shaped language toggle switch supporting Hindi (हिंदी) and English.
 * Uses a custom vector-drawn Indian Tricolor badge to prevent missing glyph (tofu box) issues.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../../stores/languageStore';

export interface LanguageSelectorProps {
  language?: 'en' | 'hi';
  onLanguageChange?: (lang: 'en' | 'hi') => void;
  style?: ViewStyle;
  compact?: boolean; // for header use
  variant?: 'compact' | 'standard' | 'segmented' | 'full';
}

/**
 * Custom-drawn Indian Tricolor Badge using pure vector/CSS Views.
 * Guaranteed to never fail, render as a tofu box (▯), or depend on system emoji fonts.
 */
export const IndiaFlagBadge: React.FC<{ size?: number }> = ({ size = 15 }) => {
  return (
    <View
      style={[
        styles.flagCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {/* Saffron Stripe */}
      <View style={[styles.flagStripe, { backgroundColor: '#FF9933' }]} />
      {/* White Stripe with Ashoka Chakra Dot */}
      <View style={[styles.flagStripe, styles.flagMiddle]}>
        <View
          style={[
            styles.chakraDot,
            {
              width: Math.max(3, Math.round(size * 0.28)),
              height: Math.max(3, Math.round(size * 0.28)),
              borderRadius: size,
            },
          ]}
        />
      </View>
      {/* India Green Stripe */}
      <View style={[styles.flagStripe, { backgroundColor: '#138808' }]} />
    </View>
  );
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language: propLanguage,
  onLanguageChange: propOnLanguageChange,
  style,
  compact = false,
  variant,
}) => {
  const store = useLanguageStore();
  const language = propLanguage || store.language;
  const onLanguageChange = propOnLanguageChange || store.setLanguage;
  const isCompact = compact || variant === 'compact';
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  return (
    <View
      style={[
        styles.pillContainer,
        isCompact ? styles.compactContainer : styles.standardContainer,
        style,
      ]}
      accessible={true}
      accessibilityRole="radiogroup"
      accessibilityLabel={
        language === 'hi'
          ? 'भाषा चयनकर्ता: हिंदी चयनित'
          : 'Language selector: English selected'
      }
    >
      {/* Hindi Option */}
      <TouchableOpacity
        style={[
          styles.optionButton,
          isCompact ? styles.compactButton : styles.standardButton,
          isHindi && styles.activeButton,
        ]}
        onPress={() => onLanguageChange('hi')}
        activeOpacity={0.7}
        accessibilityRole="radio"
        accessibilityState={{ selected: isHindi }}
        accessibilityLabel="हिंदी"
      >
        <View style={styles.optionContentRow}>
          <IndiaFlagBadge size={isCompact ? 13 : 16} />
          <Text
            style={[
              styles.optionText,
              isCompact ? styles.compactText : styles.standardText,
              isHindi ? styles.activeText : styles.inactiveText,
            ]}
          >
            {isCompact ? 'हिं' : 'हिंदी'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* English Option */}
      <TouchableOpacity
        style={[
          styles.optionButton,
          isCompact ? styles.compactButton : styles.standardButton,
          isEnglish && styles.activeButton,
        ]}
        onPress={() => onLanguageChange('en')}
        activeOpacity={0.7}
        accessibilityRole="radio"
        accessibilityState={{ selected: isEnglish }}
        accessibilityLabel="English"
      >
        <View style={styles.optionContentRow}>
          {!isCompact && (
            <Ionicons
              name="globe-outline"
              size={15}
              color={isEnglish ? '#FFFFFF' : '#4A4A4A'}
              style={{ marginRight: 4 }}
            />
          )}
          <Text
            style={[
              styles.optionText,
              isCompact ? styles.compactText : styles.standardText,
              isEnglish ? styles.activeText : styles.inactiveText,
            ]}
          >
            {isCompact ? 'EN' : 'English'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#A8D5A8',
    shadowColor: '#1A3A0A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  standardContainer: {
    padding: 3,
  },
  compactContainer: {
    padding: 2,
  },
  optionButton: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  standardButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    minHeight: 38,
  },
  compactButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 28,
  },
  activeButton: {
    backgroundColor: '#2D5016', // Deep Forest Green
    shadowColor: '#1A3A0A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  optionContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  flagCircle: {
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'space-between',
  },
  flagStripe: {
    flex: 1,
    width: '100%',
  },
  flagMiddle: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chakraDot: {
    backgroundColor: '#000080',
  },
  optionText: {
    fontWeight: '700',
  },
  standardText: {
    fontSize: 13,
  },
  compactText: {
    fontSize: 11,
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#3B523B',
  },
});

export default LanguageSelector;
