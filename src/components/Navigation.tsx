import { Link, useLocation } from 'react-router-dom';
import { useProgram } from '../hooks/useProgram';

const goalLabels: Record<string, string> = {
  powerlifting: 'Powerlifting',
  hypertrophy: 'Hypertrophy',
  both: 'Powerbuilding'
};

const goalColors: Record<string, string> = {
  powerlifting: 'bg-red-900/60 text-red-300 border-red-700',
  hypertrophy: 'bg-blue-900/60 text-blue-300 border-blue-700',
  both: 'bg-purple-900/60 text-purple-300 border-purple-700'
};

export default function Navigation() {
  const location = useLocation();
  const { profile } = useProgram();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/program', label: 'Program' },
    { to: '/workout', label: 'Workout' },
    { to: '/progress', label: 'Progress' }
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🏋️</span>
          <span className="text-white font-bold text-lg tracking-tight">Program Your Lifts</span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {profile && (
            <span className={`hidden md:inline-block ml-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${goalColors[profile.goal] || 'bg-slate-700 text-slate-300'}`}>
              {goalLabels[profile.goal] || profile.goal}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
