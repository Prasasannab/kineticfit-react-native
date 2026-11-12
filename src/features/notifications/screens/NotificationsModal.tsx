import React, { useState, useEffect } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  BellOff,
  Calendar,
  CheckCheck,
  ChevronLeft,
  Dumbbell,
  Trophy,
  Utensils,
  X,
} from 'lucide-react-native';
import { useTheme } from '@/theme';
import { SurfaceCard } from '@/components/cards/SurfaceCard';
import { AmbientCanvasBackground } from '@/components/layout/AmbientCanvasBackground';
import { NotificationCategory, NotificationItem } from '../types';

export interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectBooking?: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'booking',
    title: 'Session Confirmed • Sarah Jenkins',
    subtitle: 'Tomorrow at 09:00 AM • 45 min HIIT & Biomechanical Mobility',
    timeAgo: '12m ago',
    isRead: false,
    avatarUrl:
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=150&q=80',
    actionText: 'View Session',
  },
  {
    id: 'notif_2',
    type: 'workout',
    title: 'Daily Move Goal Crushed! 🔥',
    subtitle: 'You burned 520 kcal (86% of target). Great power output on Dumbbell Thrusters!',
    timeAgo: '2h ago',
    isRead: false,
  },
  {
    id: 'notif_3',
    type: 'nutrition',
    title: 'Hydration & Nutrition Check 🥗',
    subtitle: 'You have 450 kcal remaining for dinner. Drink 500ml water to reach today’s 2.5L goal.',
    timeAgo: '4h ago',
    isRead: false,
  },
  {
    id: 'notif_4',
    type: 'challenge',
    title: '4-Day Streak Active ⚡',
    subtitle: 'You’re 1 workout away from hitting your 5-day Consistency Streak badge.',
    timeAgo: 'Yesterday',
    isRead: true,
  },
];

