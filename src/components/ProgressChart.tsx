import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProgressEntry } from '../types';

interface ProgressChartProps {
  data: ProgressEntry[];
  title: string;
  color?: string;
}

export default function ProgressChart({ data, title, color = '#6366f1' }: ProgressChartProps) {
  const chartData = data.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    e1RM: Math.round(entry.estimatedOneRepMax),
    weight: entry.weight,
    reps: entry.reps
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
        <h3 className="text-white font-semibold mb-4">{title}</h3>
        <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
          No data yet. Complete workouts to see progress.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-slate-500 text-xs mb-4">Estimated 1RM over time (lbs)</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            labelStyle={{ color: '#94a3b8' }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Line
            type="monotone"
            dataKey="e1RM"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5 }}
            name="Est. 1RM"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
