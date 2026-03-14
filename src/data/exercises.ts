import { Exercise } from '../types';

export const exercises: Exercise[] = [
  // Competition Lifts
  {
    id: 'back-squat',
    name: 'Back Squat',
    category: 'compound',
    muscleGroups: ['quads', 'glutes', 'hamstrings', 'core'],
    isCompetitionLift: true
  },
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'compound',
    muscleGroups: ['chest', 'triceps', 'front-deltoids'],
    isCompetitionLift: true
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'compound',
    muscleGroups: ['hamstrings', 'glutes', 'back', 'traps', 'core'],
    isCompetitionLift: true
  },
  // Powerlifting Accessories
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'compound',
    muscleGroups: ['hamstrings', 'glutes', 'lower-back']
  },
  {
    id: 'front-squat',
    name: 'Front Squat',
    category: 'compound',
    muscleGroups: ['quads', 'core', 'upper-back']
  },
  {
    id: 'close-grip-bench',
    name: 'Close-Grip Bench Press',
    category: 'compound',
    muscleGroups: ['triceps', 'chest', 'front-deltoids']
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'compound',
    muscleGroups: ['shoulders', 'triceps', 'upper-chest']
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    category: 'compound',
    muscleGroups: ['lats', 'rhomboids', 'biceps', 'rear-deltoids']
  },
  // Hypertrophy Exercises
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'compound',
    muscleGroups: ['quads', 'glutes', 'hamstrings']
  },
  {
    id: 'dumbbell-flyes',
    name: 'Dumbbell Flyes',
    category: 'isolation',
    muscleGroups: ['chest', 'front-deltoids']
  },
  {
    id: 'cable-rows',
    name: 'Cable Rows',
    category: 'compound',
    muscleGroups: ['lats', 'rhomboids', 'biceps']
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: 'compound',
    muscleGroups: ['lats', 'biceps', 'rear-deltoids']
  },
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    category: 'isolation',
    muscleGroups: ['biceps']
  },
  {
    id: 'tricep-pushdowns',
    name: 'Tricep Pushdowns',
    category: 'isolation',
    muscleGroups: ['triceps']
  },
  {
    id: 'leg-curls',
    name: 'Leg Curls',
    category: 'isolation',
    muscleGroups: ['hamstrings']
  },
  {
    id: 'shoulder-press',
    name: 'Dumbbell Shoulder Press',
    category: 'compound',
    muscleGroups: ['shoulders', 'triceps']
  }
];

export const getExerciseById = (id: string): Exercise | undefined =>
  exercises.find(e => e.id === id);

export const competitionLifts = exercises.filter(e => e.isCompetitionLift);
export const accessoryLifts = exercises.filter(e => !e.isCompetitionLift);
