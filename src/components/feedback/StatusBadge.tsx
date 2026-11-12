import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/theme';

export type StatusBadgeVariant =
  | 'amber'
  | 'mint'
  | 'slate'
  | 'cyan'
  | 'violet'
  | 'danger';

export interface StatusBadgeProps {
  label: string;
  variant?: StatusBadgeVariant;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function StatusBadge({
  label,
  variant = 'slate',
  icon,
  style,
  textStyle,
}: StatusBadgeProps) {
  const { colors, spacing, radius, typography, isDark } = useTheme();

  const getColors = (): { bg: string; text: string; border: string } => {
    switch (variant) {
      case 'amber':
        return {
          bg: isDark ? 'rgba(255, 107, 0, 0.16)' : 'rgba(255, 126, 103, 0.12)',
          text: colors.secondary,
          border: isDark ? 'rgba(255, 107, 0, 0.3)' : 'rgba(255, 126, 103, 0.25)',
        };
      case 'mint':
        return {
          bg: isDark ? 'rgba(16, 185, 129, 0.16)' : 'rgba(43, 183, 137, 0.12)',
          text: colors.primary,
          border: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(43, 183, 137, 0.25)',
        };
      case 'cyan':
        return {
          bg: isDark ? 'rgba(56, 189, 248, 0.16)' : 'rgba(14, 165, 233, 0.12)',
          text: isDark ? '#38BDF8' : '#0284C7',
          border: isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(14, 165, 233, 0.25)',
        };
      case 'violet':
        return {
          bg: isDark ? 'rgba(192, 132, 252, 0.16)' : 'rgba(139, 92, 246, 0.12)',
          text: isDark ? '#C084FC' : '#7C3AED',
          border: isDark ? 'rgba(192, 132, 252, 0.3)' : 'rgba(139, 92, 246, 0.25)',
        };
      case 'danger':
        return {
          bg: colors.status.errorSurface,
          text: colors.status.error,
          border: isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.25)',
        };
      case 'slate':
      default:
        return {
          bg: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.95)',
          text: colors.text.secondary,
          border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        };
    }
  };

  const palette = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderRadius: radius.full,
          paddingHorizontal: spacing.sm + 2,
          paddingVertical: spacing.xs,
        },
        style,
      ]}
    >
      {icon ? <View style={{ marginRight: spacing.xs }}>{icon}</View> : null}
      <Text
        style={[
          typography.caption,
          { color: palette.text, fontWeight: '600' },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
});
