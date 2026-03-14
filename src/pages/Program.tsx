import { useNavigate } from 'react-router-dom';
import { useProgram } from '../hooks/useProgram';
import WorkoutCard from '../components/WorkoutCard';

export default function Program() {
  const navigate = useNavigate();
  const { program, profile } = useProgram();

  if (!profile || program.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-white text-2xl font-bold mb-2">No Program Yet</h2>
          <p className="text-slate-400 mb-6">Set up your profile to generate your DUP program</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  const weeks = [1, 2, 3, 4];
  const goalLabel: Record<string, string> = {
    powerlifting: 'Powerlifting',
    hypertrophy: 'Hypertrophy',
    both: 'Powerbuilding'
  };

  const todaysWorkout = program.find(w => {
    const today = new Date().toISOString().split('T')[0];
    return w.date.split('T')[0] === today && !w.completed;
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📅</span>
            <h1 className="text-3xl font-black text-white">Your 4-Week Program</h1>
          </div>
          <p className="text-slate-400 mb-1">
            {goalLabel[profile.goal]} • {profile.trainingDaysPerWeek} days/week • DUP Mesocycle
          </p>
          <p className="text-slate-500 text-sm">
            Daily Undulating Periodization rotates training stimuli to maximize adaptation
          </p>

          {todaysWorkout && (
            <div className="mt-6 bg-indigo-900/30 border border-indigo-700 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-indigo-300 font-semibold">Today's Workout is Ready</p>
                <p className="text-slate-400 text-sm">
                  {todaysWorkout.phase.charAt(0).toUpperCase() + todaysWorkout.phase.slice(1)} day • {todaysWorkout.exercises.length} exercises
                </p>
              </div>
              <button
                onClick={() => navigate('/workout')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm"
              >
                Start Now →
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {/* Phase Legend */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Strength', classes: 'bg-red-900/50 text-red-300 border-red-700' },
            { label: 'Power', classes: 'bg-orange-900/50 text-orange-300 border-orange-700' },
            { label: 'Hypertrophy', classes: 'bg-blue-900/50 text-blue-300 border-blue-700' }
          ].map(p => (
            <span key={p.label} className={`text-xs px-3 py-1 rounded-full border font-semibold ${p.classes}`}>
              {p.label}
            </span>
          ))}
        </div>

        {weeks.map(weekNum => {
          const weekWorkouts = program.filter(w => w.weekNumber === weekNum);
          const completedCount = weekWorkouts.filter(w => w.completed).length;
          return (
            <section key={weekNum}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-white font-bold text-xl">Week {weekNum}</h2>
                <span className="text-slate-500 text-sm">{completedCount}/{weekWorkouts.length} completed</span>
                {completedCount > 0 && (
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden max-w-32">
                    <div
                      className="h-full bg-green-600 rounded-full transition-all"
                      style={{ width: `${(completedCount / weekWorkouts.length) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weekWorkouts.map(workout => (
                  <WorkoutCard key={workout.id} workout={workout} showStartButton={false} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
