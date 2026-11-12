import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Rect as SvgRect,
  Stop as SvgStop,
} from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Zap } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { ExerciseMotionVisualizer } from './ExerciseMotionVisualizer';

export interface Exercise3DVideoPlayerProps {
  exerciseName: string;
  targetMuscleGroup: string;
  videoUrl?: string;
  isRest: boolean;
  isPaused: boolean;
  stageHeight?: number;
  scale?: number;
  style?: StyleProp<ViewStyle>;
  showSpeedControl?: boolean;
}

export function Exercise3DVideoPlayer({
  exerciseName,
  targetMuscleGroup,
  videoUrl,
  isRest,
  isPaused,
  stageHeight = 345,
  scale = 1.3,
  style,
  showSpeedControl = true,
}: Exercise3DVideoPlayerProps) {
  const { colors, typography, shadows, isDark } = useTheme();

  // Video playback speed: 0.5x (Form Slow-Mo), 1.0x (Normal), 1.5x (Fast)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(true);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);

  const videoRef = useRef<Video>(null);

  // Sync pause state with video player
  useEffect(() => {
    if (!videoRef.current || hasVideoError) return;

    if (isPaused) {
      void videoRef.current.pauseAsync().catch(() => {});
    } else {
      void videoRef.current.playAsync().catch(() => {});
    }
  }, [isPaused, hasVideoError]);

  // Sync playback speed
  useEffect(() => {
    if (!videoRef.current || hasVideoError) return;
    void videoRef.current.setRateAsync(playbackSpeed, true).catch(() => {});
  }, [playbackSpeed, hasVideoError]);

  // Reset loading state on exercise change
  useEffect(() => {
    setIsLoadingVideo(true);
    setHasVideoError(false);
  }, [videoUrl, exerciseName]);

  const handleCycleSpeed = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setPlaybackSpeed((prev) => {
      if (prev === 0.5) return 1.0;
      if (prev === 1.0) return 1.5;
      return 0.5;
    });
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoadingVideo(false);
    } else if (status.error) {
      setHasVideoError(true);
      setIsLoadingVideo(false);
    }
  };

  const hasPlayableVideo = !!videoUrl && !hasVideoError;

  return (
    <View style={[styles.wrapper, style]}>
      {hasPlayableVideo ? (
        <View
          style={[
            styles.stageContainer,
            {
              height: stageHeight,
              borderRadius: 26,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
              backgroundColor: isDark ? '#060A12' : '#FFFFFF',
              ...shadows.md,
            },
          ]}
        >
          {/* Top Controls Row */}
          <View style={styles.floatingControlsRow}>
            {/* Rest Preview Indicator Pill */}
            {isRest ? (
              <View
                style={[
                  styles.restPreviewBadge,
                  {
                    backgroundColor: isDark ? 'rgba(255, 107, 0, 0.20)' : 'rgba(255, 107, 0, 0.1)',
                    borderColor: isDark ? 'rgba(255, 107, 0, 0.40)' : 'rgba(255, 107, 0, 0.25)',
                  },
                ]}
              >
                <Text style={[typography.caption, styles.restPreviewText, { color: colors.secondary }]}>
                  UP NEXT PREVIEW
                </Text>
              </View>
            ) : (
              <View style={{ flex: 1 }} />
            )}

            {/* Right Buttons: Speed Pill */}
            {showSpeedControl ? (
              <Pressable
                onPress={handleCycleSpeed}
                style={({ pressed }) => [
                  styles.speedControlPill,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.90)' : 'rgba(255, 255, 255, 0.92)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.06)',
                    ...shadows.sm,
                  },
                  pressed && { transform: [{ scale: 0.93 }] },
                ]}
              >
                <Zap size={11} color={colors.secondary} />
                <Text
                  style={[
                    typography.caption,
                    styles.speedText,
                    { color: colors.text.primary },
                  ]}
                >
                  {playbackSpeed}x{playbackSpeed === 0.5 ? ' Form' : ''}
                </Text>
              </Pressable>
            ) : null}
          </View>

          {/* 3D Exercise Motion Animation Stage */}
          <View style={styles.videoStageContainer}>
            {/* Subtle Floor Spotlight Glow */}
            {isDark ? (
              <View style={styles.floorSpotlight} pointerEvents="none">
                <Svg width="100%" height="100%">
                  <Defs>
                    <SvgRadialGradient
                      id="spotlightGlow"
                      cx="50%"
                      cy="82%"
                      rx="45%"
                      ry="22%"
                      fx="50%"
                      fy="82%"
                    >
                      <SvgStop offset="0%" stopColor={colors.primary} stopOpacity={0.25} />
                      <SvgStop offset="65%" stopColor={colors.primary} stopOpacity={0.06} />
                      <SvgStop offset="100%" stopColor={colors.background.base} stopOpacity={0} />
                    </SvgRadialGradient>
                  </Defs>
                  <SvgRect width="100%" height="100%" fill="url(#spotlightGlow)" />
                </Svg>
              </View>
            ) : null}

            <Video
              ref={videoRef}
              source={{ uri: videoUrl || '' }}
              rate={playbackSpeed}
              volume={0}
              isMuted={true}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={!isPaused}
              isLooping={true}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
              style={[styles.videoPlayer, { transform: [{ scale }] }]}
            />

            {/* Edge Vignette Fades for Seamless Dark Stage Blending */}
            {isDark ? (
              <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                <Svg width="100%" height="100%">
                  <Defs>
                    <SvgLinearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
                      <SvgStop offset="0%" stopColor={colors.background.base} stopOpacity={0.9} />
                      <SvgStop offset="60%" stopColor={colors.background.base} stopOpacity={0.25} />
                      <SvgStop offset="100%" stopColor={colors.background.base} stopOpacity={0} />
                    </SvgLinearGradient>
                    <SvgLinearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
                      <SvgStop offset="0%" stopColor={colors.background.base} stopOpacity={0} />
                      <SvgStop offset="40%" stopColor={colors.background.base} stopOpacity={0.25} />
                      <SvgStop offset="100%" stopColor={colors.background.base} stopOpacity={0.95} />
                    </SvgLinearGradient>
                  </Defs>
                  <SvgRect x="0" y="0" width="100%" height="40" fill="url(#topFade)" />
                  <SvgRect x="0" y={stageHeight - 50} width="100%" height="50" fill="url(#bottomFade)" />
                </Svg>
              </View>
            ) : null}

            {isLoadingVideo ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null}
          </View>
        </View>
      ) : (
        /* Biomechanical Animated Vector Fallback */
        <ExerciseMotionVisualizer
          exerciseName={exerciseName}
          targetMuscleGroup={targetMuscleGroup}
          isRest={isRest}
          isPaused={isPaused}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  stageContainer: {
    width: '92%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },
  floatingControlsRow: {
    position: 'absolute',
    top: 10,
    left: 18,
    right: 18,
    zIndex: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speedControlPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  speedText: {
    fontWeight: '800',
    fontSize: 11,
    marginLeft: 3,
    fontVariant: ['tabular-nums'],
  },
  restPreviewBadge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  restPreviewText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  videoStageContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  floorSpotlight: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 5,
  },
});
