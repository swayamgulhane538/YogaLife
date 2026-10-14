/**
 * YogaLife App Language Selector Component
 * Pill-shaped language toggle switch supporting Hindi (🇮🇳 हिंदी) and English.
 * Provides both full and compact header-friendly display modes.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { useLanguageStore } from '../../stores/languageStore';

export interface LanguageSelectorProps {
  language?: 'en' | 'hi';
  onLanguageChange?: (lang: 'en' | 'hi') => void;
  style?: ViewStyle;
  compact?: boolean; // for header use
  variant?: 'compact' | 'standard' | 'segmented' | 'full';
}

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
          compact ? styles.compactButton : styles.standardButton,
          isHindi && styles.activeButton,
        ]}
        onPress={() => onLanguageChange('hi')}
        activeOpacity={0.7}
        accessibilityRole="radio"
        accessibilityState={{ selected: isHindi }}
        accessibilityLabel="हिंदी"
      >
        <Text
          style={[
            styles.optionText,
            compact ? styles.compactText : styles.standardText,
            isHindi ? styles.activeText : styles.inactiveText,
          ]}
        >
          {compact ? '🇮🇳' : '🇮🇳 हिंदी'}
        </Text>
      </TouchableOpacity>

      {/* English Option */}
      <TouchableOpacity
        style={[
          styles.optionButton,
          compact ? styles.compactButton : styles.standardButton,
          isEnglish && styles.activeButton,
        ]}
        onPress={() => onLanguageChange('en')}
        activeOpacity={0.7}
        accessibilityRole="radio"
        accessibilityState={{ selected: isEnglish }}
        accessibilityLabel="English"
      >
        <Text
          style={[
            styles.optionText,
            compact ? styles.compactText : styles.standardText,
            isEnglish ? styles.activeText : styles.inactiveText,
          ]}
        >
          {compact ? 'EN' : 'English'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#8FBC8F', // Sage Green border
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44, // 44x44 accessibility requirement
    minWidth: 84,
  },
  compactButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    minHeight: 32,
    minWidth: 40,
  },
  activeButton: {
    backgroundColor: '#2D5016', // Deep Forest Green
    shadowColor: '#1A3A0A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  optionText: {
    fontWeight: '600',
  },
  standardText: {
    fontSize: 14,
  },
  compactText: {
    fontSize: 13,
  },
  activeText: {
    color: '#FFFFFF', // Soft White on Deep Forest
  },
  inactiveText: {
    color: '#4A4A4A', // Text Secondary
  },
});

export default LanguageSelector;
