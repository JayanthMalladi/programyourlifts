import { useNavigate } from 'react-router-dom';
import { useProgram } from '../hooks/useProgram';
import { useWorkouts } from '../hooks/useWorkouts';
import ProgressChart from '../components/ProgressChart';
import { competitionLifts, getExerciseById } from '../data/exercises';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartColors: Record<string, string> = {
  'back-squat': '#ef4444',
  'bench-press': '#3b82f6',
  'deadlift': '#f97316'
};

export default function Progress() {
  const navigate = useNavigate();
  const { profile } = useProgram();
  const { getPersonalRecords, getProgressForExercise, getTrainingStreak, getWeeklyVolume, workouts } = useWorkouts();

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-white text-2xl font-bold mb-2">No Data Yet</h2>
          <p className="text-slate-400 mb-6">Set up your profile and complete some workouts to see progress</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium">
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const prs = getPersonalRecords();
  const streak = getTrainingStreak();
  const weeklyVolume = getWeeklyVolume();
  const completedWorkouts = workouts.filter(w => w.completed).length;
  const totalSetsCompleted = workouts
    .filter(w => w.completed)
    .reduce((acc, w) => acc + w.exercises.reduce((a, e) => a + e.sets.filter(s => s.completed).length, 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📊</span>
            <h1 className="text-3xl font-black text-white">Progress Dashboard</h1>
          </div>
          <p className="text-slate-400">Track your strength gains and training consistency</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Training Streak', value: `${streak}`, unit: 'days', icon: '🔥' },
            { label: 'Workouts Done', value: `${completedWorkouts}`, unit: 'total', icon: '💪' },
            { label: 'Sets Completed', value: `${totalSetsCompleted}`, unit: 'sets', icon: '✅' },
            { label: 'PRs Tracked', value: `${Object.keys(prs).length}`, unit: 'lifts', icon: '🏆' }
          ].map(stat => (
            <div key={stat.label} className="bg-slate-800 rounded-xl border border-slate-700 p-4 text-center">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-slate-500 text-xs">{stat.unit}</div>
              <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 1RM Progress Charts */}
        <section>
          <h2 className="text-white font-bold text-xl mb-4">Estimated 1RM Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {competitionLifts.map(exercise => (
              <ProgressChart
                key={exercise.id}
                data={getProgressForExercise(exercise.id)}
                title={exercise.name}
                color={chartColors[exercise.id] || '#6366f1'}
              />
            ))}
          </div>
        </section>

        {/* Personal Records Table */}
        {Object.keys(prs).length > 0 && (
          <section>
            <h2 className="text-white font-bold text-xl mb-4">Personal Records</h2>
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-5 py-3 text-slate-400 text-sm font-medium">Exercise</th>
                    <th className="text-right px-5 py-3 text-slate-400 text-sm font-medium">Est. 1RM</th>
                    <th className="text-right px-5 py-3 text-slate-400 text-sm font-medium">Best Set</th>
                    <th className="text-right px-5 py-3 text-slate-400 text-sm font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(prs).map(([exerciseId, pr]) => {
                    const exercise = getExerciseById(exerciseId);
                    return (
                      <tr key={exerciseId} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                        <td className="px-5 py-3">
                          <span className="text-white font-medium">{exercise?.name || exerciseId}</span>
                          {exercise?.isCompetitionLift && (
                            <span className="ml-2 text-xs text-yellow-500">🏆</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="text-indigo-400 font-bold">{Math.round(pr.estimatedOneRepMax)} lbs</span>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-300 text-sm">
                          {pr.weight} × {pr.reps}
                        </td>
                        <td className="px-5 py-3 text-right text-slate-500 text-sm">
                          {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Weekly Volume Chart */}
        {weeklyVolume.length > 0 && (
          <section>
            <h2 className="text-white font-bold text-xl mb-4">Weekly Training Volume</h2>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <p className="text-slate-500 text-xs mb-4">Total tonnage per week (sets × reps × weight in lbs)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyVolume} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8' }}
                    formatter={(value: number) => [`${value.toLocaleString()} lbs`, 'Volume']}
                  />
                  <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]} name="Volume" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {completedWorkouts === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🏋️‍♂️</div>
            <h3 className="text-white font-bold text-xl mb-2">Start Tracking Today</h3>
            <p className="text-slate-400 mb-6">Complete your first workout to see your progress here</p>
            <button onClick={() => navigate('/workout')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium">
              Start Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
