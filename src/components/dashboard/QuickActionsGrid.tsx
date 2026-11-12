import React from 'react';
import { StyleSheet, Text, View, Pressable, StyleProp, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Dumbbell, Utensils, Activity, Trophy } from 'lucide-react-native';
import { useTheme } from '@/theme';

export interface QuickActionItem {
  id: string;
  title: string;
  icon: 'workout' | 'food' | 'stats' | 'challenges';
  color: string;
  iconBg: string;
  onPress: () => void;
}

export interface QuickActionsGridProps {
  onStartWorkout: () => void;
  onLogFood: () => void;
  onBodyStats: () => void;
  onChallenges: () => void;
  style?: StyleProp<ViewStyle>;
}

export function QuickActionsGrid({
  onStartWorkout,
  onLogFood,
  onBodyStats,
  onChallenges,
  style,
}: QuickActionsGridProps) {
  const { colors, typography, spacing, shadows, isDark, radius } = useTheme();

  const actions: QuickActionItem[] = [
    {
      id: 'start_workout',
      title: 'Start\nWorkout',
      icon: 'workout',
      color: colors.primary,
      iconBg: isDark ? 'rgba(16, 185, 129, 0.16)' : 'rgba(43, 183, 137, 0.12)',
      onPress: onStartWorkout,
    },
    {
      id: 'log_food',
      title: 'Log\nFood',
      icon: 'food',
      color: colors.secondary,
      iconBg: isDark ? 'rgba(255, 107, 0, 0.16)' : 'rgba(255, 138, 101, 0.12)',
      onPress: onLogFood,
    },
    {
      id: 'body_stats',
      title: 'Body\nStats',
      icon: 'stats',
      color: '#A78BFA',
      iconBg: isDark ? 'rgba(167, 139, 250, 0.16)' : 'rgba(167, 139, 250, 0.12)',
      onPress: onBodyStats,
    },
    {
      id: 'challenges',
      title: 'Active\nChallenges',
      icon: 'challenges',
      color: '#FBBF24',
      iconBg: isDark ? 'rgba(251, 191, 36, 0.16)' : 'rgba(251, 191, 36, 0.12)',
      onPress: onChallenges,
    },
  ];

  const renderIcon = (type: string, color: string) => {
    switch (type) {
      case 'workout':
        return <Dumbbell size={20} color={color} strokeWidth={2.4} />;
      case 'food':
        return <Utensils size={20} color={color} strokeWidth={2.4} />;
      case 'stats':
        return <Activity size={20} color={color} strokeWidth={2.4} />;
      case 'challenges':
      default:
        return <Trophy size={20} color={color} strokeWidth={2.4} />;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[typography.subtitle1, styles.sectionTitle, { color: colors.text.primary }]}>
        Quick Actions
      </Text>

      <View style={[styles.grid, { marginTop: spacing.sm }]}>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              action.onPress();
            }}
            style={({ pressed }) => [
              styles.tile,
              {
                backgroundColor: isDark ? colors.background.glassDense : '#FFFFFF',
                borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
                borderRadius: radius.xl,
                ...shadows.sm,
              },
              pressed && styles.tilePressed,
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: action.iconBg }]}>
              {renderIcon(action.icon, action.color)}
            </View>

            <Text
              style={[
                typography.caption,
                styles.tileText,
                { color: colors.text.primary, fontWeight: '700' },
              ]}
              numberOfLines={2}
            >
              {action.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionTitle: {
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  tile: {
    width: '48.2%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: {
    marginLeft: 12,
    fontSize: 13,
    lineHeight: 17,
    flex: 1,
  },
  tilePressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
});
