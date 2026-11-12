import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '@/theme';
import { SurfaceCard } from '../cards/SurfaceCard';

export interface TodayProgressGaugeProps {
  percentage?: number;
  workoutMins?: number;
  caloriesBurned?: number;
  stepsCount?: number;
  activeTimeString?: string;
  style?: StyleProp<ViewStyle>;
}

export function TodayProgressGaugeCard({
  percentage = 75,
  workoutMins = 45,
  caloriesBurned = 520,
  stepsCount = 8752,
  activeTimeString = '1h 15m',
  style,
}: TodayProgressGaugeProps) {
  const { colors, typography, spacing } = useTheme();

  const size = 94;
  const strokeWidth = 9;
  const ringRadius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference * (1 - Math.min(100, percentage) / 100);

  return (
    <SurfaceCard variant="glass" style={[styles.card, style]}>
      <Text style={[typography.subtitle1, styles.title, { color: colors.text.primary }]}>
        Today's Progress
      </Text>

      <View style={[styles.contentRow, { marginTop: spacing.md }]}>
        {/* Circular Gauge Ring */}
        <View style={styles.gaugeWrapper}>
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              {/* Background Track */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={ringRadius}
                stroke={colors.primarySurface}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress Stroke */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={ringRadius}
                stroke={colors.primary}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </G>
          </Svg>

          {/* Centered Percentage */}
          <View style={styles.gaugeTextOverlay}>
            <Text style={[typography.h3, styles.percentageText, { color: colors.text.primary }]}>
              {percentage}%
            </Text>
          </View>
        </View>

        {/* 4 Clean Metric Rows (Matching Screen 2 Reference) */}
        <View style={styles.metricsCol}>
          {/* 1. Workout Metric (Blue dot) */}
          <View style={styles.metricRow}>
            <View style={[styles.metricDot, { backgroundColor: '#38BDF8' }]} />
            <Text style={[typography.caption, styles.metricLabel, { color: colors.text.muted }]}>
              Workout
            </Text>
            <Text style={[typography.bodySmall, styles.metricValue, { color: colors.text.primary }]}>
              {workoutMins} min
            </Text>
          </View>

          {/* 2. Calories Metric (Coral dot) */}
          <View style={[styles.metricRow, { marginTop: 7 }]}>
            <View style={[styles.metricDot, { backgroundColor: colors.secondary }]} />
            <Text style={[typography.caption, styles.metricLabel, { color: colors.text.muted }]}>
              Calories
            </Text>
            <Text style={[typography.bodySmall, styles.metricValue, { color: colors.text.primary }]}>
              {caloriesBurned} kcal
            </Text>
          </View>

          {/* 3. Steps Metric (Jade Green dot) */}
          <View style={[styles.metricRow, { marginTop: 7 }]}>
            <View style={[styles.metricDot, { backgroundColor: colors.primary }]} />
            <Text style={[typography.caption, styles.metricLabel, { color: colors.text.muted }]}>
              Steps
            </Text>
            <Text style={[typography.bodySmall, styles.metricValue, { color: colors.text.primary }]}>
              {stepsCount.toLocaleString()}
            </Text>
          </View>

          {/* 4. Active Time Metric (Amber dot) */}
          <View style={[styles.metricRow, { marginTop: 7 }]}>
            <View style={[styles.metricDot, { backgroundColor: '#FBBF24' }]} />
            <Text style={[typography.caption, styles.metricLabel, { color: colors.text.muted }]}>
              Active Time
            </Text>
            <Text style={[typography.bodySmall, styles.metricValue, { color: colors.text.primary }]}>
              {activeTimeString}
            </Text>
          </View>
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 24,
  },
  title: {
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gaugeWrapper: {
    width: 94,
    height: 94,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  metricsCol: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 8,
  },
  metricLabel: {
    flex: 1,
    fontWeight: '600',
    fontSize: 12,
  },
  metricValue: {
    fontWeight: '700',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
});
