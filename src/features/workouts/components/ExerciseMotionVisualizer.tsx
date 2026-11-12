import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  G,
  Line,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Activity, Flame, Heart, Zap } from 'lucide-react-native';
import { useTheme } from '@/theme';

export type ExerciseArchetype =
  | 'thruster'
  | 'lunge'
  | 'pushup_row'
  | 'climber'
  | 'deadlift'
  | 'mobility';

export function getExerciseArchetype(name: string): ExerciseArchetype {
  const lower = name.toLowerCase();
  if (lower.includes('thruster') || lower.includes('squat')) return 'thruster';
  if (lower.includes('lunge')) return 'lunge';
  if (
    lower.includes('row') ||
    lower.includes('push-up') ||
    lower.includes('pushup') ||
    lower.includes('plank')
  ) {
    return 'pushup_row';
  }
  if (
    lower.includes('climber') ||
    lower.includes('sprint') ||
    lower.includes('burpee')
  ) {
    return 'climber';
  }
  if (
    lower.includes('deadlift') ||
    lower.includes('rdl') ||
    lower.includes('hinge')
  ) {
    return 'deadlift';
  }
  return 'mobility';
}

export interface ExerciseMotionVisualizerProps {
  exerciseName: string;
  targetMuscleGroup: string;
  isRest: boolean;
  isPaused: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ExerciseMotionVisualizer({
  exerciseName,
  targetMuscleGroup,
  isRest,
  isPaused,
  style,
}: ExerciseMotionVisualizerProps) {
  const { colors, radius, typography } = useTheme();

  // Determine movement archetype
  const archetype = useMemo(
    () => getExerciseArchetype(exerciseName),
    [exerciseName]
  );

  // Live Rep Counter
  const [repCount, setRepCount] = useState<number>(1);
  const [tempoPhase, setTempoPhase] = useState<'ECCENTRIC' | 'HOLD' | 'CONCENTRIC' | 'BREATHE'>('CONCENTRIC');

  // Animation shared values
  const repProgress = useSharedValue(0); // 0 (start) -> 1 (peak eccentric) -> 0 (concentric)
  const pulseWave = useSharedValue(0); // 0 -> 1 shockwave expanding ring
  const breathProgress = useSharedValue(0); // Rest breathing cycle
  const heartScale = useSharedValue(1); // Heartbeat pulse
  const climberLegSwitch = useSharedValue(0); // Rapid climber cadence

  const incrementRep = () => {
    setRepCount((prev) => prev + 1);
  };

  const updatePhase = (phase: 'ECCENTRIC' | 'HOLD' | 'CONCENTRIC' | 'BREATHE') => {
    setTempoPhase(phase);
  };

  // Reset reps when exercise changes
  useEffect(() => {
    setRepCount(1);
  }, [exerciseName]);

  // Main animation driver
  useEffect(() => {
    if (isPaused) {
      cancelAnimation(repProgress);
      cancelAnimation(pulseWave);
      cancelAnimation(breathProgress);
      cancelAnimation(heartScale);
      cancelAnimation(climberLegSwitch);
      return;
    }

    if (isRest) {
      updatePhase('BREATHE');
      // Gentle calming breathing cycle (4s cycle)
      breathProgress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      );

      heartScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 220, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 780, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      );
    } else {
      // Dynamic exercise cadence based on archetype
      if (archetype === 'climber') {
        // High-velocity cycling cadence (550ms per sprint stride)
        climberLegSwitch.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 275, easing: Easing.linear }),
            withTiming(0, { duration: 275, easing: Easing.linear })
          ),
          -1,
          false
        );

        repProgress.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 550, easing: Easing.linear }, () => {
              runOnJS(incrementRep)();
            }),
            withTiming(0, { duration: 550, easing: Easing.linear })
          ),
          -1,
          false
        );

        pulseWave.value = withRepeat(
          withTiming(1, { duration: 1100, easing: Easing.out(Easing.quad) }),
          -1,
          false
        );

        heartScale.value = withRepeat(
          withSequence(
            withTiming(1.35, { duration: 130, easing: Easing.out(Easing.quad) }),
            withTiming(1, { duration: 220, easing: Easing.inOut(Easing.quad) })
          ),
          -1,
          false
        );
      } else {
        // Standard rep cadence: 1.1s down, 0.2s hold, 0.8s explosive concentric
        repProgress.value = withRepeat(
          withSequence(
            // Eccentric phase (lowering)
            withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.cubic) }, () => {
              runOnJS(updatePhase)('HOLD');
            }),
            // Isometric bottom pause
            withTiming(1, { duration: 250 }, () => {
              runOnJS(updatePhase)('CONCENTRIC');
            }),
            // Explosive concentric return
            withTiming(0, { duration: 800, easing: Easing.out(Easing.back(1.2)) }, () => {
              runOnJS(incrementRep)();
              runOnJS(updatePhase)('ECCENTRIC');
            }),
            // Top reset pause
            withTiming(0, { duration: 200 })
          ),
          -1,
          false
        );

        // Concentric power shockwave ring
        pulseWave.value = withRepeat(
          withTiming(1, { duration: 2350, easing: Easing.out(Easing.quad) }),
          -1,
          false
        );

        // Athletic active heart rate pulse
        heartScale.value = withRepeat(
          withSequence(
            withTiming(1.3, { duration: 160, easing: Easing.out(Easing.quad) }),
            withTiming(1, { duration: 320, easing: Easing.inOut(Easing.quad) })
          ),
          -1,
          false
        );
      }
    }

    return () => {
      cancelAnimation(repProgress);
      cancelAnimation(pulseWave);
      cancelAnimation(breathProgress);
      cancelAnimation(heartScale);
      cancelAnimation(climberLegSwitch);
    };
  }, [isRest, isPaused, archetype, exerciseName]);

  // Main Motion transforms based on archetype
  const athleteMotionStyle = useAnimatedStyle(() => {
    if (isRest) {
      const scale = interpolate(breathProgress.value, [0, 1], [0.96, 1.05]);
      return {
        transform: [{ scale }],
      };
    }

    if (archetype === 'thruster') {
      // Squat descent (-6px up to +24px down squat)
      const translateY = interpolate(repProgress.value, [0, 1], [-8, 24]);
      const scaleY = interpolate(repProgress.value, [0, 1], [1.02, 0.9]);
      const scaleX = interpolate(repProgress.value, [0, 1], [0.98, 1.06]);
      return {
        transform: [{ translateY }, { scaleY }, { scaleX }],
      };
    }

    if (archetype === 'lunge') {
      // Jump lunge: jump UP at concentric (0) and land into lunge at (1)
      const translateY = interpolate(repProgress.value, [0, 1], [-18, 16]);
      const scaleY = interpolate(repProgress.value, [0, 1], [1.06, 0.94]);
      return {
        transform: [{ translateY }, { scaleY }],
      };
    }

    if (archetype === 'pushup_row') {
      // Pushup lowering into chest depth
      const translateY = interpolate(repProgress.value, [0, 1], [-4, 18]);
      return {
        transform: [{ translateY }],
      };
    }

    if (archetype === 'climber') {
      // Running bounce rhythm
      const translateY = interpolate(climberLegSwitch.value, [0, 0.5, 1], [0, -6, 0]);
      return {
        transform: [{ translateY }],
      };
    }

    if (archetype === 'deadlift') {
      // Hip hinge: slight lower & tilt
      const translateY = interpolate(repProgress.value, [0, 1], [-6, 16]);
      return {
        transform: [{ translateY }],
      };
    }

    // Default gentle motion
    const translateY = interpolate(repProgress.value, [0, 1], [-4, 12]);
    return {
      transform: [{ translateY }],
    };
  });

  // Barbell / Dumbbell overhead press motion
  const weightMotionStyle = useAnimatedStyle(() => {
    if (isRest) return { opacity: 0 };

    if (archetype === 'thruster') {
      // Full overhead press at top (repProgress 0) down to shoulder rack at squat (repProgress 1)
      const translateY = interpolate(repProgress.value, [0, 1], [-32, 14]);
      const opacity = interpolate(repProgress.value, [0, 1], [1, 0.85]);
      return {
        transform: [{ translateY }],
        opacity,
      };
    }

    if (archetype === 'deadlift') {
      // Barbell descends down shins toward ground
      const translateY = interpolate(repProgress.value, [0, 1], [-12, 34]);
      return {
        transform: [{ translateY }],
      };
    }

    if (archetype === 'pushup_row') {
      // Alternating row pull toward ceiling
      const translateY = interpolate(repProgress.value, [0, 1], [-16, 8]);
      return {
        transform: [{ translateY }],
      };
    }

    return { opacity: 0 };
  });

  // Pulse ripple ring
  const pulseRippleStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseWave.value, [0, 1], [0.7, 1.8]);
    const opacity = interpolate(pulseWave.value, [0, 0.4, 1], [0.65, 0.3, 0]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Heartbeat icon scale
  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
    };
  });

  const getTempoLabel = () => {
    if (isRest) return 'DEEP DIAPHRAGMATIC BREATH';
    if (archetype === 'climber') return 'HIGH-SPEED SPRINT CADENCE';
    switch (tempoPhase) {
      case 'ECCENTRIC':
        return 'ECCENTRIC: CONTROLLED LOWER';
      case 'HOLD':
        return 'ISOMETRIC: HOLD TENSION';
      case 'CONCENTRIC':
        return 'CONCENTRIC: EXPLOSIVE DRIVE';
      default:
        return 'ACTIVE TEMPO';
    }
  };

  const getTempoBadgeColor = () => {
    if (isRest) return colors.secondary;
    if (tempoPhase === 'CONCENTRIC') return colors.primary;
    if (tempoPhase === 'HOLD') return '#F59E0B';
    return colors.text.secondary;
  };

  return (
    <View
      style={[
        styles.stageContainer,
        {
          backgroundColor: colors.background.sunken,
          borderColor: isRest ? colors.secondary : colors.border.default,
          borderRadius: radius['2xl'],
        },
        style,
      ]}
    >
      {/* Top Meta Bar */}
      <View style={styles.stageHeader}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isRest ? colors.secondary : colors.primary },
            ]}
          />
          <Text
            style={[
              typography.caption,
              {
                color: isRest ? colors.secondary : colors.primary,
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              },
            ]}
          >
            {isRest ? 'Rest Interval' : `${archetype.toUpperCase()} DYNAMICS`}
          </Text>
        </View>

        <View style={styles.headerRight}>
          {/* Live Rep Counter Pill */}
          {!isRest && !isPaused ? (
            <View
              style={[
                styles.repPill,
                {
                  backgroundColor: 'rgba(255, 107, 0, 0.15)',
                  borderColor: colors.primary,
                },
              ]}
            >
              <Zap size={11} color={colors.primary} />
              <Text
                style={[
                  typography.caption,
                  { color: colors.primary, fontWeight: '800', marginLeft: 3 },
                ]}
              >
                REP {repCount}
              </Text>
            </View>
          ) : null}

          {/* Live Heartbeat BPM Simulation */}
          <View style={styles.bpmContainer}>
            <Animated.View style={animatedHeartStyle}>
              <Heart size={13} color="#EF4444" fill="#EF4444" />
            </Animated.View>
            <Text
              style={[
                typography.caption,
                { color: colors.text.primary, fontWeight: '700', marginLeft: 4 },
              ]}
            >
              {isRest ? '112' : archetype === 'climber' ? '168' : '152'}{' '}
              <Text style={{ color: colors.text.muted, fontSize: 10 }}>BPM</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Main Motion Stage */}
      <View style={styles.canvasArea}>
        {/* Shockwave Energy Ripple Ring */}
        {!isRest && !isPaused ? (
          <Animated.View
            style={[
              styles.pulseRipple,
              {
                borderColor: colors.primary,
                backgroundColor: 'rgba(255, 107, 0, 0.08)',
              },
              pulseRippleStyle,
            ]}
          />
        ) : null}

        {/* Biomechanical Athletic Silhouette */}
        <Animated.View style={[styles.avatarWrapper, athleteMotionStyle]}>
          <Svg width={200} height={155} viewBox="0 0 200 155">
            <Defs>
              <LinearGradient id="athleteGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop
                  offset="0%"
                  stopColor={isRest ? colors.secondary : colors.primary}
                  stopOpacity="1"
                />
                <Stop
                  offset="100%"
                  stopColor={isRest ? '#06B6D4' : '#FF8533'}
                  stopOpacity="0.85"
                />
              </LinearGradient>

              <LinearGradient id="limbGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop
                  offset="0%"
                  stopColor={isRest ? '#34D399' : '#FFA05C'}
                  stopOpacity="1"
                />
                <Stop
                  offset="100%"
                  stopColor={isRest ? colors.secondary : colors.primary}
                  stopOpacity="0.9"
                />
              </LinearGradient>
            </Defs>

            {/* Floor Contact Ground Plane */}
            <Line
              x1="30"
              y1="144"
              x2="170"
              y2="144"
              stroke={colors.border.subtle}
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <Rect
              x="50"
              y="143"
              width="100"
              height="3"
              rx="1.5"
              fill={isRest ? colors.secondary : colors.primary}
              opacity={0.6}
            />

            {/* ================= ARCHETYPE SPECIFIC RENDERS ================= */}
            {archetype === 'pushup_row' ? (
              // Horizontal Push-Up / Plank Athletic Stance
              <G>
                {/* Head */}
                <Circle cx="150" cy="80" r="13" fill="url(#athleteGrad)" stroke="#F8FAFC" strokeWidth="2" />
                {/* Horizontal Torso Plank */}
                <Path d="M140 86 L80 100 L76 112 L136 98 Z" fill="url(#athleteGrad)" />
                {/* Supporting Arms */}
                <Path d="M136 94 L138 138" stroke="url(#limbGrad)" strokeWidth="7" strokeLinecap="round" />
                <Path d="M115 97 L105 125 L95 110" stroke="url(#athleteGrad)" strokeWidth="7" strokeLinecap="round" />
                {/* Extended Plank Legs */}
                <Path d="M80 102 L44 138" stroke="url(#limbGrad)" strokeWidth="8" strokeLinecap="round" />
                {/* Floor Dumbbells */}
                <Rect x="126" y="136" width="24" height="6" rx="2" fill={colors.primary} />
                <Rect x="88" y="106" width="16" height="6" rx="2" fill="#E2E8F0" />
              </G>
            ) : archetype === 'climber' ? (
              // Runner Sprint Leaning Stance
              <G>
                {/* Speed Lines */}
                <Line x1="15" y1="110" x2="45" y2="110" stroke={colors.primary} strokeWidth="2" strokeDasharray="3 3" opacity={0.7} />
                <Line x1="20" y1="125" x2="50" y2="125" stroke={colors.primary} strokeWidth="2" strokeDasharray="3 3" opacity={0.7} />

                {/* Head */}
                <Circle cx="140" cy="55" r="13" fill="url(#athleteGrad)" stroke="#F8FAFC" strokeWidth="2" />
                {/* Leaning Torso */}
                <Path d="M132 64 L90 85 L84 96 L128 75 Z" fill="url(#athleteGrad)" />
                {/* Sprint Braced Arms */}
                <Path d="M128 72 L134 138" stroke="url(#limbGrad)" strokeWidth="7" strokeLinecap="round" />
                <Path d="M110 78 L114 138" stroke="url(#athleteGrad)" strokeWidth="7" strokeLinecap="round" />
                {/* Driving Knee (Forward) */}
                <Path d="M90 86 L118 106 L110 130" stroke="url(#athleteGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                {/* Extended Back Leg */}
                <Path d="M86 92 L46 138" stroke="url(#limbGrad)" strokeWidth="8" strokeLinecap="round" />
              </G>
            ) : archetype === 'lunge' ? (
              // Split Stance Lunge
              <G>
                {/* Head */}
                <Circle cx="100" cy="38" r="14" fill="url(#athleteGrad)" stroke="#F8FAFC" strokeWidth="2" />
                {/* Torso Upright */}
                <Path d="M88 52 L112 52 L108 92 L92 92 Z" fill="url(#athleteGrad)" />
                {/* Front Leg (Bent 90 deg) */}
                <Path d="M106 92 L132 110 L134 140" stroke="url(#athleteGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                {/* Back Leg (Trailing Lunge) */}
                <Path d="M92 92 L70 120 L58 140" stroke="url(#limbGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                {/* Athletic Running Arms */}
                <Path d="M88 56 L68 76 L76 94" stroke="url(#limbGrad)" strokeWidth="7" strokeLinecap="round" />
                <Path d="M112 56 L130 76 L122 94" stroke="url(#athleteGrad)" strokeWidth="7" strokeLinecap="round" />
              </G>
            ) : (
              // Squat / Thruster / Deadlift / General Silhouette
              <G>
                {/* Head with dynamic glow visor */}
                <Circle
                  cx="100"
                  cy="36"
                  r="14"
                  fill="url(#athleteGrad)"
                  stroke="#F8FAFC"
                  strokeWidth="2"
                />

                {/* Powerful Torso */}
                <Path
                  d="M86 52 L114 52 L110 92 L90 92 Z"
                  fill="url(#athleteGrad)"
                />

                {/* Left Arm & Forearm */}
                <Path
                  d="M86 54 L68 72 L62 56"
                  stroke="url(#athleteGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="transparent"
                />

                {/* Right Arm & Forearm */}
                <Path
                  d="M114 54 L132 72 L138 56"
                  stroke="url(#athleteGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="transparent"
                />

                {/* Left Leg (Thigh + Shin) */}
                <Path
                  d="M92 92 L78 116 L76 142"
                  stroke="url(#athleteGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="transparent"
                />

                {/* Right Leg (Thigh + Shin) */}
                <Path
                  d="M108 92 L122 116 L124 142"
                  stroke="url(#athleteGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="transparent"
                />

                {/* Joint Pivot Highlights */}
                <Circle cx="86" cy="54" r="3.5" fill="#FFFFFF" opacity={0.8} />
                <Circle cx="114" cy="54" r="3.5" fill="#FFFFFF" opacity={0.8} />
                <Circle cx="78" cy="116" r="3.5" fill="#FFFFFF" opacity={0.8} />
                <Circle cx="122" cy="116" r="3.5" fill="#FFFFFF" opacity={0.8} />
              </G>
            )}
          </Svg>
        </Animated.View>

        {/* Dynamic Overhead Barbell / Dumbbells */}
        {!isRest ? (
          <Animated.View style={[styles.barbellWrapper, weightMotionStyle]}>
            <Svg width={200} height={40} viewBox="0 0 200 40">
              {/* Central Olympic Bar */}
              <Rect x="42" y="18" width="116" height="4" rx="2" fill="#E2E8F0" />
              {/* Left Plates */}
              <Rect x="36" y="6" width="9" height="28" rx="3" fill={colors.primary} />
              <Rect x="47" y="11" width="5" height="18" rx="2" fill="#94A3B8" />
              {/* Right Plates */}
              <Rect x="155" y="6" width="9" height="28" rx="3" fill={colors.primary} />
              <Rect x="148" y="11" width="5" height="18" rx="2" fill="#94A3B8" />
            </Svg>
          </Animated.View>
        ) : null}
      </View>

      {/* Dynamic Tempo & Biomechanics Footer */}
      <View
        style={[
          styles.stageFooter,
          {
            backgroundColor: colors.background.elevated,
            borderTopColor: colors.border.subtle,
            borderBottomLeftRadius: radius['2xl'],
            borderBottomRightRadius: radius['2xl'],
          },
        ]}
      >
        <View style={styles.footerCol}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Activity size={12} color={isRest ? colors.secondary : colors.primary} />
            <Text
              style={[
                typography.caption,
                { color: colors.text.muted, marginLeft: 4, fontWeight: '600' },
              ]}
            >
              Target Focus:
            </Text>
          </View>
          <Text
            style={[
              typography.caption,
              { color: colors.text.primary, fontWeight: '700', marginTop: 1 },
            ]}
          >
            {targetMuscleGroup}
          </Text>
        </View>

        <View style={[styles.footerCol, { alignItems: 'flex-end' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Flame size={12} color={getTempoBadgeColor()} />
            <Text
              style={[
                typography.caption,
                { color: colors.text.muted, marginLeft: 4, fontWeight: '600' },
              ]}
            >
              Active Cadence:
            </Text>
          </View>
          <Text
            style={[
              typography.caption,
              {
                color: getTempoBadgeColor(),
                fontWeight: '800',
                marginTop: 1,
              },
            ]}
          >
            {getTempoLabel()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stageContainer: {
    width: '100%',
    borderWidth: 1,
    overflow: 'hidden',
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  repPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  bpmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  canvasArea: {
    height: 165,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseRipple: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
  },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  barbellWrapper: {
    position: 'absolute',
    top: 10,
    zIndex: 3,
  },
  stageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderTopWidth: 1,
  },
  footerCol: {
    justifyContent: 'center',
  },
});
