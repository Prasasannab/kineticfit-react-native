/**
 * KineticFit - User & Authentication Domain Types
 */

export interface UserPreferences {
  timezone: string; // e.g. "America/Los_Angeles"
  measurementUnit: 'metric' | 'imperial';
  notificationsEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  audioCuesEnabled: boolean;
  appleHealthKitSync: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  memberSinceUtc: string;
  streakDays: number;
  totalWorkoutsCompleted: number;
  totalCaloriesBurned: number;
  preferences: UserPreferences;
}
