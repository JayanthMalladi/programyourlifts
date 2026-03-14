import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalSelector from '../components/GoalSelector';
import { TrainingGoal, UserProfile } from '../types';
import { useProgram } from '../hooks/useProgram';

const defaultLifts = [
  { id: 'back-squat', label: 'Back Squat', placeholder: '315' },
  { id: 'bench-press', label: 'Bench Press', placeholder: '225' },
  { id: 'deadlift', label: 'Deadlift', placeholder: '405' }
];

export default function Home() {
  const navigate = useNavigate();
  const { profile, generateProgram } = useProgram();

  const [goal, setGoal] = useState<TrainingGoal | null>(profile?.goal || null);
  const [daysPerWeek, setDaysPerWeek] = useState(profile?.trainingDaysPerWeek || 4);
  const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>(
    profile?.experienceLevel || 'intermediate'
  );
  const [oneRepMaxes, setOneRepMaxes] = useState<Record<string, string>>(
    profile ? Object.fromEntries(
      Object.entries(profile.oneRepMaxes).map(([k, v]) => [k, String(v)])
    ) : {}
  );
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setGoal(profile.goal);
      setDaysPerWeek(profile.trainingDaysPerWeek);
      setExperienceLevel(profile.experienceLevel);
    }
  }, [profile]);

  const handleSubmit = () => {
    const newErrors: string[] = [];
    if (!goal) newErrors.push('Please select a training goal');

    const parsedMaxes: Record<string, number> = {};
    defaultLifts.forEach(lift => {
      const val = parseFloat(oneRepMaxes[lift.id] || '0');
      if (val <= 0) newErrors.push(`Please enter your ${lift.label} 1RM`);
      parsedMaxes[lift.id] = val;
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const userProfile: UserProfile = {
      goal: goal!,
      trainingDaysPerWeek: daysPerWeek,
      experienceLevel,
      oneRepMaxes: parsedMaxes
    };

    generateProgram(userProfile);
    navigate('/program');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-6xl mb-4">🏋️‍♂️</div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Program Your Lifts
          </h1>
          <p className="text-xl text-slate-400 mb-2 max-w-2xl mx-auto">
            Advanced DUP-based programming for powerlifters and physique athletes.
          </p>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Daily Undulating Periodization • Science-Based • Personalized to Your Goals
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-10">
        {/* Goal Selection */}
        <section>
          <h2 className="text-white font-bold text-2xl mb-2">Choose Your Goal</h2>
          <p className="text-slate-400 text-sm mb-6">Select the training approach that aligns with your objectives</p>
          <GoalSelector selected={goal} onSelect={setGoal} />
        </section>

        {/* 1RM Inputs */}
        <section>
          <h2 className="text-white font-bold text-2xl mb-2">Your Current Maxes</h2>
          <p className="text-slate-400 text-sm mb-6">Enter your current 1-rep maxes (or best recent attempt) in pounds</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {defaultLifts.map(lift => (
              <div key={lift.id} className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                <label className="block text-slate-300 font-medium mb-2">{lift.label}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={oneRepMaxes[lift.id] || ''}
                    onChange={e => setOneRepMaxes(prev => ({ ...prev, [lift.id]: e.target.value }))}
                    placeholder={lift.placeholder}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none pr-12"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">lbs</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Training Setup */}
        <section>
          <h2 className="text-white font-bold text-2xl mb-6">Training Setup</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <label className="block text-slate-300 font-medium mb-3">Training Days / Week</label>
              <div className="flex gap-2">
                {[3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setDaysPerWeek(n)}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-lg transition-colors ${
                      daysPerWeek === n
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
              <label className="block text-slate-300 font-medium mb-3">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value as UserProfile['experienceLevel'])}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="beginner">Beginner {'(<'}1 year)</option>
                <option value="intermediate">Intermediate (1-3 years)</option>
                <option value="advanced">Advanced (3+ years)</option>
              </select>
            </div>
          </div>
        </section>

        {/* DUP Explanation */}
        <section className="bg-gradient-to-r from-indigo-950/50 to-purple-950/50 rounded-xl border border-indigo-800/50 p-6">
          <h3 className="text-indigo-300 font-bold text-lg mb-2">What is Daily Undulating Periodization?</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            DUP rotates training stimuli — strength, power, and hypertrophy — within each week.
            Research shows this varied approach produces superior adaptations compared to linear periodization
            by preventing accommodation and targeting multiple physiological systems simultaneously.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { phase: 'Strength', pct: '85-90%', reps: '3-5 reps', sets: '5 sets', color: 'text-red-400' },
              { phase: 'Power', pct: '75-80%', reps: '5-8 reps', sets: '4 sets', color: 'text-orange-400' },
              { phase: 'Hypertrophy', pct: '65-70%', reps: '8-15 reps', sets: '3 sets', color: 'text-blue-400' }
            ].map(item => (
              <div key={item.phase} className="text-center">
                <div className={`font-bold ${item.color}`}>{item.phase}</div>
                <div className="text-slate-500 text-xs mt-1">{item.pct} 1RM</div>
                <div className="text-slate-400 text-xs">{item.reps}</div>
                <div className="text-slate-500 text-xs">{item.sets}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-950/50 border border-red-700 rounded-xl p-4">
            {errors.map((err, i) => (
              <p key={i} className="text-red-400 text-sm">• {err}</p>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xl rounded-xl transition-all shadow-lg shadow-indigo-900/50 active:scale-[0.99]"
        >
          Generate My Program →
        </button>
      </div>
    </div>
  );
}
