/**
 * KineticFit Design System - Exact 100% Luxury Glassmorphism Palette
 *
 * Light Mode:
 * - Signature Jade Seafoam Green: #2BB789
 * - Signature Warm Peach / Apricot Coral: #FF8A65
 * - Ambient Canvas: Soft Eucalyptus (#E1F4EC) to Apricot Cream (#FFF0E6)
 * - Pure White Frosted Glass with Soft Neumorphic Ambient Shadows
 * - Deep Warm Slate Typography: #1E293B
 *
 * Dark Mode:
 * - Modern High-Energy Dark Slate: #0B0F19 & #0F172A
 * - Electric Emerald Mint: #10B981 & #34D399
 * - Electric Neon Amber: #FF6B00 & #FF8A3D
 * - Deep Obsidian Glass Cards: rgba(24, 34, 53, 0.75)
 * - Crisp High-Contrast Pure White Typography: #F8FAFC
 */

export const lightColors = {
  // Brand & Accent Colors
  primary: '#2BB789', // Exact Jade Seafoam Green from reference image
  primaryLight: '#4ADE80',
  primaryDark: '#209B73',
  primaryGlow: 'rgba(43, 183, 137, 0.22)',
  primarySurface: 'rgba(43, 183, 137, 0.1)',

  secondary: '#FF8A65', // Exact Warm Peach / Coral from reference image
  secondaryLight: '#FFA07A',
  secondaryDark: '#E65100',
  secondaryGlow: 'rgba(255, 138, 101, 0.22)',
  secondarySurface: 'rgba(255, 138, 101, 0.12)',

  // Category & Accent Palette
  accent: {
    mint: '#2BB789',
    mintSurface: 'rgba(43, 183, 137, 0.12)',
    peach: '#FF8A65',
    peachSurface: 'rgba(255, 138, 101, 0.12)',
    lilac: '#A78BFA',
    lilacSurface: 'rgba(167, 139, 250, 0.12)',
    amber: '#FBBF24',
    amberSurface: 'rgba(251, 191, 36, 0.12)',
    sky: '#38BDF8',
    skySurface: 'rgba(56, 189, 248, 0.12)',
  },

  // Activity Rings
  activity: {
    move: '#FF8A65', // Warm Coral / Move (Calories)
    moveBg: 'rgba(255, 138, 101, 0.18)',
    exercise: '#2BB789', // Jade Seafoam / Exercise (Mins)
    exerciseBg: 'rgba(43, 183, 137, 0.18)',
    stand: '#38BDF8', // Sky Blue / Stand (Hours)
    standBg: 'rgba(56, 189, 248, 0.18)',
    amberPulse: '#FBBF24',
  },

  // Backgrounds & Glassmorphic Surfaces
  background: {
    base: '#F7FBF9', // Soft warm alabaster base
    canvas: '#FAFDFB',
    elevated: '#FFFFFF', // Solid pure white card
    highest: '#FFFFFF',
    sunken: '#F1F5F9', // Inset search bars, capsule tracks
    glass: 'rgba(255, 255, 255, 0.90)', // Frosted glass surface
    glassDense: 'rgba(255, 255, 255, 0.96)',
    glassSubtle: 'rgba(255, 255, 255, 0.75)',
    card: '#FFFFFF',
    ambientSage: '#E1F4EC',
    ambientPeach: '#FFF0E6',
  },

  // Typography & Text (Deep Warm Slate for elegance and readability)
  text: {
    primary: '#1E293B', // Deep Charcoal (14:1 AAA contrast)
    secondary: '#475569', // Slate 600 (8.8:1 AAA contrast)
    muted: '#64748B', // Slate 500 (4.6:1 AA contrast compliant)
    subtle: '#94A3B8', // Soft placeholder
    inverse: '#FFFFFF', // Clean white
    onPrimary: '#FFFFFF',
    accent: '#2BB789',
  },

  // Borders & Glass Dividers
  border: {
    subtle: 'rgba(0, 0, 0, 0.05)',
    default: 'rgba(0, 0, 0, 0.08)',
    glass: 'rgba(0, 0, 0, 0.08)',
    card: 'rgba(0, 0, 0, 0.08)',
    focus: '#2BB789',
    success: '#2BB789',
  },

  // Status & Feedback
  status: {
    success: '#2BB789',
    successSurface: 'rgba(43, 183, 137, 0.12)',
    warning: '#FBBF24',
    warningSurface: 'rgba(251, 191, 36, 0.12)',
    error: '#EF4444',
    errorSurface: 'rgba(239, 68, 68, 0.12)',
    info: '#38BDF8',
    infoSurface: 'rgba(56, 189, 248, 0.12)',
  },

  // Interactive Elements
  interactive: {
    slotAvailable: '#FFFFFF',
    slotAvailableText: '#1E293B',
    slotSelected: '#2BB789',
    slotSelectedText: '#FFFFFF',
    slotReserved: '#F1F5F9',
    slotReservedText: '#94A3B8',
    slotLocked: 'rgba(43, 183, 137, 0.15)',
  },

  // Overlays
  overlay: {
    scrim: 'rgba(15, 23, 42, 0.4)',
    lightScrim: 'rgba(15, 23, 42, 0.2)',
    highlight: 'rgba(255, 255, 255, 0.6)',
  },
};

