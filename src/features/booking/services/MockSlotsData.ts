import { BookingSlot, SlotStatus } from '@/types';
import { appStorage } from '@/services/storage';

const STORAGE_LOCKS_PREFIX = 'kf_slot_lock_';
const STORAGE_BOOKED_PREFIX = 'kf_slot_booked_';

/**
 * 5 Minutes in milliseconds for optimistic checkout lock
 */
export const LOCK_EXPIRATION_MS = 5 * 60 * 1000;

interface PersistedLock {
  sessionId: string;
  lockedAtMs: number;
}

/**
 * Generates slots dynamically based on date and trainer
 */
export function generateTrainerSlotsForDay(
  trainerId: string,
  dateString: string // "YYYY-MM-DD"
): BookingSlot[] {
  // Base daily template offsets in minutes from midnight local time
  const slotTemplates = [
    { hour: 8, minute: 30, duration: 45, price: 65, defaultStatus: 'available' as SlotStatus },
    { hour: 10, minute: 0, duration: 45, price: 65, defaultStatus: 'available' as SlotStatus },
    { hour: 11, minute: 30, duration: 45, price: 65, defaultStatus: 'booked' as SlotStatus },
    { hour: 13, minute: 30, duration: 45, price: 65, defaultStatus: 'available' as SlotStatus },
    { hour: 15, minute: 0, duration: 45, price: 65, defaultStatus: 'reserved' as SlotStatus },
    { hour: 16, minute: 30, duration: 45, price: 65, defaultStatus: 'available' as SlotStatus },
    { hour: 18, minute: 0, duration: 45, price: 75, defaultStatus: 'available' as SlotStatus },
    { hour: 19, minute: 15, duration: 45, price: 75, defaultStatus: 'available' as SlotStatus },
  ];

  const [yearStr, monthStr, dayStr] = dateString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  return slotTemplates.map((template, idx) => {
    const slotId = `slot_${trainerId}_${dateString}_${idx}`;
    const startLocal = new Date(year, month, day, template.hour, template.minute, 0);
    const endLocal = new Date(startLocal.getTime() + template.duration * 60 * 1000);

    const startTimeUtc = startLocal.toISOString();
    const endTimeUtc = endLocal.toISOString();

    // Check if slot was booked permanently in MMKV
    const isBooked = appStorage.getBoolean(`${STORAGE_BOOKED_PREFIX}${slotId}`);
    if (isBooked) {
      return {
        id: slotId,
        trainerId,
        startTimeUtc,
        endTimeUtc,
        durationMinutes: template.duration,
        price: template.price,
        status: 'booked',
      };
    }

    // Check if slot has an active optimistic lock in MMKV
    const lockRaw = appStorage.getObject<PersistedLock>(`${STORAGE_LOCKS_PREFIX}${slotId}`);
    if (lockRaw) {
      const now = Date.now();
      const elapsed = now - lockRaw.lockedAtMs;
      if (elapsed < LOCK_EXPIRATION_MS) {
        return {
          id: slotId,
          trainerId,
          startTimeUtc,
          endTimeUtc,
          durationMinutes: template.duration,
          price: template.price,
          status: 'locked',
          lockedBySessionId: lockRaw.sessionId,
          lockedAtUtc: new Date(lockRaw.lockedAtMs).toISOString(),
        };
      } else {
        // Expired lock: remove stale lock from storage
        appStorage.delete(`${STORAGE_LOCKS_PREFIX}${slotId}`);
      }
    }

    return {
      id: slotId,
      trainerId,
      startTimeUtc,
      endTimeUtc,
      durationMinutes: template.duration,
      price: template.price,
      status: template.defaultStatus,
    };
  });
}

/**
 * Optimistically locks a slot for 5 minutes during checkout
 */
export function lockSlotOptimistically(slotId: string, sessionId: string): boolean {
  const lockData: PersistedLock = {
    sessionId,
    lockedAtMs: Date.now(),
  };
  appStorage.setObject(`${STORAGE_LOCKS_PREFIX}${slotId}`, lockData);
  return true;
}

/**
 * Releases optimistic lock
 */
export function unlockSlot(slotId: string): void {
  appStorage.delete(`${STORAGE_LOCKS_PREFIX}${slotId}`);
}

/**
 * Marks slot as booked permanently upon payment confirmation
 */
export function markSlotAsBooked(slotId: string): void {
  unlockSlot(slotId);
  appStorage.setBoolean(`${STORAGE_BOOKED_PREFIX}${slotId}`, true);
}
