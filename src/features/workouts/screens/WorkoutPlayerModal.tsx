import React, { useState, useEffect } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Moon,
  MoreVertical,
  Pause,
  Play,
  Plus,
  SkipBack,
  SkipForward,
  Sun,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react-native';
import { WorkoutRoutine } from '@/types';
import { useTheme } from '@/theme';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { HapticButton } from '@/components/buttons/HapticButton';
import { ActivityRings } from '@/components/feedback/ActivityRings';
import { AmbientCanvasBackground } from '@/components/layout/AmbientCanvasBackground';
import {
  Exercise3DVideoPlayer,
  AnimatedTimerDial,
  MuscleAnatomyCarousel,
} from '../components';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';

export interface WorkoutPlayerModalProps {
  routine: WorkoutRoutine | null;
  visible: boolean;
  onClose: () => void;
  onWorkoutCompleted?: () => void;
}

export function WorkoutPlayerModal({
  routine,
  visible,
  onClose,
  onWorkoutCompleted,
}: WorkoutPlayerModalProps) {
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius, typography, isDark } = useTheme();

  useEffect(() => {
    if (visible) {
      RNStatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    }
  }, [visible, isDark]);

  if (!routine) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background.base} />
      <WorkoutPlayerContent
        routine={routine}
        insets={insets}
        colors={colors}
        spacing={spacing}
        radius={radius}
        typography={typography}
        onClose={onClose}
        onWorkoutCompleted={onWorkoutCompleted}
      />
    </Modal>
  );
}

interface PlayerContentProps {
  routine: WorkoutRoutine;
  insets: any;
  colors: any;
  spacing: any;
  radius: any;
  typography: any;
  onClose: () => void;
  onWorkoutCompleted?: () => void;
}

