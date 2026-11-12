/**
 * KineticFit - Booking Engine Domain Types
 *
 * Implements strict types for timezone-normalized calendar slots,
 * optimistic UI lock states (5-min reservation during checkout),
 * and checkout session models.
 */

export type SlotStatus = 'available' | 'locked' | 'reserved' | 'booked';

export type TimeOfDayFilter = 'all' | 'morning' | 'afternoon' | 'evening';

export type PaymentMethod = 'apple_pay' | 'credit_card' | 'google_pay';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface BookingSlot {
  id: string;
  trainerId: string;
  startTimeUtc: string; // ISO 8601 UTC e.g. "2026-11-12T14:30:00.000Z"
  endTimeUtc: string; // ISO 8601 UTC e.g. "2026-11-12T15:15:00.000Z"
  durationMinutes: number; // e.g. 45
  price: number; // In USD, e.g. 65
  status: SlotStatus;
  /** Optimistic UI lock: session ID holding this lock temporarily during checkout */
  lockedBySessionId?: string | null;
  /** ISO timestamp when lock was initiated (expires after 300 seconds / 5 mins) */
  lockedAtUtc?: string | null;
}

export interface BookingSession {
  id: string;
  slotId: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  userId: string;
  startTimeUtc: string;
  endTimeUtc: string;
  durationMinutes: number;
  status: BookingStatus;
  amountUsd: number;
  paymentMethod: PaymentMethod;
  createdAtUtc: string;
  confirmedAtUtc?: string | null;
  specialNotes?: string;
  meetingLink?: string; // e.g. Video call link for online session
}

export interface CheckoutSessionState {
  trainerId: string;
  slot: BookingSlot;
  expiresAtTimestamp: number; // Unix epoch ms
  secondsRemaining: number;
  paymentMethod: PaymentMethod;
  isProcessing: boolean;
  error?: string | null;
}
