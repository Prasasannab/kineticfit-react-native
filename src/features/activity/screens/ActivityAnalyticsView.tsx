import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  Circle as SvgCircle,
} from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { SurfaceCard } from '@/components/cards/SurfaceCard';
import { ActivityRings } from '@/components/feedback/ActivityRings';
import { DailyActivityProgress } from '@/types';

export interface ActivityAnalyticsViewProps {
  metrics: DailyActivityProgress;
}

export function ActivityAnalyticsView({ metrics }: ActivityAnalyticsViewProps) {
  const { colors, typography, spacing, radius, shadows, isDark } = useTheme();

  const [timeframe, setTimeframe] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Week');
  const [weekOffset, setWeekOffset] = useState<number>(0);

  const timeframes: ('Day' | 'Week' | 'Month' | 'Year')[] = ['Day', 'Week', 'Month', 'Year'];

  const dateRangeLabel = React.useMemo(() => {
    if (weekOffset === 0) return 'May 12 – May 18 (This Week)';
    if (weekOffset === -1) return 'May 5 – May 11 (Last Week)';
    if (weekOffset < -1) return `${Math.abs(weekOffset)} Weeks Ago`;
    return 'Upcoming Week';
  }, [weekOffset]);

  // Smooth sinusoidal SVG spline path for calories
  // 7 days: M, T, W, T, F, S, S with peak on Friday (cx=225, cy=18)
  const chartWidth = 320;
  const chartHeight = 110;
  const linePath = 'M 10 75 C 50 85, 80 60, 120 40 C 160 20, 195 15, 225 18 C 255 22, 285 65, 310 50';
  const fillPath = `${linePath} L 310 ${chartHeight} L 10 ${chartHeight} Z`;

  return (
    <View style={styles.container}>
      {/* Timeframe Pill Switcher (Screen 5 Reference) */}
      <View
        style={[
          styles.timeframeBar,
          {
            backgroundColor: colors.background.glassDense,
            borderColor: colors.border.card,
            borderWidth: 1,
            ...shadows.sm,
          },
        ]}
      >
        {timeframes.map((tf) => {
          const isActive = timeframe === tf;
          return (
            <Pressable
              key={tf}
              onPress={() => {
                void Haptics.selectionAsync().catch(() => {});
                setTimeframe(tf);
              }}
              style={[
                styles.timeframeButton,
                isActive && [
                  styles.timeframeActive,
                  { backgroundColor: colors.primary },
                ],
              ]}
            >
              <Text
                style={[
                  typography.caption,
                  {
                    color: isActive ? '#FFFFFF' : colors.text.muted,
                    fontWeight: isActive ? '700' : '600',
                  },
                ]}
              >
                {tf}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Date Range Selector (< May 12 - May 18 >) */}
      <View style={styles.dateRangeRow}>
        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            setWeekOffset((prev) => prev - 1);
          }}
          hitSlop={8}
          style={styles.dateChevronBtn}
        >
          <ChevronLeft size={16} color={colors.text.muted} strokeWidth={2.4} />
        </Pressable>

        <Text style={[typography.caption, styles.dateRangeText, { color: colors.text.secondary }]}>
          {dateRangeLabel}
        </Text>

        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            setWeekOffset((prev) => Math.min(1, prev + 1));
          }}
          hitSlop={8}
          style={styles.dateChevronBtn}
        >
          <ChevronRight size={16} color={colors.text.muted} strokeWidth={2.4} />
        </Pressable>
      </View>

      {/* Calories Burned Smooth Spline Chart Card */}
      <SurfaceCard variant="glass" style={[styles.chartCard, { marginTop: spacing.xs }]}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={[typography.caption, { color: colors.text.muted, fontWeight: '600' }]}>
              Calories Burned
            </Text>
            <Text style={[typography.h2, styles.caloriesBigValue, { color: colors.text.primary }]}>
              2,450 <Text style={[typography.bodyMedium, { color: colors.text.muted }]}>kcal</Text>
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
              <ArrowUpRight size={13} color={colors.primary} />
              <Text style={[typography.caption, { color: colors.primary, fontWeight: '700', marginLeft: 2 }]}>
                12% vs last week
              </Text>
            </View>
          </View>

          {/* Peak Callout Badge (Floating '520' tag on peak) */}
          <View
            style={[
              styles.peakBadge,
              {
                backgroundColor: isDark ? colors.background.elevated : '#1E293B',
                borderColor: isDark ? colors.border.card : 'rgba(255, 255, 255, 0.95)',
              },
            ]}
          >
            <Text style={[typography.caption, styles.peakBadgeText]}>520</Text>
          </View>
        </View>

        {/* Sinusoidal Cubic Spline Curve with Gradient Fill */}
        <View style={[styles.chartCanvas, { marginTop: spacing.md }]}>
          <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            <Defs>
              <LinearGradient id="calorieGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={colors.secondary} stopOpacity="0.32" />
                <Stop offset="100%" stopColor={colors.secondary} stopOpacity="0.0" />
              </LinearGradient>
            </Defs>

            {/* Gradient Fill under spline */}
            <Path d={fillPath} fill="url(#calorieGrad)" />

            {/* Glowing Spline Line */}
            <Path
              d={linePath}
              stroke={colors.secondary}
              strokeWidth="3"
              strokeLinecap="round"
              fill="transparent"
            />

            {/* Peak Callout Dot at cx=225, cy=18 */}
            <SvgCircle cx="225" cy="18" r="5" fill={colors.secondary} stroke="#FFFFFF" strokeWidth="2.5" />
          </Svg>

          {/* Day Labels along X Axis */}
          <View style={styles.daysAxisRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <Text
                key={idx}
                style={[
                  typography.caption,
                  {
                    color: idx === 4 ? colors.secondary : colors.text.subtle,
                    fontWeight: idx === 4 ? '800' : '600',
                    fontSize: 12,
                  },
                ]}
              >
                {day}
              </Text>
            ))}
          </View>
        </View>
      </SurfaceCard>

      {/* Concentric Activity Rings Breakdown (Screen 5 Reference) */}
      <SurfaceCard variant="glass" style={[styles.ringsCard, { marginTop: spacing.md }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[typography.subtitle1, { color: colors.text.primary, fontWeight: '800' }]}>
            Activity Rings
          </Text>
        </View>

        <View style={[styles.ringsContent, { marginTop: spacing.md }]}>
          <ActivityRings
            size={116}
            strokeWidth={9.5}
            ringSpacing={3}
            move={{
              current: metrics.move.current,
              target: metrics.move.target,
              color: colors.activity.move,
              backgroundColor: colors.activity.moveBg,
            }}
            exercise={{
              current: metrics.exercise.current,
              target: metrics.exercise.target,
              color: colors.activity.exercise,
              backgroundColor: colors.activity.exerciseBg,
            }}
            stand={{
              current: metrics.stand.current,
              target: metrics.stand.target,
              color: colors.activity.stand,
              backgroundColor: colors.activity.standBg,
            }}
          />

          <View style={styles.ringsLegendCol}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.activity.move }]} />
              <Text style={[typography.caption, styles.legendLabel, { color: colors.text.muted }]}>Move</Text>
              <Text style={[typography.subtitle2, styles.legendVal, { color: colors.text.primary }]}>
                {metrics.move.current}/{metrics.move.target} kcal
              </Text>
            </View>

            <View style={[styles.legendItem, { marginTop: 10 }]}>
              <View style={[styles.legendDot, { backgroundColor: colors.activity.exercise }]} />
              <Text style={[typography.caption, styles.legendLabel, { color: colors.text.muted }]}>Exercise</Text>
              <Text style={[typography.subtitle2, styles.legendVal, { color: colors.text.primary }]}>
                {metrics.exercise.current}/{metrics.exercise.target} min
              </Text>
            </View>

            <View style={[styles.legendItem, { marginTop: 10 }]}>
              <View style={[styles.legendDot, { backgroundColor: colors.activity.stand }]} />
              <Text style={[typography.caption, styles.legendLabel, { color: colors.text.muted }]}>Stand</Text>
              <Text style={[typography.subtitle2, styles.legendVal, { color: colors.text.primary }]}>
                {metrics.stand.current}/{metrics.stand.target} hr
              </Text>
            </View>
          </View>
        </View>
      </SurfaceCard>

      {/* Steps Card with Mini 7-Bar Chart (Screen 5 Reference) */}
      <SurfaceCard variant="glass" style={[styles.stepsCard, { marginTop: spacing.md, marginBottom: 30 }]}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={[typography.caption, { color: colors.text.muted, fontWeight: '600' }]}>
              Steps
            </Text>
            <Text style={[typography.h2, styles.stepsBigValue, { color: colors.text.primary }]}>
              8,752 <Text style={[typography.bodyMedium, { color: colors.text.muted }]}>Steps</Text>
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
              <ArrowUpRight size={13} color={colors.primary} />
              <Text style={[typography.caption, { color: colors.primary, fontWeight: '700', marginLeft: 2 }]}>
                8% vs last week
              </Text>
            </View>
          </View>

          {/* Mini 7-Day Steps Bars (Screen 5) */}
          <View style={styles.miniStepsBars}>
            {[45, 60, 95, 70, 85, 40, 50].map((h, i) => (
              <View
                key={i}
                style={[
                  styles.miniBar,
                  {
                    height: (h / 100) * 44,
                    backgroundColor: i === 2 ? colors.primary : colors.primarySurface,
                    borderRadius: radius.full,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  timeframeBar: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 3,
    borderWidth: 1,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 13,
  },
  timeframeActive: {
    shadowColor: '#2BB789',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  dateRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  dateChevronBtn: {
    padding: 4,
  },
  dateRangeText: {
    fontWeight: '700',
    fontSize: 13,
    marginHorizontal: 10,
    letterSpacing: -0.1,
  },
  chartCard: {
    padding: 18,
    borderRadius: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  caloriesBigValue: {
    fontWeight: '900',
    fontSize: 24,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  peakBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  peakBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
  chartCanvas: {
    alignItems: 'center',
  },
  daysAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    marginTop: 6,
  },
  ringsCard: {
    padding: 18,
    borderRadius: 24,
  },
  ringsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringsLegendCol: {
    flex: 1,
    marginLeft: 18,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontWeight: '600',
    fontSize: 12,
  },
  legendVal: {
    fontWeight: '700',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  stepsCard: {
    padding: 18,
    borderRadius: 24,
  },
  stepsBigValue: {
    fontWeight: '900',
    fontSize: 24,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  miniStepsBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 48,
    gap: 4,
  },
  miniBar: {
    width: 6,
  },
});
