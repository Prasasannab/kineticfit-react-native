import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Lock } from 'lucide-react-native';
import { BookingSlot, TimeOfDayFilter } from '@/types';
import { useTheme } from '@/theme';
import { filterSlotsByTimeOfDay, formatLocalTime } from '@/features/booking/utils/timezone';

export interface SlotGridProps {
  slots: readonly BookingSlot[];
  selectedSlotId?: string | null;
  onSelectSlot: (slot: BookingSlot) => void;
  style?: StyleProp<ViewStyle>;
}

export function SlotGrid({
  slots,
  selectedSlotId,
  onSelectSlot,
  style,
}: SlotGridProps) {
  const { colors, spacing, radius, typography } = useTheme();
  const [filter, setFilter] = useState<TimeOfDayFilter>('all');

  const filteredSlots = filterSlotsByTimeOfDay(slots, filter);

  const filterButtons: { id: TimeOfDayFilter; label: string }[] = [
    { id: 'all', label: 'All Slots' },
    { id: 'morning', label: 'Morning' },
    { id: 'afternoon', label: 'Afternoon' },
    { id: 'evening', label: 'Evening' },
  ];

  const handleSlotPress = (slot: BookingSlot) => {
    if (slot.status === 'booked' || slot.status === 'locked' || slot.status === 'reserved') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      return;
    }
    void Haptics.selectionAsync().catch(() => {});
    onSelectSlot(slot);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Session Filters */}
      <View style={[styles.filterRow, { marginBottom: spacing.md }]}>
        {filterButtons.map((btn) => {
          const isActive = filter === btn.id;
          return (
            <Pressable
              key={btn.id}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setFilter(btn.id);
              }}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive
                    ? colors.background.highest
                    : colors.background.elevated,
                  borderColor: isActive ? colors.primary : colors.border.subtle,
                  borderRadius: radius.full,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs + 2,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                style={[
                  typography.caption,
                  {
                    color: isActive ? colors.primary : colors.text.muted,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {btn.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Grid of Slots */}
      {filteredSlots.length === 0 ? (
        <View style={[styles.emptyBox, { padding: spacing.xl }]}>
          <Text style={[typography.bodyMedium, { color: colors.text.muted }]}>
            No session slots available for this period.
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {filteredSlots.map((slot) => {
            const isSelected = slot.id === selectedSlotId;
            const isBooked = slot.status === 'booked';
            const isReserved = slot.status === 'reserved';
            const isLocked = slot.status === 'locked';
            const isDisabled = isBooked || isReserved || isLocked;

            const timeLabel = formatLocalTime(slot.startTimeUtc);

            let bgColor: string = colors.background.elevated;
            let borderColor: string = colors.border.default;
            let textColor: string = colors.text.primary;

            if (isSelected) {
              bgColor = colors.primary;
              borderColor = colors.primary;
              textColor = '#FFFFFF';
            } else if (isLocked) {
              bgColor = 'rgba(255, 107, 0, 0.12)';
              borderColor = 'rgba(255, 107, 0, 0.3)';
              textColor = colors.primary;
            } else if (isBooked || isReserved) {
              bgColor = colors.background.sunken;
              borderColor = colors.border.subtle;
              textColor = colors.text.subtle;
            }

            return (
              <Pressable
                key={slot.id}
                onPress={() => handleSlotPress(slot)}
                disabled={isDisabled}
                style={({ pressed }) => [
                  styles.slotCard,
                  {
                    backgroundColor: bgColor,
                    borderColor,
                    borderRadius: radius.lg,
                  },
                  pressed && !isDisabled && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${timeLabel}, ${slot.status}`}
                accessibilityState={{
                  selected: isSelected,
                  disabled: isDisabled,
                }}
              >
                <Text
                  style={[
                    typography.subtitle2,
                    {
                      color: textColor,
                      fontWeight: isSelected ? '700' : '600',
                      textDecorationLine: isBooked ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {timeLabel}
                </Text>

                <View style={styles.slotFooter}>
                  {isLocked ? (
                    <View style={styles.lockedRow}>
                      <Lock size={11} color={colors.primary} />
                      <Text
                        style={[
                          typography.caption,
                          { color: colors.primary, fontSize: 10, marginLeft: 2 },
                        ]}
                      >
                        Holding
                      </Text>
                    </View>
                  ) : isBooked ? (
                    <Text
                      style={[
                        typography.caption,
                        { color: colors.text.subtle, fontSize: 10 },
                      ]}
                    >
                      Booked
                    </Text>
                  ) : isReserved ? (
                    <Text
                      style={[
                        typography.caption,
                        { color: colors.text.subtle, fontSize: 10 },
                      ]}
                    >
                      Reserved
                    </Text>
                  ) : (
                    <Text
                      style={[
                        typography.caption,
                        {
                          color: isSelected ? '#FFFFFF' : colors.text.muted,
                          fontSize: 10,
                        },
                      ]}
                    >
                      {slot.durationMinutes}m • ${slot.price}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    borderWidth: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotCard: {
    width: '31%', // 3 columns with gap
    minHeight: 58,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  slotFooter: {
    marginTop: 2,
    alignItems: 'center',
  },
  lockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
