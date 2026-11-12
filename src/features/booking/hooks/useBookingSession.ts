import { useState, useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { BookingSession, BookingSlot, PaymentMethod, Trainer } from '@/types';
import { appStorage, STORAGE_KEYS } from '@/services/storage';
import {
  lockSlotOptimistically,
  markSlotAsBooked,
  unlockSlot,
} from '../services/MockSlotsData';

export interface UseBookingSessionProps {
  trainer: Trainer;
  slot: BookingSlot;
  onSuccess?: (confirmedBooking: BookingSession) => void;
  onExpire?: () => void;
}

export function useBookingSession({
  trainer,
  slot,
  onSuccess,
  onExpire,
}: UseBookingSessionProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 minutes
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('apple_pay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionIdRef = useRef<string>(`session_${Date.now()}`);
  const hasLockedRef = useRef<boolean>(false);

  // Optimistic 5-minute slot locking
  useEffect(() => {
    if (!hasLockedRef.current) {
      lockSlotOptimistically(slot.id, sessionIdRef.current);
      hasLockedRef.current = true;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          unlockSlot(slot.id);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      // If modal unmounts without confirmation, release optimistic lock
      if (!confirmedBooking) {
        unlockSlot(slot.id);
      }
    };
  }, [slot.id, confirmedBooking, onExpire]);

  // Formatted timer "04:58"
  const formattedCountdown = `${Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, '0')}:${(secondsRemaining % 60).toString().padStart(2, '0')}`;

  const isLowTime = secondsRemaining <= 60;

  // 1-Tap Apple Pay mock action
  const confirmPayment = useCallback(async () => {
    if (isProcessing || secondsRemaining <= 0) return;

    try {
      setIsProcessing(true);
      setError(null);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

      // Simulate native payment token authorization (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const newBooking: BookingSession = {
        id: `bkg_${Date.now()}`,
        slotId: slot.id,
        trainerId: trainer.id,
        trainerName: trainer.name,
        trainerAvatar: trainer.avatar,
        userId: 'usr_pasindu_01',
        startTimeUtc: slot.startTimeUtc,
        endTimeUtc: slot.endTimeUtc,
        durationMinutes: slot.durationMinutes,
        status: 'confirmed',
        amountUsd: slot.price,
        paymentMethod,
        createdAtUtc: new Date().toISOString(),
        confirmedAtUtc: new Date().toISOString(),
        meetingLink: `https://meet.kineticfit.app/${trainer.id}-${Date.now().toString(36)}`,
      };

      // Mark slot booked in MMKV engine
      markSlotAsBooked(slot.id);

      // Append to booking history in MMKV
      const existing = appStorage.getObject<BookingSession[]>(STORAGE_KEYS.BOOKING_HISTORY) ?? [];
      appStorage.setObject(STORAGE_KEYS.BOOKING_HISTORY, [newBooking, ...existing]);

      // Success tactile feedback
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      setConfirmedBooking(newBooking);
      onSuccess?.(newBooking);
    } catch (err) {
      setError('Payment authorization timed out. Please try again.');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, secondsRemaining, slot, trainer, paymentMethod, onSuccess]);

  return {
    secondsRemaining,
    formattedCountdown,
    isLowTime,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    confirmedBooking,
    error,
    confirmPayment,
  };
}
