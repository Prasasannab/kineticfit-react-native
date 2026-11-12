import { TextStyle } from 'react-native';

/**
 * KineticFit Design System - Typography Tokens
 *
 * System font stack optimized for iOS San Francisco & Android Roboto.
 */

export const typography = {
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: -1.0,
  } as TextStyle,
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
  } as TextStyle,
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  } as TextStyle,
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: -0.2,
  } as TextStyle,
  subtitle1: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: -0.1,
  } as TextStyle,
  subtitle2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  } as TextStyle,
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } as TextStyle,
  labelBold: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  } as TextStyle,
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  } as TextStyle,
  overline: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,
  metricLarge: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  } as TextStyle,
  tabularNum: {
    fontVariant: ['tabular-nums'],
  } as TextStyle,
} as const;

export type ThemeTypography = typeof typography;
