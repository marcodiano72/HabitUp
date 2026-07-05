// constants/theme.ts
export const Colors = {
  // Vibrant HabitUp Blue & Green
  primary: '#0084FF', // Premium Blue
  primaryDark: '#0059B3',
  primaryLight: '#B2DFDB', // Soft Aquamarine accent
  
  accent: '#00D084', // Premium Emerald Green
  success: '#00D084', // Emerald Green for success state
  warning: '#FF9500', // iOS orange
  danger: '#FF3B30', // iOS red

  // Light Mode Backgrounds
  background: '#E0F2F1', // Premium Light Aquamarine background
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#1E293B', // Slate 800
  textSecondary: '#64748B', // Slate 500
  textMuted: '#94A3B8', // Slate 400

  // Borders
  border: '#E2E8F0', // Slate 200

  // Difficulties
  beginner: '#00D084',
  intermediate: '#FF9500',
  advanced: '#FF3B30',

  tabBarActive: '#0084FF',
  tabBarInactive: '#94A3B8',
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
