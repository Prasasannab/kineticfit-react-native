import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Check, Plus } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { SurfaceCard } from '@/components/cards/SurfaceCard';

export interface MealItem {
  id: string;
  category: string;
  name: string;
  calories: number;
  imageUrl: string;
  isLogged: boolean;
}

export function NutritionTrackerView() {
  const { colors, typography, spacing, radius, shadows, isDark } = useTheme();

  const [meals, setMeals] = useState<MealItem[]>([
    {
      id: 'm_1',
      category: 'Breakfast',
      name: 'Oatmeal with Fruits',
      calories: 450,
      imageUrl:
        'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=120&q=80',
      isLogged: true,
    },
    {
      id: 'm_2',
      category: 'Lunch',
      name: 'Grilled Chicken Salad',
      calories: 550,
      imageUrl:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80',
      isLogged: true,
    },
    {
      id: 'm_3',
      category: 'Dinner',
      name: 'Salmon with Veggies',
      calories: 450,
      imageUrl:
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=120&q=80',
      isLogged: false,
    },
    {
      id: 'm_4',
      category: 'Snacks',
      name: 'Greek Yogurt',
      calories: 150,
      imageUrl:
        'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=120&q=80',
      isLogged: false,
    },
  ]);

  const toggleMealLogged = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isLogged: !m.isLogged } : m))
    );
  };

  const totalCaloriesGoal = 2000;
  const currentCalories = meals
    .filter((m) => m.isLogged)
    .reduce((sum, m) => sum + m.calories, 0);

  const renderMacroRing = (
    label: string,
    grams: number,
    percentage: number,
    color: string
  ) => {
    const size = 68;
    const strokeWidth = 6.5;
    const r = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - percentage / 100);

    return (
      <View style={styles.macroCol}>
        <View style={styles.macroRingBox}>
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="transparent"
              />
            </G>
          </Svg>
          <View style={styles.macroTextOverlay}>
            <Text style={[typography.caption, styles.macroPercentText, { color: colors.text.primary }]}>
              {percentage}%
            </Text>
          </View>
        </View>

        <Text style={[typography.caption, { color: colors.text.muted, marginTop: 6, fontWeight: '600' }]}>
          {label}
        </Text>
        <Text style={[typography.bodySmall, styles.macroGramText, { color: colors.text.primary }]}>
          {grams}g
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Calorie Goal Glass Card (Screen 6 Reference) */}
      <SurfaceCard variant="glass" style={styles.calorieCard}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={[typography.caption, { color: colors.text.muted, fontWeight: '600' }]}>
              Calorie Goal
            </Text>
            <Text style={[typography.h2, styles.calorieBigValue, { color: colors.text.primary }]}>
              {totalCaloriesGoal.toLocaleString()}{' '}
              <Text style={[typography.bodyMedium, { color: colors.text.muted }]}>kcal</Text>
            </Text>
          </View>
          <Text style={[typography.bodyMedium, styles.calorieRatio, { color: colors.secondary }]}>
            {currentCalories.toLocaleString()} / {totalCaloriesGoal.toLocaleString()}
          </Text>
        </View>

        {/* Thick Coral Progress Bar */}
        <View
          style={[
            styles.progressTrack,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              marginTop: spacing.md,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(100, Math.round((currentCalories / totalCaloriesGoal) * 100))}%`,
                backgroundColor: colors.secondary,
                borderRadius: radius.full,
              },
            ]}
          />
        </View>

        {/* 3 Macro Rings Row (Carbs 180g / Protein 120g / Fats 60g) */}
        <View style={[styles.macroRow, { marginTop: spacing.lg }]}>
          {renderMacroRing('Carbs', 180, 45, colors.secondary)}
          {renderMacroRing('Protein', 120, 30, colors.primary)}
          {renderMacroRing('Fats', 60, 25, '#FBBF24')}
        </View>
      </SurfaceCard>

      {/* Today's Meals Section */}
      <View style={{ marginTop: spacing.lg }}>
        <Text style={[typography.subtitle1, { color: colors.text.primary, fontWeight: '800' }]}>
          Today's Meals
        </Text>

        <View style={{ marginTop: spacing.sm, gap: 10 }}>
          {meals.map((meal) => (
            <SurfaceCard
              key={meal.id}
              variant="glass"
              onPress={() => toggleMealLogged(meal.id)}
              style={styles.mealCard}
            >
              <View style={styles.mealRow}>
                {/* Circular Food Photo Thumbnail */}
                <View style={[styles.mealPhotoThumbWrapper, shadows.sm]}>
                  <Image
                    source={{ uri: meal.imageUrl }}
                    style={styles.mealPhotoThumb}
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[typography.caption, { color: colors.text.muted, fontWeight: '600' }]}>
                    {meal.category}
                  </Text>
                  <Text style={[typography.subtitle2, { color: colors.text.primary, fontWeight: '700' }]}>
                    {meal.name}
                  </Text>
                  <Text style={[typography.caption, styles.mealCalorieText, { color: colors.text.muted }]}>
                    {meal.calories} kcal
                  </Text>
                </View>

                {/* Status Toggle Button (Checkmark green circle or Plus circle) */}
                <Pressable
                  onPress={() => toggleMealLogged(meal.id)}
                  style={({ pressed }) => [
                    styles.statusPill,
                    meal.isLogged
                      ? { backgroundColor: colors.primary, ...shadows.glowMint }
                      : { backgroundColor: 'rgba(235, 240, 238, 0.9)', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.05)' },
                    pressed && { transform: [{ scale: 0.9 }] },
                  ]}
                >
                  {meal.isLogged ? (
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <Plus size={14} color={colors.text.muted} strokeWidth={2.4} />
                  )}
                </Pressable>
              </View>
            </SurfaceCard>
          ))}
        </View>
      </View>

      {/* "Log Food" Coral Pill Button (Screen 6 Reference) */}
      <View style={{ marginTop: spacing.xl, marginBottom: 50 }}>
        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            Alert.alert(
              'Quick Log Meal 🥗',
              'Choose a meal item to log for today:',
              [
                {
                  text: 'Protein Smoothie (+280 kcal)',
                  onPress: () => {
                    const newMeal: MealItem = {
                      id: `meal_${Date.now()}`,
                      category: 'Snack',
                      name: 'Wild Berry Protein Shake',
                      calories: 280,
                      imageUrl:
                        'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=120&q=80',
                      isLogged: true,
                    };
                    setMeals((prev) => [newMeal, ...prev]);
                    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                  },
                },
                {
                  text: 'Greek Yogurt Bowl (+210 kcal)',
                  onPress: () => {
                    const newMeal: MealItem = {
                      id: `meal_${Date.now()}`,
                      category: 'Snack',
                      name: 'Greek Yogurt & Honey',
                      calories: 210,
                      imageUrl:
                        'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=120&q=80',
                      isLogged: true,
                    };
                    setMeals((prev) => [newMeal, ...prev]);
                    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                  },
                },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
          style={({ pressed }) => [
            styles.logFoodButton,
            {
              backgroundColor: colors.secondary,
              borderRadius: radius.full,
              ...shadows.glowPeach,
            },
            pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] },
          ]}
        >
          <Text style={[typography.subtitle1, styles.logFoodText]}>
            Log Food
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  calorieCard: {
    padding: 18,
    borderRadius: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  calorieBigValue: {
    fontWeight: '900',
    fontSize: 24,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  calorieRatio: {
    fontWeight: '800',
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    width: '100%',
    height: 9,
    borderRadius: 4.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  macroCol: {
    alignItems: 'center',
  },
  macroRingBox: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  macroTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroPercentText: {
    fontWeight: '800',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  macroGramText: {
    fontWeight: '700',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  mealCard: {
    padding: 12,
    borderRadius: 20,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealPhotoThumbWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  mealPhotoThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mealCalorieText: {
    fontWeight: '600',
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  statusPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  logFoodButton: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logFoodText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: -0.2,
  },
});
