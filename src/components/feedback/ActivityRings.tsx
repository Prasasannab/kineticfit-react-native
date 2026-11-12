import React, { useEffect } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ActivityRingMetric {
  current: number;
  target: number;
  color: string;
  backgroundColor: string;
}

export interface ActivityRingsProps {
  size?: number; // Outer diameter e.g. 150
  strokeWidth?: number; // Ring thickness e.g. 12
  ringSpacing?: number; // Spacing between rings e.g. 4
  move: ActivityRingMetric; // Outer ring (Calories)
  exercise: ActivityRingMetric; // Middle ring (Mins)
  stand: ActivityRingMetric; // Inner ring (Hours)
  style?: StyleProp<ViewStyle>;
}

interface SingleRingProps {
  cx: number;
  cy: number;
  radius: number;
  strokeWidth: number;
  color: string;
  backgroundColor: string;
  progress: number; // 0.0 to 1.0+
  animationDelay?: number;
}

function SingleRing({
  cx,
  cy,
  radius,
  strokeWidth,
  color,
  backgroundColor,
  progress,
  animationDelay = 0,
}: SingleRingProps) {
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(progress, 1.5));
    animatedProgress.value = withTiming(clamped, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, animatedProgress, animationDelay]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - Math.min(animatedProgress.value, 1));
    return {
      strokeDashoffset,
    };
  });

  return (
    <G rotation="-90" origin={`${cx}, ${cy}`}>
      {/* Background Track */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {/* Animated Foreground Progress */}
      <AnimatedCircle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeLinecap="round"
        fill="transparent"
        animatedProps={animatedProps}
      />
    </G>
  );
}

export function ActivityRings({
  size = 150,
  strokeWidth = 12,
  ringSpacing = 3,
  move,
  exercise,
  stand,
  style,
}: ActivityRingsProps) {
  const { colors } = useTheme();

  const center = size / 2;

  // Concentric radii from outer to inner
  const moveRadius = center - strokeWidth / 2;
  const exerciseRadius = moveRadius - strokeWidth - ringSpacing;
  const standRadius = exerciseRadius - strokeWidth - ringSpacing;

  const moveProgress = move.target > 0 ? move.current / move.target : 0;
  const exerciseProgress = exercise.target > 0 ? exercise.current / exercise.target : 0;
  const standProgress = stand.target > 0 ? stand.current / stand.target : 0;

  return (
    <View
      style={[styles.container, { width: size, height: size }, style]}
      accessibilityRole="image"
      accessibilityLabel={`Activity Rings: Move ${move.current} of ${move.target} kcal, Exercise ${exercise.current} of ${exercise.target} minutes, Stand ${stand.current} of ${stand.target} hours`}
    >
      <Svg width={size} height={size}>
        {/* Outer Ring: Move (Mint Green) */}
        <SingleRing
          cx={center}
          cy={center}
          radius={moveRadius}
          strokeWidth={strokeWidth}
          color={move.color || colors.activity.move}
          backgroundColor={move.backgroundColor || colors.activity.moveBg}
          progress={moveProgress}
          animationDelay={0}
        />

        {/* Middle Ring: Exercise (Electric Cyan) */}
        <SingleRing
          cx={center}
          cy={center}
          radius={exerciseRadius}
          strokeWidth={strokeWidth}
          color={exercise.color || colors.activity.exercise}
          backgroundColor={exercise.backgroundColor || colors.activity.exerciseBg}
          progress={exerciseProgress}
          animationDelay={200}
        />

        {/* Inner Ring: Stand (Electric Violet) */}
        <SingleRing
          cx={center}
          cy={center}
          radius={standRadius}
          strokeWidth={strokeWidth}
          color={stand.color || colors.activity.stand}
          backgroundColor={stand.backgroundColor || colors.activity.standBg}
          progress={standProgress}
          animationDelay={400}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
