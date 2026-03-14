import { Workout } from '../types';
import { getExerciseById } from '../data/exercises';
import { getPhaseBadgeClasses } from '../utils/dupEngine';
import { Link } from 'react-router-dom';

interface WorkoutCardProps {
  workout: Workout;
  showStartButton?: boolean;
}

export default function WorkoutCard({ workout, showStartButton = false }: WorkoutCardProps) {
  const phaseLabels: Record<string, string> = {
    strength: 'Strength',
    power: 'Power',
    hypertrophy: 'Hypertrophy'
  };

  const mainExercises = workout.exercises.slice(0, 3);

  return (
    <div className={`bg-slate-800 rounded-xl border ${workout.completed ? 'border-green-700 opacity-75' : 'border-slate-700'} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-slate-400 text-sm">Day {workout.dayOfWeek + 1}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getPhaseBadgeClasses(workout.phase)}`}>
              {phaseLabels[workout.phase]}
            </span>
            {workout.completed && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-700">
                ✓ Done
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 text-xs">Week {workout.weekNumber}</div>
          <div className="text-slate-300 text-sm font-medium">
            {new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {mainExercises.map(ex => {
          const exercise = getExerciseById(ex.exerciseId);
          return (
            <div key={ex.exerciseId} className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">{exercise?.name || ex.exerciseId}</span>
              <span className="text-slate-500 text-xs">{ex.targetSets}×{ex.targetReps} @ {ex.targetWeight}lbs</span>
            </div>
          );
        })}
        {workout.exercises.length > 3 && (
          <div className="text-slate-500 text-xs">+{workout.exercises.length - 3} more exercises</div>
        )}
      </div>

      {showStartButton && !workout.completed && (
        <Link
          to="/workout"
          className="block w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Start Workout
        </Link>
      )}
    </div>
  );
}
