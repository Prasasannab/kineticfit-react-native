import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  Bell,
  CheckCircle2,
  Clock,
  Dumbbell,
  Menu,
  Moon,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Sun,
  Video,
} from 'lucide-react-native';
import {
  BookingSession,
  DailyActivityProgress,
  Trainer,
  TrainerSpecialty,
  WorkoutRoutine,
} from '@/types';
import { useTheme } from '@/theme';
import {
  SurfaceCard,
  StatusBadge,
  TrainerCard,
  WorkoutCard,
  TodayProgressGaugeCard,
  WeeklyActivityBarChart,
  QuickActionsGrid,
  FloatingGlassTabBar,
  ActiveNavTab,
  AmbientCanvasBackground,
} from '@/components';
import { MOCK_TRAINERS } from '@/features/trainers/data/mockTrainers';
import { MOCK_WORKOUTS } from '@/features/workouts/data/mockWorkouts';
import { TrainerDetailModal } from '@/features/trainers/screens/TrainerDetailModal';
import { WorkoutPlayerModal } from '@/features/workouts/screens/WorkoutPlayerModal';
import { ActivityAnalyticsView } from '@/features/activity/screens/ActivityAnalyticsView';
import { NutritionTrackerView } from '@/features/nutrition/screens/NutritionTrackerView';
import { OnboardingModal } from '@/features/onboarding/screens/OnboardingModal';
import { NotificationsModal } from '@/features/notifications';
import { appStorage, STORAGE_KEYS, storageService } from '@/services/storage';
import { formatLocalTime } from '@/features/booking/utils/timezone';

