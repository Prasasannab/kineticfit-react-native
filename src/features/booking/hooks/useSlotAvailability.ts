import { useState, useEffect, useCallback } from 'react';
import { BookingSlot } from '@/types';
import {
  generateTrainerSlotsForDay,
  lockSlotOptimistically,
  unlockSlot,
} from '../services/MockSlotsData';

export function useSlotAvailability(trainerId: string, selectedDate: string) {
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load and refresh slots for this trainer and date
  const refreshSlots = useCallback(() => {
    setIsLoading(true);
    const daySlots = generateTrainerSlotsForDay(trainerId, selectedDate);
    setSlots(daySlots);
    setIsLoading(false);
  }, [trainerId, selectedDate]);

  useEffect(() => {
    refreshSlots();
    setSelectedSlot(null);
  }, [refreshSlots]);

  const selectSlot = useCallback((slot: BookingSlot) => {
    setSelectedSlot(slot);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSlot(null);
  }, []);

  const lockSelectedSlot = useCallback(
    (sessionId: string): boolean => {
      if (!selectedSlot) return false;
      const success = lockSlotOptimistically(selectedSlot.id, sessionId);
      if (success) {
        // Refresh local slots to reflect lock status
        refreshSlots();
      }
      return success;
    },
    [selectedSlot, refreshSlots]
  );

  const releaseSlotLock = useCallback(
    (slotId: string) => {
      unlockSlot(slotId);
      refreshSlots();
    },
    [refreshSlots]
  );

  return {
    slots,
    selectedSlot,
    isLoading,
    selectSlot,
    clearSelection,
    lockSelectedSlot,
    releaseSlotLock,
    refreshSlots,
  };
}
