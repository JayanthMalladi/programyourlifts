import { useState, useEffect } from 'react';
import { Workout, ProgressEntry, WorkoutExercise } from '../types';
import { calculate1RM } from '../utils/dupEngine';

const WORKOUTS_KEY = 'pyl_workouts';
const PROGRESS_KEY = 'pyl_progress';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    try {
      const stored = localStorage.getItem(WORKOUTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressEntries));
  }, [progressEntries]);

  const saveWorkout = (workout: Workout) => {
    setWorkouts(prev => {
      const existing = prev.findIndex(w => w.id === workout.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = workout;
        return updated;
      }
      return [...prev, workout];
    });

    // Extract progress entries from completed sets
    if (workout.completed) {
      const newEntries: ProgressEntry[] = [];
      workout.exercises.forEach((ex: WorkoutExercise) => {
        ex.sets.forEach(set => {
          if (set.completed && set.reps > 0 && set.weight > 0) {
            newEntries.push({
              date: workout.date,
              exerciseId: ex.exerciseId,
              estimatedOneRepMax: calculate1RM(set.weight, set.reps),
              weight: set.weight,
              reps: set.reps
            });
          }
        });
      });
      if (newEntries.length > 0) {
        setProgressEntries(prev => [...prev, ...newEntries]);
      }
    }
  };

  const getWorkoutById = (id: string): Workout | undefined =>
    workouts.find(w => w.id === id);

  const getWorkoutsForWeek = (weekNumber: number): Workout[] =>
    workouts.filter(w => w.weekNumber === weekNumber);

  const getPersonalRecords = (): Record<string, ProgressEntry> => {
    const prs: Record<string, ProgressEntry> = {};
    progressEntries.forEach(entry => {
      if (!prs[entry.exerciseId] || entry.estimatedOneRepMax > prs[entry.exerciseId].estimatedOneRepMax) {
        prs[entry.exerciseId] = entry;
      }
    });
    return prs;
  };

  const getProgressForExercise = (exerciseId: string): ProgressEntry[] =>
    progressEntries
      .filter(e => e.exerciseId === exerciseId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getTrainingStreak = (): number => {
    const completedDates = [...new Set(
      workouts
        .filter(w => w.completed)
        .map(w => w.date.split('T')[0])
    )].sort().reverse();

    if (completedDates.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString().split('T')[0];
    })();

    // Start streak from today if trained today, otherwise allow streak from yesterday
    let checkDate = completedDates[0] === today ? today : yesterday;
    let streak = 0;

    for (const date of completedDates) {
      if (date === checkDate) {
        streak++;
        const d = new Date(checkDate);
        d.setDate(d.getDate() - 1);
        checkDate = d.toISOString().split('T')[0];
      } else {
        break;
      }
    }
    return streak;
  };

  const getWeeklyVolume = (): Array<{ week: string; volume: number }> => {
    const volumeByWeek: Record<string, number> = {};
    workouts.filter(w => w.completed).forEach(workout => {
      const weekKey = `W${workout.weekNumber}`;
      let volume = 0;
      workout.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          if (set.completed) {
            volume += set.weight * set.reps;
          }
        });
      });
      volumeByWeek[weekKey] = (volumeByWeek[weekKey] || 0) + volume;
    });
    return Object.entries(volumeByWeek).map(([week, volume]) => ({ week, volume }));
  };

  return {
    workouts,
    progressEntries,
    saveWorkout,
    getWorkoutById,
    getWorkoutsForWeek,
    getPersonalRecords,
    getProgressForExercise,
    getTrainingStreak,
    getWeeklyVolume
  };
}
