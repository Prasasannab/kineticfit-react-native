import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface AnimatedTimerDialProps {
  secondsRemaining: number;
  totalSeconds: number;
  formattedTime: string;
  isRest: boolean;
  size?: number;
}

export function AnimatedTimerDial({
  secondsRemaining,
  totalSeconds,
  formattedTime,
  isRest,
  size = 170,
}: AnimatedTimerDialProps) {
  const { colors, typography } = useTheme();

  const strokeWidth = Math.max(5, Math.round(size * 0.075));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Fraction remaining 1.0 (start) down to 0.0 (end)
  const fraction = totalSeconds > 0 ? Math.max(0, secondsRemaining / totalSeconds) : 0;
  const animatedFraction = useSharedValue(fraction);

  useEffect(() => {
    animatedFraction.value = withTiming(fraction, {
      duration: 350,
      easing: Easing.linear,
    });
  }, [fraction, animatedFraction]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedFraction.value);
    return {
      strokeDashoffset,
    };
  });

  const activeColor = isRest ? colors.secondary : colors.primary;
  const trackColor = isRest ? 'rgba(255, 138, 101, 0.18)' : 'rgba(43, 183, 137, 0.18)';

  const timerFontSize = Math.round(size * 0.23);
  const labelFontSize = Math.max(8, Math.round(size * 0.10));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Foreground Countdown Ring */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            fill="transparent"
            animatedProps={animatedProps}
          />
        </G>
      </Svg>

      {/* Centered Digital Timer Display */}
      <View style={styles.centerOverlay}>
        <Text
          style={[
            typography.metricLarge,
            styles.timerText,
            { color: activeColor, fontSize: timerFontSize },
          ]}
        >
          {formattedTime}
        </Text>
        <Text
          style={[
            typography.caption,
            {
              color: colors.text.muted,
              fontWeight: '800',
              textTransform: 'uppercase',
              fontSize: labelFontSize,
              marginTop: 1,
            },
          ]}
        >
          {isRest ? 'Rest' : 'Work'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontWeight: '900',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
});
