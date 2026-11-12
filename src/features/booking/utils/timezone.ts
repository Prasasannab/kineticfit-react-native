import { BookingSlot, TimeOfDayFilter } from '@/types';

/**
 * KineticFit - Timezone Normalization & Calendar Utilities
 *
 * Ensures all trainer availability is stored in strict ISO 8601 UTC,
 * and normalized seamlessly to the user's local device timezone.
 */

export interface CalendarDayItem {
  dateString: string; // "YYYY-MM-DD" in local time
  dayOfWeek: string; // "Mon", "Tue"
  dayNumber: string; // "11", "12"
  monthName: string; // "Nov"
  fullFormatted: string; // "Tuesday, Nov 11"
  isToday: boolean;
  dateObj: Date;
}

export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Returns formatted start and end time in user's timezone (e.g. "3:30 PM - 4:15 PM")
 */
export function formatSlotTimeRange(
  startTimeUtc: string,
  endTimeUtc: string,
  timezone: string = getUserTimezone()
): string {
  const start = new Date(startTimeUtc);
  const end = new Date(endTimeUtc);

  const startFormatted = start.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });

  const endFormatted = end.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });

  return `${startFormatted} – ${endFormatted}`;
}

/**
 * Formats a single UTC timestamp to a local readable time (e.g. "09:00 AM")
 */
export function formatLocalTime(
  utcTimestamp: string,
  timezone: string = getUserTimezone()
): string {
  const date = new Date(utcTimestamp);
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });
}

/**
 * Generates an array of calendar days for the horizontal strip (e.g. 14 days)
 */
export function getCalendarDays(daysCount = 14): CalendarDayItem[] {
  const days: CalendarDayItem[] = [];
  const now = new Date();

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = String(d.getDate());
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const fullFormatted = d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

    days.push({
      dateString,
      dayOfWeek,
      dayNumber,
      monthName,
      fullFormatted,
      isToday: i === 0,
      dateObj: d,
    });
  }

  return days;
}

/**
 * Filters slots by time of day in user's local timezone
 */
export function filterSlotsByTimeOfDay(
  slots: readonly BookingSlot[],
  filter: TimeOfDayFilter,
  timezone: string = getUserTimezone()
): BookingSlot[] {
  if (filter === 'all') {
    return [...slots];
  }

  return slots.filter((slot) => {
    const date = new Date(slot.startTimeUtc);
    // Get local hour (0-23) in targeted timezone
    const hourString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: timezone,
    });
    const hour = parseInt(hourString, 10);

    if (filter === 'morning') {
      return hour < 12;
    }
    if (filter === 'afternoon') {
      return hour >= 12 && hour < 17;
    }
    if (filter === 'evening') {
      return hour >= 17;
    }
    return true;
  });
}
