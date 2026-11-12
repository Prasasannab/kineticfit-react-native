/**
 * KineticFit - Workout & Exercise Domain Types
 *
 * Models for workout routines, structured exercise lists,
 * audio/haptic cue timers, and progress logs.
 */

export type WorkoutDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type WorkoutCategory =
  | 'HIIT'
  | 'Strength'
  | 'Cardio'
  | 'Mobility'
  | 'Recovery'
  | 'Core';

export interface Exercise {
  id: string;
  name: string;
  targetMuscleGroup: string;
  sets: number;
  repsOrDuration: string; // e.g. "12 Reps" or "45 Sec"
  restSeconds: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  instructions: readonly string[];
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  category: WorkoutCategory;
  difficulty: WorkoutDifficulty;
  durationMinutes: number;
  estimatedCaloriesBurn: number;
  instructorName: string;
  instructorAvatar: string;
  coverImageUrl: string;
  exercises: readonly Exercise[];
}

export interface ActiveWorkoutState {
  routineId: string;
  currentExerciseIndex: number;
  currentSetIndex: number;
  elapsedSeconds: number;
  timerSecondsRemaining: number;
  isPaused: boolean;
  isRestPeriod: boolean;
}
