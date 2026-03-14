import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgram } from '../hooks/useProgram';
import { useWorkouts } from '../hooks/useWorkouts';
import ExerciseLogger from '../components/ExerciseLogger';
import { Workout as WorkoutType, WorkoutSet, WorkoutExercise } from '../types';

export default function Workout() {
  const navigate = useNavigate();
  const { program, profile, getTodaysWorkout } = useProgram();
  const { saveWorkout } = useWorkouts();

  const todaysWorkout = getTodaysWorkout();
  const fallbackWorkout = program.find(w => !w.completed) || program[0];
  const baseWorkout = todaysWorkout || fallbackWorkout;

  const [activeWorkout, setActiveWorkout] = useState<WorkoutType | null>(baseWorkout || null);
  const [restTimer, setRestTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setActiveWorkout(baseWorkout || null);
  }, [baseWorkout]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(t => {
          if (t <= 1) {
            setTimerActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, restTimer]);

  const startRestTimer = (seconds: number) => {
    setRestTimer(seconds);
    setTimerActive(true);
  };

  const updateSet = useCallback((exerciseIndex: number, setIndex: number, updates: Partial<WorkoutSet>) => {
    setActiveWorkout(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      updated.exercises = prev.exercises.map((ex, ei) => {
        if (ei !== exerciseIndex) return ex;
        const updatedEx: WorkoutExercise = {
          ...ex,
          sets: ex.sets.map((s, si) => {
            if (si !== setIndex) return s;
            return { ...s, ...updates };
          })
        };
        return updatedEx;
      });
      return updated;
    });
    // Auto-start rest timer when completing a set
    if (updates.completed) {
      startRestTimer(90);
    }
  }, []);

  const handleCompleteWorkout = () => {
    if (!activeWorkout) return;
    const completedWorkout: WorkoutType = {
      ...activeWorkout,
      completed: true,
      notes,
      date: new Date().toISOString()
    };
    saveWorkout(completedWorkout);
    setCompleted(true);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🏋️</div>
          <h2 className="text-white text-2xl font-bold mb-2">No Profile Found</h2>
          <p className="text-slate-400 mb-6">Set up your profile to start tracking workouts</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium">
            Get Started
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-white text-3xl font-black mb-2">Workout Complete!</h2>
          <p className="text-slate-400 mb-8">Great work. Your progress has been saved.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/progress')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium">
              View Progress
            </button>
            <button onClick={() => navigate('/program')} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium">
              Back to Program
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeWorkout) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-white text-2xl font-bold mb-2">All Caught Up!</h2>
          <p className="text-slate-400 mb-6">No workouts scheduled. Check your program or generate a new one.</p>
          <button onClick={() => navigate('/program')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium">
            View Program
          </button>
        </div>
      </div>
    );
  }

  const totalSets = activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const phaseLabels: Record<string, string> = { strength: 'Strength', power: 'Power', hypertrophy: 'Hypertrophy' };
  const restPresets = [60, 90, 120, 180, 300];

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-4 py-5 sticky top-[57px] z-40">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-white font-bold text-xl">
                Week {activeWorkout.weekNumber} · Day {activeWorkout.dayOfWeek + 1}
              </h1>
              <span className="text-slate-400 text-sm">{phaseLabels[activeWorkout.phase]} Day</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">{completedSets}/{totalSets}</div>
              <div className="text-slate-500 text-xs">sets done</div>
            </div>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        {/* Rest Timer */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Rest Timer</h3>
            {timerActive && (
              <span className="text-2xl font-mono font-bold text-indigo-400">
                {Math.floor(restTimer / 60)}:{String(restTimer % 60).padStart(2, '0')}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {restPresets.map(sec => (
              <button
                key={sec}
                onClick={() => startRestTimer(sec)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  timerActive && restTimer <= sec && restTimer > sec - 30
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
              </button>
            ))}
            {timerActive && (
              <button
                onClick={() => { setTimerActive(false); setRestTimer(0); }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-900/50 text-red-400 hover:bg-red-900/70"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Exercises */}
        {activeWorkout.exercises.map((exercise, exerciseIndex) => (
          <ExerciseLogger
            key={exercise.exerciseId}
            exercise={exercise}
            onUpdateSet={(setIndex, updates) => updateSet(exerciseIndex, setIndex, updates)}
          />
        ))}

        {/* Notes */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <h3 className="text-white font-semibold mb-3">Workout Notes</h3>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="How did it feel? Any PRs? Notes for next time..."
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none h-24"
          />
        </div>

        {/* Complete Button */}
        <button
          onClick={handleCompleteWorkout}
          disabled={completedSets === 0}
          className={`w-full py-4 font-bold text-xl rounded-xl transition-all ${
            completedSets > 0
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-900/30'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {completedSets === 0 ? 'Complete at least one set' : `Complete Workout (${completedSets}/${totalSets} sets)`}
        </button>
      </div>
    </div>
  );
}
