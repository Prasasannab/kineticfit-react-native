import { ViewStyle } from 'react-native';

/**
 * KineticFit Design System - Elevation & Shadows
 *
 * Soft, diffused ambient shadows tuned for luxury frosted glassmorphism.
 */

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,
  glass: {
    shadowColor: '#0F291E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  } as ViewStyle,
  sm: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  } as ViewStyle,
  md: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  } as ViewStyle,
  lg: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  } as ViewStyle,
  glowAmber: {
    shadowColor: '#FF7E67',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  } as ViewStyle,
  glowMint: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  } as ViewStyle,
  glowPeach: {
    shadowColor: '#FF7E67',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  } as ViewStyle,
} as const;

export type ThemeShadows = typeof shadows;

export const lightShadows: ThemeShadows = shadows;

export const darkShadows: ThemeShadows = {
  none: shadows.none,
  glass: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 4,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.40,
    shadowRadius: 14,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.50,
    shadowRadius: 24,
    elevation: 8,
  },
  glowAmber: {
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 5,
  },
  glowMint: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 5,
  },
  glowPeach: {
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 5,
  },
};
