import { useState, useEffect, useCallback } from 'react';
import { WorkoutRoutine } from '@/types';
import { soundCueEngine } from '../services/soundCues';
import { storageService } from '@/services/storage';

export function useWorkoutTimer(routine: WorkoutRoutine, autoStart: boolean = true) {
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [setIndex, setSetIndex] = useState<number>(1);
  const [isRest, setIsRest] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(!autoStart);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const currentExercise = routine.exercises[exerciseIndex];

  // Helper to parse interval seconds from rep string or fallback
  const getWorkDurationSeconds = useCallback((): number => {
    if (!currentExercise) return 40;
    const match = currentExercise.repsOrDuration.match(/(\d+)\s*Sec/i);
    if (match) {
      return parseInt(match[1], 10);
    }
    // Default duration for rep-based sets
    return 40;
  }, [currentExercise]);

  const [intervalTotal, setIntervalTotal] = useState<number>(() => getWorkDurationSeconds());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => getWorkDurationSeconds());
  const [totalElapsed, setTotalElapsed] = useState<number>(0);

  // Sync sound engine
  useEffect(() => {
    soundCueEngine.setMuted(!soundEnabled);
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const startTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  // Interval timer tick
  useEffect(() => {
    if (isPaused || isCompleted) return;

    const interval = setInterval(() => {
      setTotalElapsed((t) => t + 1);

      setSecondsRemaining((prev) => {
        // Countdown ticks at 3, 2, 1
        if (prev <= 4 && prev > 1) {
          soundCueEngine.playCountdownTick();
        }

        if (prev <= 1) {
          // Transition interval
          handleIntervalTransition();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isCompleted, isRest, exerciseIndex, setIndex, currentExercise]);

  const handleIntervalTransition = () => {
    if (!currentExercise) return;

    if (!isRest) {
      // Work finished -> start Rest
      soundCueEngine.playRestStart();
      setIsRest(true);
      const restSec = currentExercise.restSeconds || 20;
      setIntervalTotal(restSec);
      setSecondsRemaining(restSec);
    } else {
      // Rest finished -> next set or next exercise
      if (setIndex < currentExercise.sets) {
        // Next set
        soundCueEngine.playWorkStart();
        setIsRest(false);
        setSetIndex((s) => s + 1);
        const workSec = getWorkDurationSeconds();
        setIntervalTotal(workSec);
        setSecondsRemaining(workSec);
      } else {
        // All sets for this exercise finished -> next exercise
        if (exerciseIndex < routine.exercises.length - 1) {
          soundCueEngine.playWorkStart();
          setIsRest(false);
          setExerciseIndex((e) => e + 1);
          setSetIndex(1);
          const workSec = getWorkDurationSeconds();
          setIntervalTotal(workSec);
          setSecondsRemaining(workSec);
        } else {
          // Entire workout finished!
          soundCueEngine.playVictory();
          setIsCompleted(true);
          // Persist progress to MMKV
          updateActivityProgressInStorage();
        }
      }
    }
  };

  const updateActivityProgressInStorage = () => {
    const existing = storageService.getCachedActivity<any>() ?? {
      date: new Date().toISOString().split('T')[0],
      move: { current: 520, target: 600, unit: 'kcal', percentage: 86 },
      exercise: { current: 35, target: 45, unit: 'mins', percentage: 78 },
      stand: { current: 10, target: 12, unit: 'hours', percentage: 83 },
      steps: 8400,
      activeEnergyBurnedKcal: 520,
      currentHeartRateBpm: 142,
      restingHeartRateBpm: 58,
      streakDays: 4,
    };

    const updated = {
      ...existing,
      move: {
        ...existing.move,
        current: existing.move.current + routine.estimatedCaloriesBurn,
        percentage: Math.round(
          ((existing.move.current + routine.estimatedCaloriesBurn) / existing.move.target) * 100
        ),
      },
      exercise: {
        ...existing.exercise,
        current: existing.exercise.current + routine.durationMinutes,
        percentage: Math.round(
          ((existing.exercise.current + routine.durationMinutes) / existing.exercise.target) * 100
        ),
      },
      activeEnergyBurnedKcal: existing.activeEnergyBurnedKcal + routine.estimatedCaloriesBurn,
    };

    storageService.setCachedActivity(updated);
  };

  const skipForward = useCallback(() => {
    if (exerciseIndex < routine.exercises.length - 1) {
      setExerciseIndex((e) => e + 1);
      setSetIndex(1);
      setIsRest(false);
      const workSec = getWorkDurationSeconds();
      setIntervalTotal(workSec);
      setSecondsRemaining(workSec);
    } else {
      setIsCompleted(true);
    }
  }, [exerciseIndex, routine.exercises.length, getWorkDurationSeconds]);

  const skipBackward = useCallback(() => {
    if (exerciseIndex > 0) {
      setExerciseIndex((e) => e - 1);
      setSetIndex(1);
      setIsRest(false);
      const workSec = getWorkDurationSeconds();
      setIntervalTotal(workSec);
      setSecondsRemaining(workSec);
    }
  }, [exerciseIndex, getWorkDurationSeconds]);

  // Quick Rest Action: Add 15 seconds to catch breath
  const addRestTime = useCallback((seconds: number = 15) => {
    if (!isRest) return;
    setSecondsRemaining((prev) => prev + seconds);
    setIntervalTotal((prev) => prev + seconds);
  }, [isRest]);

  // Quick Rest Action: Skip rest and start work immediately
  const skipRest = useCallback(() => {
    if (!isRest || !currentExercise) return;

    if (setIndex < currentExercise.sets) {
      soundCueEngine.playWorkStart();
      setIsRest(false);
      setSetIndex((s) => s + 1);
      const workSec = getWorkDurationSeconds();
      setIntervalTotal(workSec);
      setSecondsRemaining(workSec);
    } else {
      if (exerciseIndex < routine.exercises.length - 1) {
        soundCueEngine.playWorkStart();
        setIsRest(false);
        setExerciseIndex((e) => e + 1);
        setSetIndex(1);
        const workSec = getWorkDurationSeconds();
        setIntervalTotal(workSec);
        setSecondsRemaining(workSec);
      } else {
        soundCueEngine.playVictory();
        setIsCompleted(true);
        updateActivityProgressInStorage();
      }
    }
  }, [isRest, currentExercise, setIndex, exerciseIndex, routine.exercises.length, getWorkDurationSeconds]);

  // Formatted timer "00:45"
  const formattedTime = `${Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, '0')}:${(secondsRemaining % 60).toString().padStart(2, '0')}`;

  // Current progress fraction (0.0 to 1.0)
  const intervalProgress = intervalTotal > 0 ? (intervalTotal - secondsRemaining) / intervalTotal : 0;

  return {
    exerciseIndex,
    setIndex,
    isRest,
    isPaused,
    isCompleted,
    soundEnabled,
    currentExercise,
    secondsRemaining,
    formattedTime,
    intervalTotal,
    intervalProgress,
    totalElapsed,
    togglePlayPause,
    startTimer,
    pauseTimer,
    toggleSound,
    skipForward,
    skipBackward,
    addRestTime,
    skipRest,
  };
}
