import React, { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { CalendarDayItem, getCalendarDays } from '@/features/booking/utils/timezone';

export interface HorizontalCalendarStripProps {
  selectedDate: string; // "YYYY-MM-DD"
  onSelectDate: (dateString: string) => void;
  daysCount?: number;
  style?: StyleProp<ViewStyle>;
}

export function HorizontalCalendarStrip({
  selectedDate,
  onSelectDate,
  daysCount = 14,
  style,
}: HorizontalCalendarStripProps) {
  const { colors, spacing, radius, typography } = useTheme();

  const days = useMemo(() => getCalendarDays(daysCount), [daysCount]);

  const activeMonthName = useMemo(() => {
    const selectedItem = days.find((d) => d.dateString === selectedDate) ?? days[0];
    const month = selectedItem.dateObj.toLocaleDateString('en-US', { month: 'long' });
    const year = selectedItem.dateObj.getFullYear();
    return `${month} ${year}`;
  }, [days, selectedDate]);

  const handleSelectDay = (dateString: string) => {
    void Haptics.selectionAsync().catch(() => {});
    onSelectDate(dateString);
  };

  const renderItem = ({ item }: { item: CalendarDayItem }) => {
    const isSelected = item.dateString === selectedDate;

    return (
      <Pressable
        onPress={() => handleSelectDay(item.dateString)}
        style={({ pressed }) => [
          styles.dayCard,
          {
            backgroundColor: isSelected
              ? colors.primary
              : colors.background.elevated,
            borderColor: isSelected ? colors.primary : colors.border.default,
            borderRadius: radius.xl,
            marginRight: spacing.sm,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.md,
          },
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${item.fullFormatted}${item.isToday ? ' (Today)' : ''}`}
        accessibilityState={{ selected: isSelected }}
      >
        <Text
          style={[
            typography.caption,
            {
              color: isSelected ? '#FFFFFF' : colors.text.muted,
              fontWeight: '600',
              textTransform: 'uppercase',
            },
          ]}
        >
          {item.dayOfWeek}
        </Text>

        <Text
          style={[
            typography.h2,
            {
              color: isSelected ? '#FFFFFF' : colors.text.primary,
              marginVertical: 4,
              fontWeight: '800',
            },
          ]}
        >
          {item.dayNumber}
        </Text>

        {item.isToday ? (
          <View
            style={[
              styles.todayDot,
              {
                backgroundColor: isSelected ? '#FFFFFF' : colors.secondary,
              },
            ]}
          />
        ) : (
          <View style={styles.emptyDotPlaceholder} />
        )}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Month & Timezone Indicator */}
      <View style={styles.headerRow}>
        <Text style={[typography.subtitle1, { color: colors.text.primary }]}>
          {activeMonthName}
        </Text>
        <Text style={[typography.caption, { color: colors.text.muted }]}>
          Local Time
        </Text>
      </View>

      <FlatList
        horizontal
        data={days}
        keyExtractor={(item) => item.dateString}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.base }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  listContent: {
    paddingVertical: 4,
  },
  dayCard: {
    width: 64,
    height: 94,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  emptyDotPlaceholder: {
    width: 6,
    height: 6,
    marginTop: 2,
  },
});
