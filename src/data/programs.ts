import { TrainingGoal, DUPPhase } from '../types';

export interface DayTemplate {
  phase: DUPPhase;
  mainLifts: string[];     // exercise IDs
  accessories: string[];  // exercise IDs
}

export const programTemplates: Record<TrainingGoal, DayTemplate[]> = {
  powerlifting: [
    {
      phase: 'strength',
      mainLifts: ['back-squat', 'bench-press'],
      accessories: ['front-squat', 'close-grip-bench', 'barbell-row']
    },
    {
      phase: 'power',
      mainLifts: ['deadlift', 'overhead-press'],
      accessories: ['romanian-deadlift', 'barbell-row', 'close-grip-bench']
    },
    {
      phase: 'strength',
      mainLifts: ['bench-press', 'back-squat'],
      accessories: ['overhead-press', 'front-squat', 'barbell-row']
    }
  ],
  hypertrophy: [
    {
      phase: 'hypertrophy',
      mainLifts: ['back-squat', 'bench-press'],
      accessories: ['leg-press', 'dumbbell-flyes', 'cable-rows', 'tricep-pushdowns']
    },
    {
      phase: 'hypertrophy',
      mainLifts: ['deadlift', 'overhead-press'],
      accessories: ['leg-curls', 'lat-pulldown', 'bicep-curls', 'shoulder-press']
    },
    {
      phase: 'power',
      mainLifts: ['back-squat', 'bench-press'],
      accessories: ['romanian-deadlift', 'cable-rows', 'tricep-pushdowns', 'bicep-curls']
    }
  ],
  both: [
    {
      phase: 'strength',
      mainLifts: ['back-squat', 'bench-press'],
      accessories: ['front-squat', 'dumbbell-flyes', 'cable-rows', 'tricep-pushdowns']
    },
    {
      phase: 'hypertrophy',
      mainLifts: ['deadlift', 'overhead-press'],
      accessories: ['leg-press', 'lat-pulldown', 'bicep-curls', 'shoulder-press']
    },
    {
      phase: 'power',
      mainLifts: ['bench-press', 'back-squat'],
      accessories: ['close-grip-bench', 'barbell-row', 'leg-curls', 'dumbbell-flyes']
    }
  ]
};
