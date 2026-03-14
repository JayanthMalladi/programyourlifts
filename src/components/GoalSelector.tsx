import { TrainingGoal } from '../types';

interface GoalSelectorProps {
  selected: TrainingGoal | null;
  onSelect: (goal: TrainingGoal) => void;
}

const goals = [
  {
    id: 'powerlifting' as TrainingGoal,
    icon: '🏆',
    title: 'Powerlifting',
    subtitle: 'Elite Strength',
    description: 'Compete on the platform. Build elite strength in squat, bench, and deadlift.',
    accent: 'border-red-600 bg-red-950/30',
    badge: 'bg-red-900/50 text-red-300',
    hover: 'hover:border-red-500'
  },
  {
    id: 'hypertrophy' as TrainingGoal,
    icon: '💪',
    title: 'Hypertrophy',
    subtitle: 'Maximum Muscle',
    description: 'Maximize muscle growth. Scientific volume and intensity protocols.',
    accent: 'border-blue-600 bg-blue-950/30',
    badge: 'bg-blue-900/50 text-blue-300',
    hover: 'hover:border-blue-500'
  },
  {
    id: 'both' as TrainingGoal,
    icon: '⚡',
    title: 'Powerbuilding',
    subtitle: 'Strength & Size',
    description: 'The best of both worlds. Strength AND size.',
    accent: 'border-purple-600 bg-purple-950/30',
    badge: 'bg-purple-900/50 text-purple-300',
    hover: 'hover:border-purple-500'
  }
];

export default function GoalSelector({ selected, onSelect }: GoalSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {goals.map(goal => (
        <button
          key={goal.id}
          onClick={() => onSelect(goal.id)}
          className={`relative p-6 rounded-xl border-2 text-left transition-all duration-200 ${
            selected === goal.id
              ? `${goal.accent} scale-[1.02] shadow-lg shadow-black/30`
              : `border-slate-700 bg-slate-800/50 ${goal.hover}`
          }`}
        >
          {selected === goal.id && (
            <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className="text-4xl mb-3">{goal.icon}</div>
          <div className="mb-1">
            <span className="text-white font-bold text-xl">{goal.title}</span>
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${goal.badge}`}>{goal.subtitle}</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{goal.description}</p>
        </button>
      ))}
    </div>
  );
}
