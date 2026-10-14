import React from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

export interface PremiumButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: keyof typeof Ionicons.glyphMap | string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const isInteractionDisabled = disabled || loading;

  const getContainerStyle = (): StyleProp<ViewStyle> => {
    const baseVariant = (() => {
      switch (variant) {
        case 'secondary':
          return styles.secondaryContainer;
        case 'outline':
          return styles.outlineContainer;
        case 'ghost':
          return styles.ghostContainer;
        case 'primary':
        default:
          return styles.primaryContainer;
      }
    })();

    const baseSize = (() => {
      switch (size) {
        case 'small':
          return styles.smallContainer;
        case 'large':
          return styles.largeContainer;
        case 'medium':
        default:
          return styles.mediumContainer;
      }
    })();

    return [
      styles.baseButton,
      baseVariant,
      baseSize,
      fullWidth && styles.fullWidth,
      isInteractionDisabled && styles.disabled,
      style,
    ];
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'secondary':
        return Colors.darkForest;
      case 'outline':
      case 'ghost':
        return Colors.deepForest;
      case 'primary':
      default:
        return Colors.white;
    }
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const textColor = getTextColor();
    const sizeStyle = (() => {
      switch (size) {
        case 'small':
          return styles.smallText;
        case 'large':
          return styles.largeText;
        case 'medium':
        default:
          return styles.mediumText;
      }
    })();

    return [styles.baseText, { color: textColor }, sizeStyle];
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 22;
      case 'medium':
      default:
        return 19;
    }
  };

  const textColor = getTextColor();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={isInteractionDisabled}
      style={getContainerStyle()}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInteractionDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          size={size === 'small' ? 'small' : 'small'}
          color={textColor}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && (
            <Ionicons
              name={icon as keyof typeof Ionicons.glyphMap}
              size={getIconSize()}
              color={textColor}
              style={styles.icon}
            />
          )}
          <Text style={getTextStyle()} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },

  // Variants
  primaryContainer: {
    backgroundColor: Colors.deepForest,
    borderWidth: 0,
  },
  secondaryContainer: {
    backgroundColor: Colors.sageGreen,
    borderWidth: 0,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.deepForest,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },

  // Sizes
  smallContainer: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  mediumContainer: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  largeContainer: {
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 28,
  },

  // Text Styles
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});

export default PremiumButton;
