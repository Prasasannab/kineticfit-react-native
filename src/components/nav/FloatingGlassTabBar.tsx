import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  Home,
  Dumbbell,
  BarChart2,
  Utensils,
} from 'lucide-react-native';
import { useTheme } from '@/theme';

export type ActiveNavTab = 'home' | 'workouts' | 'activity' | 'nutrition';

export interface FloatingGlassTabBarProps {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
}

export function FloatingGlassTabBar({
  activeTab,
  onTabChange,
}: FloatingGlassTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, shadows, isDark } = useTheme();

  const tabs: { id: ActiveNavTab; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'activity', label: 'Activity', icon: BarChart2 },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
  ];

  return (
    <View
      style={[
        styles.floatingContainer,
        {
          bottom: Math.max(16, insets.bottom + 8),
        },
      ]}
    >
      <View
        style={[
          styles.pillBar,
          {
            backgroundColor: isDark ? colors.background.glassDense : '#FFFFFF',
            borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
            ...shadows.lg,
          },
        ]}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <Pressable
              key={tab.id}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                onTabChange(tab.id);
              }}
              style={({ pressed }) => [
                styles.tabButton,
                isActive && [
                  styles.tabButtonActive,
                  { backgroundColor: colors.primarySurface },
                ],
                pressed && { transform: [{ scale: 0.92 }] },
              ]}
            >
              <IconComponent
                size={22}
                color={isActive ? colors.primary : isDark ? colors.text.muted : '#64748B'}
                strokeWidth={isActive ? 2.6 : 1.8}
              />
              {isActive ? (
                <Text
                  style={[
                    styles.tabLabel,
                    { color: colors.primary, fontWeight: '700' },
                  ]}
                >
                  {tab.label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  pillBar: {
    width: '100%',
    maxWidth: 380,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabButtonActive: {
    paddingHorizontal: 16,
  },
  tabLabel: {
    fontSize: 12,
    marginLeft: 6,
  },
});
