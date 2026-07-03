// constants/theme.ts
export const Colors = {
  // Vibrant fitness orange
  primary: '#FF5722',
  primaryDark: '#E64A19',
  primaryLight: '#FF8A65',
  
  accent: '#03A9F4', // Fresh blue
  success: '#34C759', // iOS green
  warning: '#FF9500', // iOS orange
  danger: '#FF3B30', // iOS red

  // Light Mode Backgrounds
  background: '#F2F2F7', // iOS grouped background
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#000000',
  textSecondary: '#3C3C43', // iOS secondary label
  textMuted: '#8E8E93', // iOS tertiary label

  // Borders
  border: '#E5E5EA', // Light border

  // Difficulties
  beginner: '#34C759',
  intermediate: '#FF9500',
  advanced: '#FF3B30',

  tabBarActive: '#FF5722',
  tabBarInactive: '#8E8E93',
  tabBar: '#FFFFFF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
