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

export interface ThemedCardProps {
  title?: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap | string;
  iconColor?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  title,
  subtitle,
  icon,
  iconColor = Colors.deepForest,
  onPress,
  children,
  style,
  variant = 'default',
}) => {
  const hasHeader = Boolean(title || subtitle || icon);

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return [styles.card, styles.elevated];
      case 'outlined':
        return [styles.card, styles.outlined];
      case 'default':
      default:
        return [styles.card, styles.defaultVariant];
    }
  };

  const content = (
    <>
      {hasHeader && (
        <View style={[styles.header, children ? styles.headerWithMargin : undefined]}>
          {icon && (
            <View style={styles.iconContainer}>
              <Ionicons
                name={icon as keyof typeof Ionicons.glyphMap}
                size={22}
                color={iconColor}
              />
            </View>
          )}
          <View style={styles.headerTextContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      )}
      {children}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[getVariantStyle(), style]}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[getVariantStyle(), style]}>{content}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
  },
  defaultVariant: {
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: '#F0F3F0',
  },
  elevated: {
    ...Shadows.md,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: '#DCE7DC',
    shadowOpacity: 0,
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerWithMargin: {
    marginBottom: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.softGreenBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default ThemedCard;
