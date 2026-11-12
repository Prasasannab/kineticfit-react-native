import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { WorkoutRoutine } from '@/types';
import { useTheme } from '@/theme';
import { SurfaceCard } from './SurfaceCard';

export interface WorkoutCardProps {
  routine: WorkoutRoutine;
  onPress: (routine: WorkoutRoutine) => void;
  style?: StyleProp<ViewStyle>;
}

export function WorkoutCard({ routine, onPress, style }: WorkoutCardProps) {
  const { colors, typography, radius, shadows, isDark } = useTheme();

  // Distinct warm pastel tint for right image box matching reference (adaptive for dark mode)
  const imageBgColor = isDark
    ? routine.category === 'HIIT'
      ? 'rgba(255, 107, 0, 0.18)'
      : routine.category === 'Core'
      ? 'rgba(167, 139, 250, 0.18)'
      : 'rgba(16, 185, 129, 0.18)'
    : routine.category === 'HIIT'
    ? 'rgba(255, 239, 230, 0.95)'
    : routine.category === 'Core'
    ? 'rgba(255, 243, 235, 0.95)'
    : 'rgba(235, 247, 242, 0.95)';

  return (
    <SurfaceCard
      variant="glass"
      style={[styles.card, style]}
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress(routine);
      }}
    >
      <View style={styles.cardContentRow}>
        {/* Left Column: Title, Duration/Calories, and Circular Chevron Button */}
        <View style={styles.leftInfoCol}>
          <View>
            <Text
              style={[
                typography.subtitle1,
                styles.routineTitle,
                { color: colors.text.primary, fontWeight: '800' },
              ]}
              numberOfLines={2}
            >
              {routine.title}
            </Text>

            <Text
              style={[
                typography.caption,
                styles.metaText,
                { color: isDark ? colors.text.muted : colors.text.secondary, fontWeight: '600' },
              ]}
            >
              {routine.durationMinutes} min | {routine.estimatedCaloriesBurn} kcal
            </Text>
          </View>

          {/* Circular Chevron Arrow Button (Screen 3 Reference) */}
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              onPress(routine);
            }}
            style={({ pressed }) => [
              styles.chevronButton,
              {
                backgroundColor: isDark ? colors.background.glassDense : colors.background.sunken,
                borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
                ...shadows.sm,
              },
              pressed && { transform: [{ scale: 0.92 }] },
            ]}
          >
            <ChevronRight size={16} color={colors.text.primary} strokeWidth={2.6} />
          </Pressable>
        </View>

        {/* Right Athlete Cutout Image in Pastel Rounded Stage */}
        <View
          style={[
            styles.imageWrapper,
            {
              backgroundColor: imageBgColor,
              borderRadius: radius.xl,
            },
          ]}
        >
          <Image
            source={{ uri: routine.coverImageUrl }}
            style={styles.athleteImage}
          />

          {/* Subtle 3D Animatic Pill */}
          <View
            style={[
              styles.animaticPill,
              { backgroundColor: 'rgba(43, 183, 137, 0.92)' },
            ]}
          >
            <Sparkles size={8} color="#FFFFFF" />
            <Text style={styles.animaticText}>3D</Text>
          </View>
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 24,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftInfoCol: {
    flex: 1,
    paddingRight: 14,
    justifyContent: 'space-between',
    minHeight: 110,
  },
  routineTitle: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  metaText: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    fontVariant: ['tabular-nums'],
  },
  chevronButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: 112,
    height: 112,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  athleteImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  animaticPill: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  animaticText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
