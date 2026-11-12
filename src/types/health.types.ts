/**
 * KineticFit - Health & Activity Tracking Types
 *
 * Models for Apple HealthKit & Google Health Connect metrics,
 * animated Activity Rings (Move, Exercise, Stand), and real-time heart rate.
 */

export interface MetricProgress {
  current: number;
  target: number;
  unit: string; // 'kcal' | 'mins' | 'hrs'
  percentage: number; // 0 - 100+
}

export interface DailyActivityProgress {
  date: string; // YYYY-MM-DD
  move: MetricProgress; // Calories burned
  exercise: MetricProgress; // Exercise minutes
  stand: MetricProgress; // Stand hours
  steps: number;
  activeEnergyBurnedKcal: number;
  currentHeartRateBpm: number;
  restingHeartRateBpm: number;
  streakDays: number;
}

export interface ActivityRingData {
  ringId: 'move' | 'exercise' | 'stand';
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  backgroundColor: string;
  progress: number; // Normalized 0.0 to 1.0 (can exceed 1.0 for overachieve)
}

export interface HeartRateDataPoint {
  timestamp: string; // ISO 8601 UTC
  bpm: number;
}