function WorkoutPlayerContent({
  routine,
  insets,
  colors,
  spacing,
  radius,
  typography,
  onClose,
  onWorkoutCompleted,
}: PlayerContentProps) {
  const { shadows, isDark, toggleTheme } = useTheme();

  // Mode: 'detail' (Screen 4 from reference) vs 'live' (active interval timer)
  const [viewPhase, setViewPhase] = useState<'detail' | 'live'>('live');

  const {
    exerciseIndex,
    setIndex,
    isRest,
    isPaused,
    isCompleted,
    soundEnabled,
    currentExercise,
    secondsRemaining,
    intervalTotal,
    formattedTime,
    totalElapsed,
    togglePlayPause,
    startTimer,
    toggleSound,
    skipForward,
    skipBackward,
    addRestTime,
    skipRest,
  } = useWorkoutTimer(routine);

  const nextExercise = routine.exercises[exerciseIndex + 1];

  // During rest after completing all sets for current exercise, preview upcoming exercise in 3D
  const isPreviewingNext = isRest && setIndex >= currentExercise.sets && !!nextExercise;
  const displayExercise = isPreviewingNext && nextExercise ? nextExercise : currentExercise;

  // Map active exercise target to top anatomy carousel active muscle
  const activeMuscleGroupId = React.useMemo(() => {
    const t = (displayExercise.targetMuscleGroup || '').toLowerCase();
    if (t.includes('back') || t.includes('deltoid') || t.includes('shoulder')) return 'rear_delts';
    if (t.includes('chest') || t.includes('push')) return 'chest_shoulders';
    return 'lats_core';
  }, [displayExercise.targetMuscleGroup]);

  // Workout Completed Screen
  if (isCompleted) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background.base,
            paddingTop: insets.top + spacing.xl,
            paddingBottom: insets.bottom + spacing.xl,
            paddingHorizontal: spacing.xl,
          },
        ]}
      >
        <View style={styles.victoryHeader}>
          <View
            style={[
              styles.victoryCircle,
              { backgroundColor: 'rgba(43, 183, 137, 0.15)', borderColor: colors.primary },
            ]}
          >
            <CheckCircle2 size={64} color={colors.primary} strokeWidth={2.4} />
          </View>
          <Text style={[typography.h1, { color: colors.text.primary, marginTop: spacing.base }]}>
            Workout Crushed!
          </Text>
          <Text style={[typography.bodyMedium, { color: colors.text.muted, marginTop: 4 }]}>
            {routine.title} completed
          </Text>
        </View>

        {/* Activity Rings Celebration */}
        <View style={[styles.ringsCelebrationBox, { marginVertical: spacing.xl }]}>
          <ActivityRings
            size={160}
            strokeWidth={13}
            move={{
              current: 520 + routine.estimatedCaloriesBurn,
              target: 600,
              color: colors.activity.move,
              backgroundColor: colors.activity.moveBg,
            }}
            exercise={{
              current: 35 + routine.durationMinutes,
              target: 45,
              color: colors.activity.exercise,
              backgroundColor: colors.activity.exerciseBg,
            }}
            stand={{
              current: 10,
              target: 12,
              color: colors.activity.stand,
              backgroundColor: colors.activity.standBg,
            }}
          />

          <View style={[styles.victoryStatsRow, { marginTop: spacing.base }]}>
            <View style={styles.victoryStatCol}>
              <Text style={[typography.h2, { color: colors.secondary }]}>
                +{routine.estimatedCaloriesBurn}
              </Text>
              <Text style={[typography.caption, { color: colors.text.muted }]}>kcal Burned</Text>
            </View>
            <View style={styles.victoryStatCol}>
              <Text style={[typography.h2, { color: colors.primary }]}>
                {Math.max(1, Math.round(totalElapsed / 60))}m
              </Text>
              <Text style={[typography.caption, { color: colors.text.muted }]}>Elapsed Time</Text>
            </View>
            <View style={styles.victoryStatCol}>
              <Text style={[typography.h2, { color: colors.primary }]}>100%</Text>
              <Text style={[typography.caption, { color: colors.text.muted }]}>Sets Done</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 'auto' }}>
          <PrimaryButton
            label="Save & Return to Dashboard"
            variant="primary"
            size="lg"
            onPress={() => {
              onWorkoutCompleted?.();
              onClose();
            }}
            fullWidth
          />
        </View>
      </View>
    );
  }

  // ================= VIEW PHASE 1: SCREEN 4 (WORKOUT DETAIL OVERVIEW) =================
  if (viewPhase === 'detail') {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top + 14, 60),
            paddingBottom: insets.bottom + spacing.base,
          },
        ]}
      >
        {/* Luxury Ambient Halo Background */}
        <AmbientCanvasBackground />

        {/* Top Header Row (Back arrow, title, more icon) */}
        <View style={[styles.detailTopBar, { paddingHorizontal: spacing.lg }]}>
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              onClose();
            }}
            style={({ pressed }) => [
              styles.roundHeaderBtn,
              {
                backgroundColor: colors.background.glassDense,
                borderColor: colors.border.card,
                ...shadows.sm,
              },
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
          >
            <ArrowLeft size={18} color={colors.text.primary} />
          </Pressable>

          <Text
            style={[typography.subtitle1, { color: colors.text.primary, fontWeight: '800' }]}
            numberOfLines={1}
          >
            {routine.title}
          </Text>

          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            }}
            style={({ pressed }) => [
              styles.roundHeaderBtn,
              {
                backgroundColor: colors.background.glassDense,
                borderColor: colors.border.card,
                ...shadows.sm,
              },
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
          >
            <MoreVertical size={18} color={colors.text.primary} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[styles.contentScroll, { paddingHorizontal: spacing.lg }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Stage (16:9 3D Animatic Video or Photo Stage with Screen 4 Circular Play Overlay) */}
          <View style={{ marginTop: spacing.sm, position: 'relative' }}>
            <Exercise3DVideoPlayer
              exerciseName={routine.exercises[0]?.name || routine.title}
              targetMuscleGroup={routine.exercises[0]?.targetMuscleGroup || 'Full Body'}
              videoUrl={routine.exercises[0]?.videoUrl}
              isRest={false}
              isPaused={false}
            />

            {/* Frosted Circular Play Button in Center-Right (Screen 4 Reference) */}
            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                setViewPhase('live');
              }}
              style={({ pressed }) => [
                styles.heroPlayBadge,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderColor: 'rgba(255, 255, 255, 0.98)',
                  ...shadows.lg,
                },
                pressed && { transform: [{ scale: 0.92 }] },
              ]}
            >
              <Play size={20} color="#1E293B" fill="#1E293B" style={{ marginLeft: 2 }} />
            </Pressable>
          </View>

          {/* 3-Metric Stats Row Card */}
          <View
            style={[
              styles.detailMetricsCard,
              {
                backgroundColor: colors.background.glassDense,
                borderColor: colors.border.card,
                borderRadius: radius.xl,
                ...shadows.glass,
                marginTop: spacing.md,
              },
            ]}
          >
            <View style={styles.metricItemCol}>
              <Text style={[typography.caption, { color: colors.text.muted, fontWeight: '500' }]}>
                Duration
              </Text>
              <Text style={[typography.subtitle1, { color: colors.text.primary, fontWeight: '800', marginTop: 2 }]}>
                {routine.durationMinutes} min
              </Text>
            </View>

            <View style={[styles.verticalDivider, { backgroundColor: colors.border.subtle }]} />

            <View style={styles.metricItemCol}>
              <Text style={[typography.caption, { color: colors.text.muted, fontWeight: '500' }]}>
                Calories
              </Text>
              <Text style={[typography.subtitle1, { color: colors.text.primary, fontWeight: '800', marginTop: 2 }]}>
                {routine.estimatedCaloriesBurn} kcal
              </Text>
            </View>

            <View style={[styles.verticalDivider, { backgroundColor: colors.border.subtle }]} />

            <View style={styles.metricItemCol}>
              <Text style={[typography.caption, { color: colors.text.muted, fontWeight: '500' }]}>
                Level
              </Text>
              <Text style={[typography.subtitle1, { color: colors.text.primary, fontWeight: '800', marginTop: 2 }]}>
                {routine.difficulty}
              </Text>
            </View>
          </View>

          {/* Section: Exercises List */}
          <View style={{ marginTop: spacing.lg }}>
            <Text style={[typography.subtitle1, { color: colors.text.primary, fontWeight: '800', fontSize: 18 }]}>
              Exercises
            </Text>

            <View style={{ marginTop: spacing.sm, gap: 10 }}>
              {routine.exercises.map((ex, idx) => (
                <View
                  key={ex.id || idx}
                  style={[
                    styles.exerciseItemCard,
                    {
                      backgroundColor: colors.background.glassDense,
                      borderColor: colors.border.card,
                      borderRadius: radius.xl,
                      ...shadows.sm,
                    },
                  ]}
                >
                  {/* Square Exercise Thumbnail */}
                  <View style={[styles.exerciseThumbBox, { backgroundColor: 'rgba(43, 183, 137, 0.08)' }]}>
                    <Image
                      source={{
                        uri:
                          ex.thumbnailUrl ||
                          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=150&q=80',
                      }}
                      style={styles.exerciseThumb}
                    />
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[typography.subtitle2, { color: colors.text.primary, fontWeight: '800' }]}>
                      {ex.name}
                    </Text>
                    <Text style={[typography.caption, { color: colors.text.muted, marginTop: 2, fontWeight: '600' }]}>
                      {ex.sets} Sets × {ex.repsOrDuration}
                    </Text>
                  </View>

                  <ChevronRight size={18} color={colors.text.muted} />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Sticky Bottom "Start Workout" Pill Button */}
        <View style={[styles.stickyBottomBar, { paddingHorizontal: spacing.lg, paddingTop: 10 }]}>
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              setViewPhase('live');
              startTimer();
            }}
            style={({ pressed }) => [
              styles.startWorkoutButton,
              {
                backgroundColor: colors.primary,
                borderRadius: radius.full,
                ...shadows.glowMint,
              },
              pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] },
            ]}
          >
            <Text style={[typography.subtitle1, { color: '#FFFFFF', fontWeight: '800', fontSize: 16 }]}>
              Start Workout
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ================= VIEW PHASE 2: LIVE INTERACTIVE TIMER & PLAYER =================
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top + 14, 58),
          paddingBottom: Math.max(insets.bottom + 12, 24),
        },
      ]}
    >
      {/* Luxury Ambient Halo Background with Pure White Center Stage */}
      <AmbientCanvasBackground centerClear={true} />

      {/* Top Header Bar */}
      <View style={[styles.topBar, { paddingHorizontal: spacing.base }]}>
        <HapticButton
          onPress={() => setViewPhase('detail')}
          style={styles.iconButton}
        >
          <ArrowLeft size={22} color={colors.text.primary} />
        </HapticButton>

        <View style={styles.routineTitleCol}>
          <Text
            style={[typography.subtitle1, { color: colors.text.primary, fontWeight: '800', fontSize: 16 }]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >
            {routine.title}
          </Text>
          <Text style={[typography.caption, { color: colors.text.muted }]}>
            Exercise {exerciseIndex + 1} of {routine.exercises.length}
          </Text>
        </View>

        {/* Theme Mode Toggle (Sun / Moon) */}
        <HapticButton onPress={toggleTheme} style={styles.iconButton}>
          {isDark ? (
            <Sun size={20} color={colors.primary} />
          ) : (
            <Moon size={20} color={colors.text.primary} />
          )}
        </HapticButton>

        <HapticButton onPress={toggleSound} style={styles.iconButton}>
          {soundEnabled ? (
            <Volume2 size={22} color={colors.primary} />
          ) : (
            <VolumeX size={22} color={colors.text.subtle} />
          )}
        </HapticButton>

        <HapticButton onPress={onClose} style={[styles.iconButton, { marginLeft: 4 }]}>
          <X size={22} color={colors.text.primary} />
        </HapticButton>
      </View>

      {/* Neon Muscle Anatomy Carousel (Syncs to previewed exercise when resting) */}
      <MuscleAnatomyCarousel
        key={`${displayExercise.id}_${activeMuscleGroupId}`}
        activeMuscleId={activeMuscleGroupId}
      />

      {/* Heroic 3D Exercise Motion Animation Stage */}
      <View style={styles.hero3DStageWrapper}>
        <Exercise3DVideoPlayer
          exerciseName={displayExercise.name}
          targetMuscleGroup={displayExercise.targetMuscleGroup}
          videoUrl={displayExercise.videoUrl}
          isRest={isRest}
          isPaused={isPaused}
          stageHeight={345}
          scale={1.3}
          showSpeedControl={true}
        />
      </View>

      {/* Unified Bottom Workout Console Card (Fits on single screen with zero scrolling) */}
      <View
        style={[
          styles.bottomConsoleCard,
          {
            backgroundColor: colors.background.glassDense,
            borderColor: colors.border.card,
            borderRadius: 28,
            ...shadows.glass,
            marginHorizontal: spacing.base,
            marginTop: 'auto',
          },
        ]}
      >
        {/* Row 1: Exercise Info on Left & Integrated Circular Countdown Dial on Right */}
        <View style={styles.consoleHeaderRow}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              style={[
                typography.h3,
                { color: colors.text.primary, fontWeight: '900', fontSize: 20, letterSpacing: -0.3 },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
            >
              {isRest
                ? isPreviewingNext
                  ? `Get Ready: ${displayExercise.name}`
                  : `Rest & Recover`
                : currentExercise.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Text
                style={[
                  typography.caption,
                  { color: isRest ? colors.secondary : colors.primary, fontWeight: '700' },
                ]}
              >
                {isRest
                  ? isPreviewingNext
                    ? `Upcoming • ${displayExercise.targetMuscleGroup}`
                    : `Next: Set ${setIndex + 1} of ${currentExercise.sets}`
                  : currentExercise.targetMuscleGroup}
              </Text>
              {!isRest ? (
                <>
                  <Text style={{ color: colors.text.muted, marginHorizontal: 4 }}>•</Text>
                  <Text
                    style={[
                      typography.caption,
                      { color: colors.text.muted, fontWeight: '700' },
                    ]}
                  >
                    Set {setIndex} of {currentExercise.sets}
                  </Text>
                </>
              ) : null}
            </View>

            {nextExercise && !isPreviewingNext ? (
              <Text
                style={[
                  typography.caption,
                  { color: colors.text.muted, marginTop: 4, fontWeight: '500' },
                ]}
                numberOfLines={1}
              >
                Next Up: <Text style={{ fontWeight: '700', color: colors.text.secondary }}>{nextExercise.name}</Text>
              </Text>
            ) : null}
          </View>

          {/* Integrated Animated Timer Dial (86px) */}
          <AnimatedTimerDial
            secondsRemaining={secondsRemaining}
            totalSeconds={intervalTotal}
            formattedTime={formattedTime}
            isRest={isRest}
            size={86}
          />
        </View>

        {/* Row 2: Quick Rest Actions during Rest, or Coaching Cue during Work */}
        {isRest ? (
          <View style={styles.restControlsRow}>
            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                addRestTime(15);
              }}
              style={({ pressed }) => [
                styles.addRestPill,
                {
                  backgroundColor: 'rgba(255, 107, 0, 0.1)',
                  borderColor: 'rgba(255, 107, 0, 0.25)',
                },
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
            >
              <Plus size={15} color={colors.secondary} strokeWidth={2.5} />
              <Text style={[typography.caption, { color: colors.secondary, fontWeight: '800', marginLeft: 4 }]}>
                +15s Rest
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
                skipRest();
              }}
              style={({ pressed }) => [
                styles.skipRestPill,
                {
                  backgroundColor: colors.primary,
                  ...shadows.sm,
                },
                pressed && { transform: [{ scale: 0.96 }] },
              ]}
            >
              <Zap size={14} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={[typography.caption, { color: '#FFFFFF', fontWeight: '800', marginLeft: 6 }]}>
                Ready Now • Start
              </Text>
            </Pressable>
          </View>
        ) : displayExercise.instructions[0] ? (
          <View style={[styles.coachingCueBox, { backgroundColor: 'rgba(43, 183, 137, 0.08)' }]}>
            <Text
              style={[
                typography.caption,
                { color: colors.text.secondary, fontWeight: '600', fontSize: 12 },
              ]}
              numberOfLines={2}
            >
              💡 Form: {displayExercise.instructions[0]}
            </Text>
          </View>
        ) : null}

        {/* Row 3: Ergonomic Playback Controls */}
        <View style={styles.hudControlsRow}>
          <HapticButton
            onPress={skipBackward}
            style={[
              styles.hudSecondaryBtn,
              {
                backgroundColor: colors.background.glassDense,
                borderColor: colors.border.card,
              },
            ]}
          >
            <SkipBack size={24} color={colors.text.primary} />
          </HapticButton>

          <HapticButton
            onPress={togglePlayPause}
            style={[
              styles.hudPlayBtn,
              {
                backgroundColor: isRest ? colors.secondary : colors.primary,
                borderRadius: 36,
                ...shadows.glowMint,
              },
            ]}
          >
            {isPaused ? (
              <Play size={32} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />
            ) : (
              <Pause size={32} color="#FFFFFF" fill="#FFFFFF" />
            )}
          </HapticButton>

          <HapticButton
            onPress={skipForward}
            style={[
              styles.hudSecondaryBtn,
              {
                backgroundColor: colors.background.glassDense,
                borderColor: colors.border.card,
              },
            ]}
          >
            <SkipForward size={24} color={colors.text.primary} />
          </HapticButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detailTopBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroPlayBadge: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  roundHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailMetricsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderWidth: 1,
  },
  metricItemCol: {
    alignItems: 'center',
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 28,
  },
  exerciseItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
  },
  exerciseThumbBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  exerciseThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  stickyBottomBar: {
    width: '100%',
  },
  startWorkoutButton: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineTitleCol: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 8,
    marginRight: 4,
  },
  contentScroll: {
    paddingBottom: 24,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseCard: {
    borderWidth: 1,
  },
  instructionsList: {
    gap: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nextUpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  hero3DStageWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  heroStageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingIntervalBadge: {
    position: 'absolute',
    top: 10,
    left: 18,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomConsoleCard: {
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 6,
  },
  consoleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coachingCueBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: 10,
  },
  restControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  addRestPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  skipRestPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  hudControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 14,
  },
  hudSecondaryBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  hudPlayBtn: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2BB789',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  victoryHeader: {
    alignItems: 'center',
  },
  victoryCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringsCelebrationBox: {
    alignItems: 'center',
  },
  victoryStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  victoryStatCol: {
    alignItems: 'center',
  },
});
