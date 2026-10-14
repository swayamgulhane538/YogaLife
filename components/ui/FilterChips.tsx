import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/theme';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterChipsProps {
  options: FilterOption[];
  selected: string[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  selected,
  onSelect,
  multiSelect = false,
  style,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={[styles.container, style]}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option.value);

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.75}
            style={[
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipUnselected,
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={option.label}
          >
            <Text
              style={[
                styles.chipText,
                isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
              ]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.deepForest,
    borderWidth: 1,
    borderColor: Colors.deepForest,
  },
  chipUnselected: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: '#D4E2D4',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  chipTextUnselected: {
    color: Colors.textSecondary,
  },
});

export default FilterChips;
