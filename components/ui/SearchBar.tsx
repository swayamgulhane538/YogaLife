import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useLanguageStore } from '../../stores/languageStore';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder,
  style,
}) => {
  const { t } = useLanguageStore();

  const effectivePlaceholder =
    placeholder || t('Search poses, routines...', 'आसन, दिनचर्या खोजें...');

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={[styles.container, style]}>
      <Ionicons
        name="search"
        size={20}
        color={Colors.deepForest}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={effectivePlaceholder}
        placeholderTextColor={Colors.textMuted}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {Boolean(value && value.length > 0) && (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.clearButton}
          accessibilityLabel={t('Clear search', 'खोज मिटाएं')}
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={18} color={Colors.deepForest} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.softGreenBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2ECE2',
    height: 48,
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 2,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;