export function NotificationsModal({
  visible,
  onClose,
  onSelectBooking,
}: NotificationsModalProps) {
  const insets = useSafeAreaInsets();
  const { colors, typography, spacing, radius, shadows, isDark } = useTheme();

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');

  useEffect(() => {
    if (visible) {
      RNStatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    }
  }, [visible, isDark]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleReadStatus = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const markAllAsRead = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAllNotifications = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'booking') return item.type === 'booking';
    if (activeCategory === 'workout') return item.type === 'workout' || item.type === 'challenge';
    if (activeCategory === 'nutrition') return item.type === 'nutrition';
    return true;
  });

  const renderIcon = (type: NotificationItem['type'], avatarUrl?: string) => {
    if (avatarUrl) {
      return (
        <Image
          source={{ uri: avatarUrl }}
          style={[styles.avatarImage, { borderRadius: radius.full }]}
        />
      );
    }

    switch (type) {
      case 'workout':
        return (
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.16)' : 'rgba(43, 183, 137, 0.12)',
              },
            ]}
          >
            <Dumbbell size={18} color={colors.primary} strokeWidth={2.4} />
          </View>
        );
      case 'nutrition':
        return (
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isDark ? 'rgba(255, 107, 0, 0.16)' : 'rgba(255, 138, 101, 0.12)',
              },
            ]}
          >
            <Utensils size={18} color={colors.secondary} strokeWidth={2.4} />
          </View>
        );
      case 'challenge':
      default:
        return (
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isDark ? 'rgba(251, 191, 36, 0.16)' : 'rgba(251, 191, 36, 0.12)',
              },
            ]}
          >
            <Trophy size={18} color="#F59E0B" strokeWidth={2.4} />
          </View>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background.base} />

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background.base,
            paddingTop: Math.max(insets.top + 10, 54),
            paddingBottom: Math.max(insets.bottom + 12, 24),
          },
        ]}
      >
        <AmbientCanvasBackground />

        {/* Top Header */}
        <View style={[styles.headerRow, { paddingHorizontal: spacing.lg }]}>
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              onClose();
            }}
            style={({ pressed }) => [
              styles.roundHeaderBtn,
              {
                backgroundColor: isDark ? colors.background.glassDense : '#FFFFFF',
                borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
                ...shadows.sm,
              },
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
          >
            <ChevronLeft size={22} color={colors.text.primary} strokeWidth={2.4} />
          </Pressable>

          <View style={styles.titleColumn}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[typography.h3, { color: colors.text.primary, fontWeight: '800' }]}>
                Notifications
              </Text>
              {unreadCount > 0 ? (
                <View
                  style={[
                    styles.unreadBadge,
                    {
                      backgroundColor: isDark ? colors.primarySurface : 'rgba(43, 183, 137, 0.15)',
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <Text style={[styles.unreadBadgeText, { color: colors.primary }]}>
                    {unreadCount} New
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={[typography.caption, { color: colors.text.muted, marginTop: 2 }]}>
              {unreadCount > 0 ? 'Stay on track with updates' : 'You are all caught up! ✨'}
            </Text>
          </View>

          {unreadCount > 0 ? (
            <Pressable
              onPress={markAllAsRead}
              style={({ pressed }) => [
                styles.markAllBtn,
                {
                  backgroundColor: isDark ? colors.background.glassDense : '#FFFFFF',
                  borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
                  ...shadows.sm,
                },
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
            >
              <CheckCheck size={18} color={colors.primary} strokeWidth={2.4} />
            </Pressable>
          ) : (
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.roundHeaderBtn,
                {
                  backgroundColor: isDark ? colors.background.glassDense : '#FFFFFF',
                  borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
                  ...shadows.sm,
                },
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
            >
              <X size={20} color={colors.text.muted} strokeWidth={2.4} />
            </Pressable>
          )}
        </View>

        {/* Filter Pills Row */}
        <View style={[styles.filterRow, { paddingHorizontal: spacing.lg, marginTop: spacing.base }]}>
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'booking', label: 'Bookings' },
              { id: 'workout', label: 'Workouts' },
              { id: 'nutrition', label: 'Nutrition' },
            ] as const
          ).map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => {
                  void Haptics.selectionAsync().catch(() => {});
                  setActiveCategory(tab.id);
                }}
                style={[
                  styles.filterPill,
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
                      color: isActive ? '#FFFFFF' : isDark ? colors.text.muted : colors.text.secondary,
                      fontWeight: isActive ? '700' : '600',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Notifications Scroll List */}
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.lg }]}
          showsVerticalScrollIndicator={false}
        >
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyCircle,
                  {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#F1F5F9',
                    borderColor: isDark ? colors.border.card : 'rgba(0, 0, 0, 0.08)',
                  },
                ]}
              >
                <BellOff size={36} color={colors.text.muted} />
              </View>
              <Text style={[typography.subtitle1, { color: colors.text.primary, fontWeight: '700', marginTop: spacing.base }]}>
                No Notifications Here
              </Text>
              <Text style={[typography.caption, { color: colors.text.muted, textAlign: 'center', marginTop: 4 }]}>
                You have handled all notifications in this category.
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {filteredNotifications.map((item) => (
                <SurfaceCard
                  key={item.id}
                  variant="glass"
                  style={[
                    styles.notifCard,
                    {
                      borderColor: item.isRead
                        ? isDark
                          ? colors.border.card
                          : 'rgba(0, 0, 0, 0.06)'
                        : isDark
                        ? colors.primaryGlow
                        : 'rgba(43, 183, 137, 0.35)',
                    },
                  ]}
                  onPress={() => toggleReadStatus(item.id)}
                >
                  <View style={styles.cardInnerRow}>
                    {/* Left Icon or Avatar */}
                    <View style={styles.iconContainer}>
                      {renderIcon(item.type, item.avatarUrl)}
                      {!item.isRead ? (
                        <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
                      ) : null}
                    </View>

                    {/* Middle Info Column */}
                    <View style={styles.cardContentCol}>
                      <View style={styles.titleRow}>
                        <Text
                          style={[
                            typography.subtitle2,
                            {
                              color: colors.text.primary,
                              fontWeight: item.isRead ? '600' : '800',
                              flex: 1,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text style={[typography.caption, { color: colors.text.muted, fontSize: 11, marginLeft: 8 }]}>
                          {item.timeAgo}
                        </Text>
                      </View>

                      <Text
                        style={[
                          typography.caption,
                          {
                            color: isDark ? colors.text.secondary : colors.text.secondary,
                            lineHeight: 18,
                            marginTop: 3,
                          },
                        ]}
                      >
                        {item.subtitle}
                      </Text>

                      {/* Action Button if available (e.g. View Session) */}
                      {item.actionText ? (
                        <Pressable
                          onPress={() => {
                            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                            onClose();
                            onSelectBooking?.();
                          }}
                          style={({ pressed }) => [
                            styles.actionPill,
                            {
                              backgroundColor: isDark ? colors.primarySurface : 'rgba(43, 183, 137, 0.12)',
                              borderColor: colors.primary,
                            },
                            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                          ]}
                        >
                          <Calendar size={13} color={colors.primary} strokeWidth={2.4} />
                          <Text style={[styles.actionPillText, { color: colors.primary, marginLeft: 5 }]}>
                            {item.actionText}
                          </Text>
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                </SurfaceCard>
              ))}
            </View>
          )}

          {/* Bottom Clear All option if notifications exist */}
          {notifications.length > 0 ? (
            <View style={styles.clearAllBox}>
              <Pressable onPress={clearAllNotifications}>
                <Text style={[typography.caption, { color: colors.text.muted, fontWeight: '600' }]}>
                  Clear All Notifications
                </Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundHeaderBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleColumn: {
    flex: 1,
    marginLeft: 14,
  },
  unreadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: 8,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  markAllBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 4,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  notifCard: {
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  cardInnerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardContentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  clearAllBox: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
