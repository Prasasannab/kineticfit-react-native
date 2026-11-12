import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  Circle,
  Ellipse,
  G,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);

export interface Transparent3DMuscleStageProps {
  exerciseName?: string;
  isPaused: boolean;
  isRest: boolean;
  height?: number;
}

export function Transparent3DMuscleStage({
  isPaused,
  isRest,
  height = 320,
}: Transparent3DMuscleStageProps) {
  // Muscle activation pulse animation
  const glowPulse = useSharedValue(0.6);

  useEffect(() => {
    if (isPaused || isRest) {
      glowPulse.value = withTiming(0.4, { duration: 400 });
      return;
    }

    // Dynamic muscle contraction rhythm (2-second cadence: eccentric -> hold -> concentric)
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 900, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(0.45, { duration: 1100, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1,
      true
    );
  }, [isPaused, isRest]);

  const animatedGlowProps = useAnimatedProps(() => {
    return {
      opacity: glowPulse.value,
    };
  });

  return (
    <View style={[styles.container, { height }]}>
      {/* 100% TRANSPARENT SVG: Biomechanical Mannequin with Glowing Muscle Heatmaps */}
      <Svg width="100%" height="100%" viewBox="0 0 320 320">
        <Defs>
          {/* Neon Muscle Heatmap Radial Gradient: Radiant Amber Core to Neon Pink Edge */}
          <RadialGradient id="activeMuscleHeatmap" cx="50%" cy="40%" r="65%">
            <Stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
            <Stop offset="25%" stopColor="#FBBF24" stopOpacity="0.95" />
            <Stop offset="65%" stopColor="#F97316" stopOpacity="0.85" />
            <Stop offset="100%" stopColor="#D946EF" stopOpacity="0.9" />
          </RadialGradient>

          {/* Deep Ambient Neon Backlight Glow */}
          <RadialGradient id="muscleAuraGlow" cx="50%" cy="35%" r="55%">
            <Stop offset="0%" stopColor="#F472B6" stopOpacity="0.45" />
            <Stop offset="60%" stopColor="#C026D3" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </RadialGradient>

          {/* 3D Silver/Slate Shading Gradient for Mannequin Anatomy */}
          <LinearGradient id="mannequinShade" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#E2E8F0" />
            <Stop offset="50%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>

          {/* Dumbbell Metal Texture */}
          <LinearGradient id="ironPlate" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#475569" />
            <Stop offset="50%" stopColor="#1E293B" />
            <Stop offset="100%" stopColor="#0F172A" />
          </LinearGradient>
        </Defs>

        {/* 1. Soft Floor Contact Shadow under feet (Natural 3D grounding) */}
        <Ellipse cx="160" cy="305" rx="75" ry="8" fill="rgba(30, 41, 59, 0.08)" />
        <Ellipse cx="160" cy="305" rx="42" ry="4.5" fill="rgba(30, 41, 59, 0.12)" />

        {/* 2. Radiant Neon Backlight Halo */}
        <Circle cx="160" cy="145" r="85" fill="url(#muscleAuraGlow)" />

        {/* 3. Left Arm & Left Dumbbell in Bent-Over Position */}
        <G>
          {/* Left Dumbbell Plates */}
          <Ellipse cx="58" cy="155" rx="14" ry="7" fill="url(#ironPlate)" transform="rotate(-30 58 155)" />
          <Ellipse cx="48" cy="160" rx="13" ry="6.5" fill="url(#ironPlate)" transform="rotate(-30 48 160)" />
          {/* Handle */}
          <Path d="M 46 161 L 70 148" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
          {/* Left Forearm & Hand */}
          <Path
            d="M 64 152 C 78 142, 95 135, 115 132 L 118 140 C 98 143, 82 150, 68 158 Z"
            fill="url(#mannequinShade)"
          />
          {/* Left Bicep / Tricep */}
          <Path
            d="M 115 132 C 126 130, 138 128, 146 128 L 148 138 C 138 138, 128 140, 118 140 Z"
            fill="url(#mannequinShade)"
          />
        </G>

        {/* 4. Right Arm & Right Dumbbell in Extended Fly Position */}
        <G>
          {/* Right Arm */}
          <Path
            d="M 174 128 C 182 128, 194 130, 205 132 L 202 140 C 192 140, 182 138, 172 138 Z"
            fill="url(#mannequinShade)"
          />
          {/* Right Forearm & Hand */}
          <Path
            d="M 205 132 C 225 135, 242 142, 256 152 L 252 158 C 238 150, 222 143, 202 140 Z"
            fill="url(#mannequinShade)"
          />
          {/* Right Dumbbell Plates */}
          <Ellipse cx="262" cy="155" rx="14" ry="7" fill="url(#ironPlate)" transform="rotate(30 262 155)" />
          <Ellipse cx="272" cy="160" rx="13" ry="6.5" fill="url(#ironPlate)" transform="rotate(30 272 160)" />
          <Path d="M 250 148 L 274 161" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        </G>

        {/* 5. Legs & Lower Body (Athletic bent knee stance) */}
        <G>
          {/* Left Thigh (Hamstring / Glute) */}
          <Path
            d="M 144 195 C 136 210, 134 228, 135 245 C 142 246, 148 244, 151 235 C 153 220, 153 205, 154 195 Z"
            fill="#334155"
          />
          {/* Left Calf & Foot */}
          <Path
            d="M 135 245 C 136 265, 138 285, 136 300 L 148 300 C 150 285, 149 265, 151 245 Z"
            fill="url(#mannequinShade)"
          />
          <Path d="M 128 300 C 132 298, 148 298, 152 304 L 126 304 Z" fill="#64748B" />

          {/* Right Thigh */}
          <Path
            d="M 166 195 C 167 205, 167 220, 169 235 C 172 244, 178 246, 185 245 C 186 228, 184 210, 176 195 Z"
            fill="#334155"
          />
          {/* Right Calf & Foot */}
          <Path
            d="M 169 245 C 171 265, 170 285, 172 300 L 184 300 C 182 285, 184 265, 185 245 Z"
            fill="url(#mannequinShade)"
          />
          <Path d="M 168 300 C 172 298, 188 298, 192 304 L 166 304 Z" fill="#64748B" />

          {/* Athletic Shorts */}
          <Path
            d="M 138 185 C 136 195, 144 205, 155 204 L 160 196 L 165 204 C 176 205, 184 195, 182 185 Z"
            fill="#1E293B"
          />
        </G>

        {/* 6. Torso & Back Structure */}
        <Path
          d="M 146 128 C 140 135, 136 150, 138 185 L 182 185 C 184 150, 180 135, 174 128 Z"
          fill="url(#mannequinShade)"
        />

        {/* 7. Head & Neck in Angled Stance */}
        <Path
          d="M 152 108 C 152 102, 168 102, 168 108 C 172 116, 170 126, 166 130 C 160 132, 154 132, 150 128 C 148 122, 148 114, 152 108 Z"
          fill="url(#mannequinShade)"
        />

        {/* 8. ACTIVE GLOWING MUSCLE HEATMAP: Rear Deltoids, Traps & Rhomboids (Amber/Gold/Magenta Glow) */}
        <AnimatedG animatedProps={animatedGlowProps}>
          {/* Glowing Active Trapezius and Upper Back */}
          <Path
            d="M 160 126 C 150 127, 143 135, 141 148 C 146 156, 152 165, 160 170 C 168 165, 174 156, 179 148 C 177 135, 170 127, 160 126 Z"
            fill="url(#activeMuscleHeatmap)"
          />

          {/* Left Rear Deltoid Glow Pad */}
          <Path
            d="M 143 129 C 135 133, 126 136, 118 138 C 122 144, 129 148, 137 146 C 140 140, 142 134, 143 129 Z"
            fill="url(#activeMuscleHeatmap)"
          />

          {/* Right Rear Deltoid Glow Pad */}
          <Path
            d="M 177 129 C 185 133, 194 136, 202 138 C 198 144, 191 148, 183 146 C 180 140, 178 134, 177 129 Z"
            fill="url(#activeMuscleHeatmap)"
          />

          {/* Central Spinal Energy Line */}
          <Path
            d="M 160 130 L 160 166"
            stroke="#FFFFFF"
            strokeWidth={2.4}
            strokeLinecap="round"
            opacity={0.95}
          />
        </AnimatedG>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
