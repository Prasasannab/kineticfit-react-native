import React, { useEffect } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowRight, ChevronLeft, Plus } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { AmbientCanvasBackground } from '@/components/layout/AmbientCanvasBackground';

export interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export function OnboardingModal({
  visible,
  onClose,
  onGetStarted,
}: OnboardingModalProps) {
  const insets = useSafeAreaInsets();
  const { colors, typography, radius, shadows, isDark } = useTheme();

  useEffect(() => {
    if (visible) {
      RNStatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    }
  }, [visible, isDark]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background.base} />
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        {/* Luxury Ambient Halo Canvas Background */}
        <AmbientCanvasBackground />

        {/* Top Header Row with Back Circle & Skip */}
        <View style={styles.topRow}>
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              onClose();
            }}
            style={({ pressed }) => [
              styles.glassCircleBtn,
              {
                backgroundColor: colors.background.glassDense,
                borderColor: colors.border.card,
                ...shadows.sm,
              },
              pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
            ]}
          >
            <ChevronLeft size={20} color={colors.text.primary} strokeWidth={2.4} />
          </Pressable>

          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              onClose();
            }}
            hitSlop={12}
            style={({ pressed }) => [
              styles.skipBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={[typography.caption, { color: colors.text.muted, fontWeight: '700' }]}>
              Skip
            </Text>
          </Pressable>
        </View>

        {/* Hero Arch with Cutout Fitness Athlete (Matching Screen 1) */}
        <View style={styles.heroArchContainer}>
          <View
            style={[
              styles.heroArchBackdrop,
              {
                backgroundColor: isDark ? 'rgba(6, 78, 59, 0.40)' : 'rgba(217, 244, 235, 0.92)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
                ...shadows.lg,
              },
            ]}
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=85',
              }}
              style={styles.heroImage}
            />
          </View>
        </View>

        {/* Headline & Body Copy */}
        <View style={styles.textContainer}>
          <Text style={[typography.display, styles.mainHeadline, { color: colors.text.primary }]}>
            Your{'\n'}Fitness{'\n'}Journey{'\n'}Starts Here
          </Text>

          <Text style={[typography.bodyMedium, styles.subtitle, { color: colors.text.muted }]}>
            Track workouts, stay consistent and become your best self.
          </Text>
        </View>

        {/* Capsule "Get Started ->" Button */}
        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            onGetStarted();
          }}
          style={({ pressed }) => [
            styles.getStartedButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.full,
              ...shadows.glowMint,
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={[typography.subtitle1, styles.buttonText]}>Get Started</Text>
          <View style={styles.arrowCircle}>
            <ArrowRight size={17} color={colors.primary} strokeWidth={2.8} />
          </View>
        </Pressable>

        {/* Social Proof Card ("Join Over 2M+ Users") */}
        <View
          style={[
            styles.socialProofCard,
            {
              backgroundColor: colors.background.glassDense,
              borderColor: colors.border.card,
              borderRadius: 22,
              ...shadows.glass,
            },
          ]}
        >
          <Text style={[typography.caption, { color: colors.text.primary, fontWeight: '700' }]}>
            Join Over 2M+ Users
          </Text>

          {/* Overlapping Avatar Stack */}
          <View style={styles.avatarStack}>
            {[
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
            ].map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                style={[
                  styles.stackAvatar,
                  {
                    marginLeft: idx > 0 ? -10 : 0,
                    zIndex: 3 - idx,
                    borderColor: isDark ? colors.background.base : '#FFFFFF',
                  },
                ]}
              />
            ))}
            <View
              style={[
                styles.plusBadge,
                {
                  backgroundColor: colors.primary,
                  borderColor: isDark ? colors.background.base : '#FFFFFF',
                  marginLeft: -10,
                  zIndex: 4,
                },
              ]}
            >
              <Plus size={11} color="#FFFFFF" strokeWidth={3} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  glassCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  heroArchContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  heroArchBackdrop: {
    width: 250,
    height: 310,
    borderRadius: 125,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    marginTop: 6,
  },
  mainHeadline: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -1.0,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 8,
    height: 56,
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  socialProofCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderWidth: 1.5,
    marginTop: 10,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
  },
  plusBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
