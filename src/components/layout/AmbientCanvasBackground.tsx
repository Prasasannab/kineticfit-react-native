import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '@/theme';

export interface AmbientCanvasBackgroundProps {
  centerClear?: boolean;
}

export function AmbientCanvasBackground({ centerClear = false }: AmbientCanvasBackgroundProps) {
  const { isDark } = useTheme();

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          {/* Top-Left Jade / Emerald Glow */}
          <RadialGradient
            id="ambientMint"
            cx="15%"
            cy={centerClear ? '6%' : '12%'}
            rx={centerClear ? '60%' : '50%'}
            ry={centerClear ? '25%' : '40%'}
            fx="15%"
            fy={centerClear ? '6%' : '12%'}
          >
            <Stop
              offset="0%"
              stopColor={isDark ? '#064E3B' : '#D9F4EB'}
              stopOpacity={isDark ? 0.65 : centerClear ? 0.9 : 0.85}
            />
            <Stop
              offset="60%"
              stopColor={isDark ? '#042F2C' : '#E9F7F1'}
              stopOpacity={isDark ? 0.35 : centerClear ? 0.35 : 0.45}
            />
            <Stop offset="100%" stopColor={isDark ? '#0B0F19' : '#FFFFFF'} stopOpacity={0} />
          </RadialGradient>

          {/* Top-Right Warm Peach / Amber Blush */}
          <RadialGradient
            id="ambientPeach"
            cx="85%"
            cy={centerClear ? '8%' : '25%'}
            rx={centerClear ? '60%' : '55%'}
            ry={centerClear ? '25%' : '45%'}
            fx="85%"
            fy={centerClear ? '8%' : '25%'}
          >
            <Stop
              offset="0%"
              stopColor={isDark ? '#451A03' : '#FFEFE5'}
              stopOpacity={isDark ? 0.65 : centerClear ? 0.9 : 0.85}
            />
            <Stop
              offset="60%"
              stopColor={isDark ? '#2E1002' : '#FFF7F2'}
              stopOpacity={isDark ? 0.35 : centerClear ? 0.35 : 0.45}
            />
            <Stop offset="100%" stopColor={isDark ? '#0B0F19' : '#FFFFFF'} stopOpacity={0} />
          </RadialGradient>

          {/* Bottom-Right Subtle Warmth */}
          <RadialGradient
            id="ambientBottom"
            cx="75%"
            cy={centerClear ? '90%' : '85%'}
            rx={centerClear ? '65%' : '45%'}
            ry={centerClear ? '30%' : '35%'}
            fx="75%"
            fy={centerClear ? '90%' : '85%'}
          >
            <Stop
              offset="0%"
              stopColor={isDark ? '#1C1917' : '#FFEFE5'}
              stopOpacity={isDark ? 0.45 : 0.65}
            />
            <Stop offset="100%" stopColor={isDark ? '#0B0F19' : '#FFFFFF'} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* Base Wash: Dark Obsidian in dark mode, Clean White / Cream in light mode */}
        <Rect
          width="100%"
          height="100%"
          fill={isDark ? '#0B0F19' : centerClear ? '#FFFFFF' : '#F7FBF9'}
        />

        {/* Overlapping Luxury Ambient Halos */}
        <Rect width="100%" height="100%" fill="url(#ambientMint)" />
        <Rect width="100%" height="100%" fill="url(#ambientPeach)" />
        <Rect width="100%" height="100%" fill="url(#ambientBottom)" />
      </Svg>
    </View>
  );
}
