export type TrainingGoal = 'powerlifting' | 'hypertrophy' | 'both';

export type DUPPhase = 'strength' | 'power' | 'hypertrophy';

export interface Exercise {
  id: string;
  name: string;
  category: 'compound' | 'isolation';
  muscleGroups: string[];
  isCompetitionLift?: boolean;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  rpe?: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: WorkoutSet[];
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  phase: DUPPhase;
}

export interface Workout {
  id: string;
  date: string;
  dayOfWeek: number;
  weekNumber: number;
  phase: DUPPhase;
  exercises: WorkoutExercise[];
  completed: boolean;
  notes?: string;
}

export interface UserProfile {
  goal: TrainingGoal;
  trainingDaysPerWeek: number;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  oneRepMaxes: Record<string, number>;
}

export interface ProgressEntry {
  date: string;
  exerciseId: string;
  estimatedOneRepMax: number;
  weight: number;
  reps: number;
}
