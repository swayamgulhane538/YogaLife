// Theme configuration for YogaLife
// Re-exports from constants/theme.ts and adds additional theme utilities

export { Colors, Shadows } from '../constants/theme';

export const theme = {
  colors: {
    sageGreen: '#8FBC8F',
    deepForest: '#2D5016',
    darkForest: '#1A3A0A',
    warmCream: '#FFF8DC',
    softIvory: '#FFFFF0',
    mutedGold: '#B8860B',
    lightGold: '#DAA520',
    softGreenBg: '#F0F7F0',
    cardBg: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textMuted: '#8A8A8A',
    white: '#FFFFFF',
    border: '#E0EAE0',
    error: '#DC2626',
    success: '#16A34A',
    accentTeal: '#5F9EA0',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    title: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  shadows: {
    small: {
      shadowColor: '#1A3A0A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#1A3A0A',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: '#1A3A0A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};
