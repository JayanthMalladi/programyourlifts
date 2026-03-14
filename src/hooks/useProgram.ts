import { useState, useEffect } from 'react';
import { UserProfile, Workout, WorkoutExercise, WorkoutSet } from '../types';
import { generateWeeklySchedule, calculateTrainingWeight, getPhaseRepRange, getPhaseSetCount, progressiveOverload } from '../utils/dupEngine';
import { programTemplates } from '../data/programs';

const PROFILE_KEY = 'pyl_profile';
const PROGRAM_KEY = 'pyl_program';

export function useProgram() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [program, setProgram] = useState<Workout[]>(() => {
    try {
      const stored = localStorage.getItem(PROGRAM_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    if (program.length > 0) {
      localStorage.setItem(PROGRAM_KEY, JSON.stringify(program));
    }
  }, [program]);

  const generateProgram = (userProfile: UserProfile) => {
    setProfile(userProfile);
    const weeklyPhases = generateWeeklySchedule(userProfile.goal, userProfile.trainingDaysPerWeek);
    const template = programTemplates[userProfile.goal];
    const generatedWorkouts: Workout[] = [];
    const totalWeeks = 4;

    for (let week = 1; week <= totalWeeks; week++) {
      weeklyPhases.forEach((phase, dayIndex) => {
        const dayTemplate = template[dayIndex % template.length];
        const exercises: WorkoutExercise[] = [];

        // Main lifts
        dayTemplate.mainLifts.forEach(exerciseId => {
          const baseWeight = userProfile.oneRepMaxes[exerciseId] || 135;
          const trainingWeight = calculateTrainingWeight(baseWeight, phase);
          const progressedWeight = progressiveOverload(trainingWeight, week, phase);
          const repRange = getPhaseRepRange(phase);
          const targetReps = Math.round((repRange.min + repRange.max) / 2);
          const targetSets = getPhaseSetCount(phase);

          const sets: WorkoutSet[] = Array.from({ length: targetSets }, () => ({
            reps: targetReps,
            weight: progressedWeight,
            completed: false
          }));

          exercises.push({
            exerciseId,
            sets,
            targetSets,
            targetReps,
            targetWeight: progressedWeight,
            phase
          });
        });

        // Accessories (hypertrophy phase treatment for accessories)
        dayTemplate.accessories.slice(0, 3).forEach(exerciseId => {
          const baseWeight = userProfile.oneRepMaxes[exerciseId] || 95;
          const accessoryPhase = userProfile.goal === 'hypertrophy' ? phase : 'hypertrophy';
          const trainingWeight = calculateTrainingWeight(baseWeight, accessoryPhase);
          const repRange = getPhaseRepRange(accessoryPhase);
          const targetReps = Math.round((repRange.min + repRange.max) / 2);
          const targetSets = 3;

          const sets: WorkoutSet[] = Array.from({ length: targetSets }, () => ({
            reps: targetReps,
            weight: trainingWeight,
            completed: false
          }));

          exercises.push({
            exerciseId,
            sets,
            targetSets,
            targetReps,
            targetWeight: trainingWeight,
            phase: accessoryPhase
          });
        });

        const workoutDate = new Date();
        workoutDate.setDate(workoutDate.getDate() + (week - 1) * 7 + dayIndex);

        generatedWorkouts.push({
          id: `week${week}-day${dayIndex + 1}`,
          date: workoutDate.toISOString(),
          dayOfWeek: dayIndex,
          weekNumber: week,
          phase,
          exercises,
          completed: false
        });
      });
    }

    setProgram(generatedWorkouts);
    return generatedWorkouts;
  };

  const getTodaysWorkout = (): Workout | null => {
    if (!program.length) return null;
    const today = new Date().toISOString().split('T')[0];
    return program.find(w => w.date.split('T')[0] === today && !w.completed) || null;
  };

  const getCurrentWeekWorkouts = (): Workout[] => {
    if (!program.length) return [];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return program.filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate >= weekStart && workoutDate <= weekEnd;
    });
  };

  return {
    profile,
    program,
    generateProgram,
    getTodaysWorkout,
    getCurrentWeekWorkouts
  };
}
