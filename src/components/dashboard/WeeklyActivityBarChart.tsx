import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { SurfaceCard } from '../cards/SurfaceCard';

export interface DayActivityData {
  day: string; // 'M' | 'T' | 'W' | 'T' | 'F' | 'S' | 'S'
  percentage: number; // 0 to 100
  isToday?: boolean;
}

export interface WeeklyActivityBarChartProps {
  data?: DayActivityData[];
  onSelectDay?: (day: DayActivityData) => void;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_DAYS: DayActivityData[] = [
  { day: 'M', percentage: 40 },
  { day: 'T', percentage: 65 },
  { day: 'W', percentage: 92, isToday: true },
  { day: 'T', percentage: 48 },
  { day: 'F', percentage: 70 },
  { day: 'S', percentage: 35 },
  { day: 'S', percentage: 45 },
];

export function WeeklyActivityBarChart({
  data = DEFAULT_DAYS,
  onSelectDay,
  style,
}: WeeklyActivityBarChartProps) {
  const { colors, typography, spacing, radius, isDark } = useTheme();

  return (
    <SurfaceCard variant="glass" style={[styles.card, style]}>
      <View style={styles.headerRow}>
        <Text style={[typography.subtitle1, styles.title, { color: colors.text.primary }]}>
          Weekly Activity
        </Text>
      </View>

      <View style={[styles.barsRow, { marginTop: spacing.md }]}>
        {data.map((item, index) => {
          const isToday = item.isToday ?? false;
          const barHeight = Math.max(14, Math.round((item.percentage / 100) * 68));

          return (
            <Pressable
              key={index}
              onPress={() => {
                void Haptics.selectionAsync().catch(() => {});
                onSelectDay?.(item);
              }}
              style={styles.dayCol}
            >
              {/* Bar Capsule Track */}
              <View
                style={[
                  styles.barTrack,
                  {
                    backgroundColor: isToday
                      ? isDark
                        ? 'rgba(16, 185, 129, 0.18)'
                        : 'rgba(43, 183, 137, 0.15)'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.07)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                ]}
              >
                {/* Filled Activity Bar */}
                <View
                  style={[
                    styles.barFill,
                    {
                      height: barHeight,
                      backgroundColor: isToday
                        ? colors.primary
                        : isDark
                        ? 'rgba(255, 255, 255, 0.28)'
                        : '#CBD5E1',
                      borderRadius: radius.full,
                    },
                  ]}
                />
              </View>

              {/* Day Label */}
              <Text
                style={[
                  typography.caption,
                  styles.dayLabel,
                  {
                    color: isToday ? colors.primary : colors.text.muted,
                    fontWeight: isToday ? '800' : '600',
                  },
                ]}
              >
                {item.day}
              </Text>

              {/* Today Active Dot Indicator */}
              <View style={styles.dotContainer}>
                {isToday ? (
                  <View
                    style={[
                      styles.todayDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  dayCol: {
    alignItems: 'center',
    width: 32,
  },
  barTrack: {
    width: 13,
    height: 72,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
  },
  dayLabel: {
    marginTop: 8,
    fontSize: 12,
  },
  dotContainer: {
    height: 6,
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
