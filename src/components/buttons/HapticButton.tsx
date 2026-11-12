import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';

export interface HapticButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
  children: React.ReactNode;
}

export function HapticButton({
  style,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  onPress,
  children,
  disabled,
  ...rest
}: HapticButtonProps) {
  const handlePress: PressableProps['onPress'] = (event) => {
    if (!disabled) {
      void Haptics.impactAsync(hapticStyle).catch(() => {
        // Haptics gracefully no-ops on unsupported platforms
      });
      onPress?.(event);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        typeof style === 'function' ? (style as (state: { pressed: boolean }) => ViewStyle)({ pressed }) : style,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
