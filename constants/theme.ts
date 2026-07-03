// constants/theme.ts

export const Colors = {
  // Palette principale — viola/indaco premium
  primary: '#6C63FF',
  primaryDark: '#5A54D4',
  primaryLight: '#EEF0FF',

  // Accenti
  accent: '#FF6584',
  accentLight: '#FFE8ED',

  // Successo / Avviso / Errore
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',

  // Difficoltà
  beginner: '#22C55E',
  intermediate: '#F59E0B',
  advanced: '#EF4444',

  // Neutrali
  background: '#0F0F1A',
  surface: '#1A1A2E',
  surfaceElevated: '#252540',
  border: '#2E2E4A',
  borderLight: '#3A3A5C',

  // Testo
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0C0',
  textMuted: '#606080',

  // Tab bar
  tabBar: '#12121F',
  tabBarActive: '#6C63FF',
  tabBarInactive: '#606080',
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
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
};
