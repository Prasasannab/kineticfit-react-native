import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

export interface MuscleTargetGroup {
  id: string;
  name: string;
  shortLabel: string;
  viewType: 'front' | 'back' | 'side';
  isActive: boolean;
}

export interface MuscleAnatomyCarouselProps {
  activeMuscleId?: string;
  onSelectMuscle?: (muscle: MuscleTargetGroup) => void;
}

export function MuscleAnatomyCarousel({
  activeMuscleId = 'rear_delts',
  onSelectMuscle,
}: MuscleAnatomyCarouselProps) {
  const [selectedId, setSelectedId] = useState<string>(activeMuscleId);

  const muscleGroups: MuscleTargetGroup[] = [
    {
      id: 'chest_shoulders',
      name: 'Chest & Deltoids',
      shortLabel: 'Chest',
      viewType: 'front',
      isActive: selectedId === 'chest_shoulders',
    },
    {
      id: 'rear_delts',
      name: 'Upper Back & Rear Delts',
      shortLabel: 'Upper Back',
      viewType: 'back',
      isActive: selectedId === 'rear_delts',
    },
    {
      id: 'lats_core',
      name: 'Lats & Lower Core',
      shortLabel: 'Lats',
      viewType: 'back',
      isActive: selectedId === 'lats_core',
    },
  ];

  const handleSelect = (group: MuscleTargetGroup) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSelectedId(group.id);
    onSelectMuscle?.(group);
  };

  // SVG Anatomy Mannequin Silhouettes with Glowing Muscle Activation
  const renderMannequinSvg = (group: MuscleTargetGroup) => {
    const isTarget = group.id === selectedId;

    if (group.id === 'rear_delts') {
      // Rear Upper Back & Trapezius View (Glowing Neon Purple / Magenta matching user's photo)
      return (
        <Svg width={54} height={58} viewBox="0 0 54 58">
          <Defs>
            <LinearGradient id="neonPurpleGlow" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#F472B6" />
              <Stop offset="50%" stopColor="#C026D3" />
              <Stop offset="100%" stopColor="#9333EA" />
            </LinearGradient>
          </Defs>

          {/* Head & Neck Base */}
          <Path
            d="M 23 4 C 23 2, 31 2, 31 4 C 33 8, 33 13, 31 15 C 29 17, 25 17, 23 15 C 21 13, 21 8, 23 4 Z"
            fill="#64748B"
            opacity={0.4}
          />

          {/* Torso & Arms Base Contour */}
          <Path
            d="M 17 17 C 12 19, 7 24, 5 35 C 4 41, 7 48, 10 52 L 13 50 C 12 43, 13 36, 16 30 C 18 36, 18 45, 17 55 L 37 55 C 36 45, 36 36, 38 30 C 41 36, 42 43, 41 50 L 44 52 C 47 48, 50 41, 49 35 C 47 24, 42 19, 37 17 C 32 16, 22 16, 17 17 Z"
            fill="#64748B"
            opacity={0.35}
          />

          {/* ACTIVE GLOWING MUSCLE LAYER: Trapezius, Rhomboids & Rear Delts (Neon Purple) */}
          <Path
            d="M 27 16 C 24 16, 21 17, 19 19 C 16 22, 14 26, 15 29 C 18 29, 21 26, 24 23 C 25 28, 25 35, 27 40 C 29 35, 29 28, 30 23 C 33 26, 36 29, 39 29 C 40 26, 38 22, 35 19 C 33 17, 30 16, 27 16 Z"
            fill="url(#neonPurpleGlow)"
          />

          {/* Spinal Column Light Core Highlight */}
          <Path
            d="M 27 21 L 27 38"
            stroke="#FFFFFF"
            strokeWidth={1.8}
            strokeLinecap="round"
            opacity={0.9}
          />
        </Svg>
      );
    }

    if (group.id === 'chest_shoulders') {
      // Front Chest & Deltoids Silhouette
      return (
        <Svg width={54} height={58} viewBox="0 0 54 58">
          <Path
            d="M 23 4 C 23 2, 31 2, 31 4 C 33 8, 33 13, 31 15 C 29 17, 25 17, 23 15 C 21 13, 21 8, 23 4 Z"
            fill="#64748B"
            opacity={0.35}
          />
          {/* Front Torso Contours */}
          <Path
            d="M 18 17 C 12 19, 7 24, 5 35 C 4 41, 7 48, 10 52 L 13 50 C 12 43, 13 36, 16 30 C 18 36, 18 45, 17 55 L 37 55 C 36 45, 36 36, 38 30 C 41 36, 42 43, 41 50 L 44 52 C 47 48, 50 41, 49 35 C 47 24, 42 19, 36 17 Z"
            fill="#64748B"
            opacity={0.3}
          />
          {/* Pectoral & Front Delt Highlights */}
          <Path
            d="M 18 22 C 21 24, 25 24, 27 22 C 29 24, 33 24, 36 22 C 34 27, 29 28, 27 26 C 25 28, 20 27, 18 22 Z"
            fill={isTarget ? '#C026D3' : '#64748B'}
            opacity={isTarget ? 0.9 : 0.45}
          />
        </Svg>
      );
    }

    // Lats & Core Silhouette
    return (
      <Svg width={54} height={58} viewBox="0 0 54 58">
        <Path
          d="M 23 4 C 23 2, 31 2, 31 4 C 33 8, 33 13, 31 15 C 29 17, 25 17, 23 15 C 21 13, 21 8, 23 4 Z"
          fill="#64748B"
          opacity={0.35}
        />
        <Path
          d="M 18 17 C 12 19, 7 24, 5 35 C 4 41, 7 48, 10 52 L 13 50 C 12 43, 13 36, 16 30 C 18 36, 18 45, 17 55 L 37 55 C 36 45, 36 36, 38 30 C 41 36, 42 43, 41 50 L 44 52 C 47 48, 50 41, 49 35 C 47 24, 42 19, 36 17 Z"
          fill="#64748B"
          opacity={0.3}
        />
        {/* Latissimus Dorsi Highlights */}
        <Path
          d="M 18 28 C 22 30, 24 38, 23 45 C 20 42, 17 36, 18 28 Z M 36 28 C 32 30, 30 38, 31 45 C 34 42, 37 36, 36 28 Z"
          fill={isTarget ? '#C026D3' : '#64748B'}
          opacity={isTarget ? 0.9 : 0.45}
        />
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.carouselDock,
          {
            backgroundColor: 'rgba(30, 41, 59, 0.06)',
            borderColor: 'rgba(255, 255, 255, 0.8)',
          },
        ]}
      >
        {muscleGroups.map((group) => {
          const isTarget = group.id === selectedId;

          return (
            <Pressable
              key={group.id}
              onPress={() => handleSelect(group)}
              style={({ pressed }) => [
                styles.tileWrapper,
                isTarget && styles.activeNeonTile,
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
            >
              {renderMannequinSvg(group)}

              {/* Subtitle label */}
              <Text
                style={[
                  styles.tileLabel,
                  {
                    color: isTarget ? '#C026D3' : '#94A3B8',
                    fontWeight: isTarget ? '800' : '600',
                  },
                ]}
              >
                {group.shortLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  carouselDock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1.2,
  },
  tileWrapper: {
    width: 72,
    height: 88,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  activeNeonTile: {
    borderColor: '#D946EF',
    backgroundColor: 'rgba(217, 70, 239, 0.08)',
    shadowColor: '#D946EF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 12,
    elevation: 4,
  },
  tileLabel: {
    fontSize: 9.5,
    marginTop: 4,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
