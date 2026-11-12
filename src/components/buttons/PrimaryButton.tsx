import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { HapticButton } from './HapticButton';
import { useTheme } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  rightIcon,
  style,
  labelStyle,
  fullWidth = false,
}: PrimaryButtonProps) {
  const { colors, spacing, radius, typography } = useTheme();

  const getContainerStyles = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.xl,
    };

    // Size
    switch (size) {
      case 'sm':
        base.paddingVertical = spacing.sm;
        base.paddingHorizontal = spacing.base;
        base.minHeight = 38;
        break;
      case 'lg':
        base.paddingVertical = spacing.base;
        base.paddingHorizontal = spacing['2xl'];
        base.minHeight = 56;
        break;
      case 'md':
      default:
        base.paddingVertical = spacing.md;
        base.paddingHorizontal = spacing.xl;
        base.minHeight = 48;
        break;
    }

    // Variant
    switch (variant) {
      case 'secondary':
        base.backgroundColor = colors.secondary;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1.5;
        base.borderColor = colors.border.default;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      case 'primary':
      default:
        base.backgroundColor = colors.primary;
        break;
    }

    if (fullWidth) {
      base.width = '100%';
    }

    return base;
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'secondary':
        return '#FFFFFF'; // Clean white on coral
      case 'outline':
        return colors.text.primary;
      case 'ghost':
        return colors.primary;
      case 'primary':
      default:
        return '#FFFFFF';
    }
  };

  const isInteractiveDisabled = disabled || isLoading;

  return (
    <HapticButton
      onPress={onPress}
      disabled={isInteractiveDisabled}
      hapticStyle={Haptics.ImpactFeedbackStyle.Medium}
      style={[getContainerStyles(), style]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: isLoading, disabled: isInteractiveDisabled }}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={styles.spinner}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={{ marginRight: spacing.sm }}>{icon}</View> : null}
          <Text
            style={[
              typography.subtitle1,
              { color: getTextColor(), fontWeight: '700' },
              labelStyle,
            ]}
          >
            {label}
          </Text>
          {rightIcon ? (
            <View style={{ marginLeft: spacing.sm }}>{rightIcon}</View>
          ) : null}
        </View>
      )}
    </HapticButton>
  );
}

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    paddingVertical: 2,
  },
});
