import { DUPPhase, TrainingGoal } from '../types';

export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

export function calculateTrainingWeight(oneRepMax: number, phase: DUPPhase): number {
  const percentages: Record<DUPPhase, number> = {
    strength: 0.875,   // 85-90% average
    power: 0.775,      // 75-80% average
    hypertrophy: 0.675 // 65-70% average
  };
  return Math.round((oneRepMax * percentages[phase]) / 2.5) * 2.5;
}

export function getPhaseRepRange(phase: DUPPhase): { min: number; max: number } {
  const ranges: Record<DUPPhase, { min: number; max: number }> = {
    strength: { min: 3, max: 5 },
    power: { min: 5, max: 8 },
    hypertrophy: { min: 8, max: 15 }
  };
  return ranges[phase];
}

export function getPhaseSetCount(phase: DUPPhase): number {
  const sets: Record<DUPPhase, number> = {
    strength: 5,
    power: 4,
    hypertrophy: 3
  };
  return sets[phase];
}

export function generateWeeklySchedule(goal: TrainingGoal, daysPerWeek: number): DUPPhase[] {
  const schedules: Record<TrainingGoal, Record<number, DUPPhase[]>> = {
    powerlifting: {
      3: ['strength', 'power', 'strength'],
      4: ['strength', 'power', 'strength', 'power'],
      5: ['strength', 'power', 'strength', 'power', 'strength']
    },
    hypertrophy: {
      3: ['hypertrophy', 'hypertrophy', 'hypertrophy'],
      4: ['hypertrophy', 'power', 'hypertrophy', 'hypertrophy'],
      5: ['hypertrophy', 'power', 'hypertrophy', 'hypertrophy', 'power']
    },
    both: {
      3: ['strength', 'hypertrophy', 'power'],
      4: ['strength', 'hypertrophy', 'power', 'hypertrophy'],
      5: ['strength', 'hypertrophy', 'power', 'hypertrophy', 'strength']
    }
  };
  return schedules[goal][daysPerWeek] || schedules[goal][3];
}

export function progressiveOverload(currentWeight: number, weekNumber: number, phase: DUPPhase): number {
  const increments: Record<DUPPhase, number> = {
    strength: 5,
    power: 2.5,
    hypertrophy: 2.5
  };
  const increment = increments[phase];
  const addedWeight = (weekNumber - 1) * increment;
  return Math.round((currentWeight + addedWeight) / 2.5) * 2.5;
}

export function getPhaseColor(phase: DUPPhase): string {
  const colors: Record<DUPPhase, string> = {
    strength: 'red',
    power: 'orange',
    hypertrophy: 'blue'
  };
  return colors[phase];
}

export function getPhaseBadgeClasses(phase: DUPPhase): string {
  const classes: Record<DUPPhase, string> = {
    strength: 'bg-red-900/50 text-red-300 border border-red-700',
    power: 'bg-orange-900/50 text-orange-300 border border-orange-700',
    hypertrophy: 'bg-blue-900/50 text-blue-300 border border-blue-700'
  };
  return classes[phase];
}
