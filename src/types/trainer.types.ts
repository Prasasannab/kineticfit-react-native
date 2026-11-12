/**
 * KineticFit - Trainer Domain Types
 *
 * Strict TypeScript types for trainer profiles, specialties, and ratings.
 */

export type TrainerSpecialty =
  | 'HIIT'
  | 'Functional Strength'
  | 'CrossFit'
  | 'Mobility & Recovery'
  | 'Bodybuilding'
  | 'Pilates'
  | 'Endurance & Running'
  | 'Sports Performance';

export interface TrainerReview {
  id: string;
  trainerId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1.0 - 5.0
  comment: string;
  createdAt: string; // ISO 8601 UTC
}

export interface Trainer {
  id: string;
  name: string;
  title: string; // e.g. "CSCS, Elite Performance Coach"
  avatar: string;
  bio: string;
  rating: number; // e.g. 4.98
  reviewCount: number; // e.g. 124
  hourlyRate: number; // USD e.g. 65
  specialties: readonly TrainerSpecialty[];
  certifications: readonly string[]; // e.g. ["NSCA CSCS", "NASM CPT", "Precision Nutrition L1"]
  yearsExperience: number;
  isOnlineAvailable: boolean;
  isInPersonAvailable: boolean;
  location?: string; // e.g. "San Francisco, CA"
  nextAvailableText: string; // e.g. "Today, 3:30 PM (45m)"
  featured?: boolean;
}

export interface TrainerFilterOptions {
  specialty?: TrainerSpecialty;
  minRating?: number;
  maxHourlyRate?: number;
  deliveryType?: 'all' | 'online' | 'in_person';
  searchQuery?: string;
}
