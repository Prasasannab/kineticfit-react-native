import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';

export interface SurfaceCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'elevated' | 'sunken' | 'highest' | 'glass';
  activeBorder?: boolean;
}

export function SurfaceCard({
  children,
  style,
  onPress,
  variant = 'glass',
  activeBorder = false,
}: SurfaceCardProps) {
  const { colors, spacing, radius, shadows } = useTheme();

  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'highest':
        return colors.background.highest;
      case 'sunken':
        return colors.background.sunken;
      case 'glass':
        return colors.background.glass;
      case 'elevated':
      default:
        return colors.background.elevated;
    }
  };

  const getShadow = () => {
    if (variant === 'glass') return shadows.glass;
    if (variant === 'sunken') return shadows.none;
    return shadows.sm;
  };

  const cardStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: radius['2xl'],
    padding: spacing.base,
    borderWidth: 1,
    borderColor: activeBorder
      ? colors.primary
      : variant === 'glass'
      ? colors.border.card
      : colors.border.subtle,
    ...getShadow(),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          onPress();
        }}
        style={({ pressed }) => [
          cardStyle,
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
});