export default function IndexScreen() {
  const insets = useSafeAreaInsets();
  const { colors, spacing, typography, radius, shadows, isDark, toggleTheme } = useTheme();

  // Active Bottom Navigation Tab
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('home');

  // Booking Modal State
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isTrainerModalVisible, setIsTrainerModalVisible] = useState<boolean>(false);

  // Workout Player Modal State
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(() => MOCK_WORKOUTS[0]);
  const [isWorkoutModalVisible, setIsWorkoutModalVisible] = useState<boolean>(false);

  // Onboarding Welcome Screen Modal State (Screen 1 from reference)
  const [isOnboardingVisible, setIsOnboardingVisible] = useState<boolean>(false);

  // Dedicated Notifications Screen Modal State
  const [isNotificationsVisible, setIsNotificationsVisible] = useState<boolean>(false);

  // Filter specialty for trainers
  const [activeSpecialty, setActiveSpecialty] = useState<string>('All');

  // Filter category for workouts tab
  const [workoutCategory, setWorkoutCategory] = useState<string>('All');
  const [workoutSearchQuery, setWorkoutSearchQuery] = useState<string>('');

  // Stored booking history from synchronous MMKV
  const [bookingHistory, setBookingHistory] = useState<BookingSession[]>([]);

  // Daily Activity Metrics from MMKV
  const [activityMetrics, setActivityMetrics] = useState<DailyActivityProgress>(() => {
    return (
      storageService.getCachedActivity<DailyActivityProgress>() ?? {
        date: new Date().toISOString().split('T')[0],
        move: { current: 520, target: 600, unit: 'kcal', percentage: 86 },
        exercise: { current: 35, target: 45, unit: 'mins', percentage: 78 },
        stand: { current: 10, target: 12, unit: 'hours', percentage: 83 },
        steps: 8752,
        activeEnergyBurnedKcal: 520,
        currentHeartRateBpm: 138,
        restingHeartRateBpm: 56,
        streakDays: 4,
      }
    );
  });

  const refreshActivityAndBookings = () => {
    const history = appStorage.getObject<BookingSession[]>(STORAGE_KEYS.BOOKING_HISTORY) ?? [];
    setBookingHistory(history);

    const cachedAct = storageService.getCachedActivity<DailyActivityProgress>();
    if (cachedAct) {
      setActivityMetrics(cachedAct);
    }
  };

  useEffect(() => {
    refreshActivityAndBookings();
  }, []);

  const handleBookTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsTrainerModalVisible(true);
  };

  const handleStartWorkout = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine);
    setIsWorkoutModalVisible(true);
  };

  const handleBookingConfirmed = (_newBooking: BookingSession) => {
    refreshActivityAndBookings();
  };

  const handleWorkoutCompleted = () => {
    refreshActivityAndBookings();
  };

  const specialtyFilters = [
    'All',
    'HIIT',
    'Functional Strength',
    'CrossFit',
    'Mobility & Recovery',
  ];

  const workoutCategories = ['All', 'Strength', 'Cardio', 'Yoga', 'HIIT'];

  const filteredTrainers = MOCK_TRAINERS.filter((t) => {
    if (activeSpecialty === 'All') return true;
    return t.specialties.includes(activeSpecialty as TrainerSpecialty);
  });

  const filteredWorkouts = MOCK_WORKOUTS.filter((w) => {
    const matchesCategory =
      workoutCategory === 'All' ||
      w.category.toLowerCase().includes(workoutCategory.toLowerCase()) ||
      (workoutCategory === 'Yoga' && w.category === 'Mobility');

    const matchesSearch =
      !workoutSearchQuery.trim() ||
      w.title.toLowerCase().includes(workoutSearchQuery.toLowerCase()) ||
      w.instructorName.toLowerCase().includes(workoutSearchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <View style={[styles.canvas, { backgroundColor: colors.background.base }]}>
      {/* Luxury Ambient Halo Canvas Background */}
      <AmbientCanvasBackground />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 20, 68),
            paddingBottom: insets.bottom + 140,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= TOP HEADER (All Tabs) ================= */}
        <View style={styles.headerRow}>
          <View style={styles.userProfileRow}>
            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setIsOnboardingVisible(true);
              }}
              style={({ pressed }) => [
                styles.menuButton,
                {
                  backgroundColor: colors.background.glassDense,
                  borderColor: colors.border.card,
                  ...shadows.sm,
                },
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
            >
              <Menu size={20} color={colors.text.primary} strokeWidth={2.4} />
            </Pressable>

            <View style={{ marginLeft: 12 }}>
              <Text style={[typography.h3, { color: colors.text.primary, fontWeight: '800' }]}>
                Hi, Alex 👋
              </Text>
              <Text style={[typography.caption, { color: colors.text.muted }]}>
                Ready to crush your goals?
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Theme Toggle Sun / Moon Button */}
            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                toggleTheme();
              }}
              style={({ pressed }) => [
                styles.notificationButton,
                {
                  backgroundColor: isDark ? colors.background.glassDense : '#FFFFFF',
                  borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
                  marginRight: 8,
                  ...shadows.sm,
                },
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
            >
              {isDark ? (
                <Sun size={19} color={colors.primary} />
              ) : (
                <Moon size={19} color={colors.text.primary} />
              )}
            </Pressable>

            {/* Notification Bell (Opens Full Notifications Screen) */}
            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setIsNotificationsVisible(true);
              }}
              style={({ pressed }) => [
                styles.notificationButton,
                {
                  backgroundColor: isDark ? colors.background.glassDense : '#FFFFFF',
                  borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
                  ...shadows.sm,
                },
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
            >
              <Bell size={19} color={colors.text.primary} />
              <View style={[styles.bellBadge, { backgroundColor: colors.secondary }]} />
            </Pressable>
          </View>
        </View>

        {/* ================= TAB 1: HOME DASHBOARD ================= */}
        {activeTab === 'home' ? (
          <View style={{ marginTop: spacing.lg }}>
            {/* Today's Progress 75% Circular Gauge Card (Tap to view Activity Analytics) */}
            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setActiveTab('activity');
              }}
            >
              <TodayProgressGaugeCard
                percentage={75}
                workoutMins={45}
                caloriesBurned={520}
                stepsCount={8752}
                activeTimeString="1h 15m"
              />
            </Pressable>

            {/* Weekly Activity Bar Chart (Tap any day bar for stats) */}
            <View style={{ marginTop: spacing.md }}>
              <WeeklyActivityBarChart
                onSelectDay={(item) => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  Alert.alert(
                    `Day Activity 📊`,
                    `Goal Completion: ${item.percentage}%\nStatus: ${
                      item.percentage >= 90 ? 'Goal Crushed! 🔥' : 'In Progress ⚡'
                    }`
                  );
                }}
              />
            </View>

            {/* Quick Actions 2x2 Grid */}
            <View style={{ marginTop: spacing.lg }}>
              <QuickActionsGrid
                onStartWorkout={() => setActiveTab('workouts')}
                onLogFood={() => setActiveTab('nutrition')}
                onBodyStats={() => setActiveTab('activity')}
                onChallenges={() => {
                  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                  Alert.alert(
                    'Active Challenges 🏆',
                    '• 7-Day Consistency Streak (Day 4/7 🔥)\n• 150 min Weekly Cardio (115/150 min)\n• Daily Hydration (2.2L / 2.5L)',
                    [{ text: 'Keep Crushing It!', style: 'default' }]
                  );
                }}
              />
            </View>

            {/* Confirmed Bookings Section (From MMKV Storage) */}
            {bookingHistory.length > 0 ? (
              <View style={{ marginTop: spacing.xl }}>
                <View style={styles.sectionTitleRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckCircle2 size={18} color={colors.primary} />
                    <Text
                      style={[
                        typography.subtitle1,
                        { color: colors.text.primary, marginLeft: 6, fontWeight: '700' },
                      ]}
                    >
                      Confirmed Sessions ({bookingHistory.length})
                    </Text>
                  </View>
                  <StatusBadge label="Instant MMKV" variant="mint" />
                </View>

                <View style={{ marginTop: spacing.sm, gap: 10 }}>
                  {bookingHistory.map((booking) => {
                    const dateFormatted = new Date(booking.startTimeUtc).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    });
                    const timeFormatted = formatLocalTime(booking.startTimeUtc);

                    return (
                      <SurfaceCard
                        key={booking.id}
                        variant="glass"
                        style={styles.bookingCard}
                      >
                        <View style={styles.bookingRow}>
                          <Image
                            source={{ uri: booking.trainerAvatar }}
                            style={[styles.bookingAvatar, { borderRadius: radius.md }]}
                          />
                          <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={[typography.subtitle2, { color: colors.text.primary, fontWeight: '700' }]}>
                              {booking.trainerName}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                              <Clock size={12} color={colors.primary} />
                              <Text style={[typography.caption, { color: colors.primary, marginLeft: 4, fontWeight: '700' }]}>
                                {dateFormatted} at {timeFormatted} ({booking.durationMinutes}m)
                              </Text>
                            </View>
                          </View>
                          <StatusBadge label="CONFIRMED" variant="mint" />
                        </View>

                        {booking.meetingLink ? (
                          <View
                            style={[
                              styles.meetingRow,
                              { backgroundColor: 'rgba(16, 185, 129, 0.08)', marginTop: spacing.sm },
                            ]}
                          >
                            <Video size={13} color={colors.primary} />
                            <Text style={[typography.caption, { color: colors.primary, marginLeft: 6, fontWeight: '700' }]}>
                              1-on-1 Video Session Link Ready
                            </Text>
                          </View>
                        ) : null}
                      </SurfaceCard>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {/* Top Certified Coaches Marketplace */}
            <View style={{ marginTop: spacing.xl }}>
              <View style={styles.sectionTitleRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Dumbbell size={18} color={colors.primary} />
                  <Text
                    style={[
                      typography.subtitle1,
                      { color: colors.text.primary, marginLeft: 6, fontWeight: '700' },
                    ]}
                  >
                    Top Certified Coaches
                  </Text>
                </View>
                <View style={styles.liveBadge}>
                  <View style={[styles.pulseDot, { backgroundColor: colors.primary }]} />
                  <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
                    Live Booking
                  </Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.filterScroll, { marginTop: spacing.sm }]}
              >
                {specialtyFilters.map((spec) => {
                  const isActive = activeSpecialty === spec;
                  return (
                    <Pressable
                      key={spec}
                      onPress={() => {
                        void Haptics.selectionAsync().catch(() => {});
                        setActiveSpecialty(spec);
                      }}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: isActive
                            ? colors.primary
                            : isDark
                            ? colors.background.glass
                            : '#FFFFFF',
                          borderColor: isActive
                            ? colors.primary
                            : isDark
                            ? colors.border.card
                            : 'rgba(0, 0, 0, 0.08)',
                          ...shadows.sm,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.caption,
                          {
                            color: isActive
                              ? '#FFFFFF'
                              : isDark
                              ? colors.text.muted
                              : colors.text.secondary,
                            fontWeight: isActive ? '700' : '600',
                          },
                        ]}
                      >
                        {spec}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={{ marginTop: spacing.md, gap: 14 }}>
                {filteredTrainers.map((trainer) => (
                  <TrainerCard
                    key={trainer.id}
                    trainer={trainer}
                    onBookPress={handleBookTrainer}
                    onCardPress={handleBookTrainer}
                  />
                ))}
              </View>
            </View>
          </View>
        ) : null}

        {/* ================= TAB 2: WORKOUTS SCREEN (Screen 3) ================= */}
        {activeTab === 'workouts' ? (
          <View style={{ marginTop: spacing.lg }}>
            <View style={styles.tabHeaderRow}>
              <Text style={[typography.h2, { color: colors.text.primary, fontWeight: '800' }]}>
                Workouts
              </Text>
              <Pressable
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  Alert.alert(
                    'Workout Filters ⚡',
                    'Select a category to filter:',
                    [
                      { text: 'All Routines', onPress: () => setWorkoutCategory('All') },
                      { text: 'Strength & Hypertrophy', onPress: () => setWorkoutCategory('Strength') },
                      { text: 'High-Velocity HIIT', onPress: () => setWorkoutCategory('HIIT') },
                      { text: 'Cardio & Mobility', onPress: () => setWorkoutCategory('Cardio') },
                      { text: 'Cancel', style: 'cancel' },
                    ]
                  );
                }}
                style={({ pressed }) => [
                  styles.tabActionCircle,
                  {
                    backgroundColor: isDark ? colors.background.glassDense : '#FFFFFF',
                    borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
                    ...shadows.sm,
                  },
                  pressed && { transform: [{ scale: 0.94 }] },
                ]}
              >
                <SlidersHorizontal size={18} color={colors.primary} />
              </Pressable>
            </View>

            {/* Search Input */}
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: isDark ? colors.background.glassDense : colors.background.sunken,
                  borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
                  borderRadius: radius.xl,
                  ...shadows.sm,
                  marginTop: spacing.md,
                },
              ]}
            >
              <Search size={18} color={isDark ? colors.text.muted : colors.text.secondary} />
              <TextInput
                placeholder="Search workouts..."
                placeholderTextColor={isDark ? colors.text.subtle : '#64748B'}
                value={workoutSearchQuery}
                onChangeText={setWorkoutSearchQuery}
                style={[
                  styles.searchInput,
                  { color: colors.text.primary, fontSize: 14 },
                ]}
              />
            </View>

            {/* Category Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.categoryScroll, { marginTop: spacing.md }]}
            >
              {workoutCategories.map((cat) => {
                const isActive = workoutCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => {
                      void Haptics.selectionAsync().catch(() => {});
                      setWorkoutCategory(cat);
                    }}
                    style={({ pressed }) => [
                      styles.categoryPill,
                      {
                        backgroundColor: isActive
                          ? colors.primary
                          : isDark
                          ? colors.background.glass
                          : '#FFFFFF',
                        borderColor: isActive
                          ? colors.primary
                          : isDark
                          ? colors.border.card
                          : 'rgba(0, 0, 0, 0.08)',
                        ...shadows.sm,
                      },
                      pressed && { transform: [{ scale: 0.95 }] },
                    ]}
                  >
                    <Text
                      style={[
                        typography.caption,
                        {
                          color: isActive
                            ? '#FFFFFF'
                            : isDark
                            ? colors.text.muted
                            : colors.text.secondary,
                          fontWeight: isActive ? '700' : '600',
                        },
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Workouts List (Matching Screen 3) */}
            <View style={{ marginTop: spacing.md, gap: 14 }}>
              {filteredWorkouts.map((routine) => (
                <WorkoutCard
                  key={routine.id}
                  routine={routine}
                  onPress={handleStartWorkout}
                />
              ))}
            </View>
          </View>
        ) : null}

        {/* ================= TAB 3: ACTIVITY ANALYTICS (Screen 5) ================= */}
        {activeTab === 'activity' ? (
          <View style={{ marginTop: spacing.lg }}>
            <View style={styles.tabHeaderRow}>
              <Text style={[typography.h2, { color: colors.text.primary, fontWeight: '800' }]}>
                Activity
              </Text>
              <Pressable
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  Alert.alert(
                    'Activity Sync 📊',
                    '• Apple Health: Connected (Real-time sync)\n• Current Streak: 4 Days\n• Weekly Target: 3,500 kcal burned',
                    [{ text: 'Done', style: 'default' }]
                  );
                }}
                style={({ pressed }) => [
                  styles.tabActionCircle,
                  {
                    backgroundColor: isDark ? colors.background.glassDense : '#FFFFFF',
                    borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
                    ...shadows.sm,
                  },
                  pressed && { transform: [{ scale: 0.94 }] },
                ]}
              >
                <MoreHorizontal size={18} color={colors.text.primary} />
              </Pressable>
            </View>
            <View style={{ marginTop: spacing.sm }}>
              <ActivityAnalyticsView metrics={activityMetrics} />
            </View>
          </View>
        ) : null}

        {/* ================= TAB 4: NUTRITION & MEALS (Screen 6) ================= */}
        {activeTab === 'nutrition' ? (
          <View style={{ marginTop: spacing.lg }}>
            <View style={styles.tabHeaderRow}>
              <Text style={[typography.h2, { color: colors.text.primary, fontWeight: '800' }]}>
                Nutrition
              </Text>
              <Pressable
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  Alert.alert(
                    'Nutrition Goals 🥑',
                    '• Daily Target: 2,400 kcal\n• Macro Targets: 160g Protein, 220g Carbs, 65g Fats\n• Daily Water Goal: 3.0 Liters',
                    [{ text: 'Close', style: 'default' }]
                  );
                }}
                style={({ pressed }) => [
                  styles.tabActionCircle,
                  {
                    backgroundColor: isDark ? colors.background.glassDense : '#FFFFFF',
                    borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
                    ...shadows.sm,
                  },
                  pressed && { transform: [{ scale: 0.94 }] },
                ]}
              >
                <MoreHorizontal size={18} color={colors.text.primary} />
              </Pressable>
            </View>
            <View style={{ marginTop: spacing.sm }}>
              <NutritionTrackerView />
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Floating Glassmorphic Bottom Navigation Bar */}
      <FloatingGlassTabBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
      />

      {/* 1-Tap Apple Pay Trainer Booking Modal Sheet */}
      <TrainerDetailModal
        trainer={selectedTrainer}
        visible={isTrainerModalVisible}
        onClose={() => setIsTrainerModalVisible(false)}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* 1080p 3D Studio Animatic Exercise Video Player Modal */}
      <WorkoutPlayerModal
        routine={selectedRoutine}
        visible={isWorkoutModalVisible}
        onClose={() => setIsWorkoutModalVisible(false)}
        onWorkoutCompleted={handleWorkoutCompleted}
      />

      {/* Onboarding Welcome Screen Modal (Screen 1 from reference) */}
      <OnboardingModal
        visible={isOnboardingVisible}
        onClose={() => setIsOnboardingVisible(false)}
        onGetStarted={() => {
          setIsOnboardingVisible(false);
          setActiveTab('workouts');
        }}
      />

      {/* Dedicated Luxury Notifications Screen Modal */}
      <NotificationsModal
        visible={isNotificationsVisible}
        onClose={() => setIsNotificationsVisible(false)}
        onSelectBooking={() => {
          setActiveTab('home');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  tabHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabActionCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 5,
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  bookingCard: {
    padding: 14,
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingAvatar: {
    width: 42,
    height: 42,
  },
  meetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    height: '100%',
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
});