export type ThemeColors = typeof lightColors;

export const darkColors: ThemeColors = {
  // Brand & Accent Colors - High Voltage Neo-Performance
  primary: '#10B981', // Electric Emerald Mint (high contrast on dark slate)
  primaryLight: '#34D399',
  primaryDark: '#059669',
  primaryGlow: 'rgba(16, 185, 129, 0.32)',
  primarySurface: 'rgba(16, 185, 129, 0.15)',

  secondary: '#FF6B00', // Electric Amber / Coral from GEMINI.md
  secondaryLight: '#FF8A3D',
  secondaryDark: '#C2410C',
  secondaryGlow: 'rgba(255, 107, 0, 0.32)',
  secondarySurface: 'rgba(255, 107, 0, 0.15)',

  // Category & Accent Palette
  accent: {
    mint: '#10B981',
    mintSurface: 'rgba(16, 185, 129, 0.15)',
    peach: '#FF6B00',
    peachSurface: 'rgba(255, 107, 0, 0.15)',
    lilac: '#C084FC',
    lilacSurface: 'rgba(192, 132, 252, 0.15)',
    amber: '#F59E0B',
    amberSurface: 'rgba(245, 158, 11, 0.15)',
    sky: '#38BDF8',
    skySurface: 'rgba(56, 189, 248, 0.15)',
  },

  // Activity Rings (Vibrant on Dark)
  activity: {
    move: '#FF6B00',
    moveBg: 'rgba(255, 107, 0, 0.22)',
    exercise: '#10B981',
    exerciseBg: 'rgba(16, 185, 129, 0.22)',
    stand: '#38BDF8',
    standBg: 'rgba(56, 189, 248, 0.22)',
    amberPulse: '#F59E0B',
  },

  // Backgrounds & Glassmorphic Surfaces (Obsidian Slate & Velvet Depth)
  background: {
    base: '#0B0F19', // Midnight Obsidian
    canvas: '#060A12',
    elevated: '#182235', // Slate-800 elevated card
    highest: '#223048', // Slate-700
    sunken: '#080C14',
    glass: 'rgba(24, 34, 53, 0.78)', // Deep obsidian frosted glass
    glassDense: 'rgba(30, 41, 59, 0.90)',
    glassSubtle: 'rgba(15, 23, 42, 0.65)',
    card: '#131B2E',
    ambientSage: '#064E3B',
    ambientPeach: '#451A03',
  },

  // Typography & Text (Crisp Pure White & Slate High-Contrast Hierarchy)
  text: {
    primary: '#F8FAFC', // Crisp pure white
    secondary: '#CBD5E1', // Slate 300
    muted: '#94A3B8', // Slate 400
    subtle: '#64748B', // Slate 500
    inverse: '#0B0F19', // Dark inverse
    onPrimary: '#0B0F19',
    accent: '#10B981',
  },

  // Borders & Glass Dividers
  border: {
    subtle: 'rgba(255, 255, 255, 0.07)',
    default: 'rgba(255, 255, 255, 0.12)',
    glass: 'rgba(255, 255, 255, 0.12)',
    card: 'rgba(255, 255, 255, 0.14)',
    focus: '#10B981',
    success: '#10B981',
  },

  // Status & Feedback
  status: {
    success: '#10B981',
    successSurface: 'rgba(16, 185, 129, 0.16)',
    warning: '#F59E0B',
    warningSurface: 'rgba(245, 158, 11, 0.16)',
    error: '#F87171',
    errorSurface: 'rgba(248, 113, 113, 0.16)',
    info: '#38BDF8',
    infoSurface: 'rgba(56, 189, 248, 0.16)',
  },

  // Interactive Elements
  interactive: {
    slotAvailable: '#182235',
    slotAvailableText: '#F8FAFC',
    slotSelected: '#10B981',
    slotSelectedText: '#0B0F19',
    slotReserved: '#0B0F19',
    slotReservedText: '#64748B',
    slotLocked: 'rgba(16, 185, 129, 0.22)',
  },

  // Overlays
  overlay: {
    scrim: 'rgba(0, 0, 0, 0.78)',
    lightScrim: 'rgba(0, 0, 0, 0.48)',
    highlight: 'rgba(255, 255, 255, 0.12)',
  },
};

// Default export alias for backwards-compatibility
export const colors = lightColors;
