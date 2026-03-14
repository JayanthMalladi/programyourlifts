import { WorkoutExercise, WorkoutSet } from '../types';
import { getExerciseById } from '../data/exercises';
import { getPhaseBadgeClasses } from '../utils/dupEngine';

interface ExerciseLoggerProps {
  exercise: WorkoutExercise;
  onUpdateSet: (setIndex: number, updates: Partial<WorkoutSet>) => void;
}

export default function ExerciseLogger({ exercise, onUpdateSet }: ExerciseLoggerProps) {
  const exerciseData = getExerciseById(exercise.exerciseId);
  const phaseLabels: Record<string, string> = {
    strength: 'Strength',
    power: 'Power',
    hypertrophy: 'Hypertrophy'
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-lg">{exerciseData?.name || exercise.exerciseId}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPhaseBadgeClasses(exercise.phase)}`}>
              {phaseLabels[exercise.phase]}
            </span>
            <span className="text-slate-500 text-xs">
              Target: {exercise.targetSets}×{exercise.targetReps} @ {exercise.targetWeight}lbs
            </span>
          </div>
          {exerciseData?.muscleGroups && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {exerciseData.muscleGroups.slice(0, 3).map(mg => (
                <span key={mg} className="text-xs px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">
                  {mg}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-2 text-xs text-slate-500 font-medium px-1">
          <span>SET</span>
          <span className="col-span-2">WEIGHT (lbs)</span>
          <span>REPS</span>
          <span>DONE</span>
        </div>
        {exercise.sets.map((set, idx) => (
          <div key={idx} className={`grid grid-cols-5 gap-2 items-center p-2 rounded-lg transition-colors ${set.completed ? 'bg-green-900/20 border border-green-800/50' : 'bg-slate-700/30'}`}>
            <span className="text-slate-400 text-sm font-medium">{idx + 1}</span>
            <input
              type="number"
              value={set.weight || ''}
              onChange={e => onUpdateSet(idx, { weight: parseFloat(e.target.value) || 0 })}
              className="col-span-2 bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-white text-sm w-full focus:border-indigo-500 focus:outline-none"
              placeholder={`${exercise.targetWeight}`}
              min="0"
              step="2.5"
            />
            <input
              type="number"
              value={set.reps || ''}
              onChange={e => onUpdateSet(idx, { reps: parseInt(e.target.value) || 0 })}
              className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-white text-sm w-full focus:border-indigo-500 focus:outline-none"
              placeholder={`${exercise.targetReps}`}
              min="0"
            />
            <button
              onClick={() => onUpdateSet(idx, { completed: !set.completed })}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                set.completed
                  ? 'bg-green-600 border-green-500'
                  : 'border-slate-500 hover:border-green-500'
              }`}
            >
              {set.completed && (
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
