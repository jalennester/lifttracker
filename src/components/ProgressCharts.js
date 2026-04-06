import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { WORKOUT_PLAN } from '../data/workouts';
import { loadPRHistory } from '../hooks/useWorkoutTracker';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div className="tt-date">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="tt-row">
            <span className="tt-label">{p.name}</span>
            <span className="tt-value">{p.value} {p.name === 'Volume' ? '' : 'lbs'}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProgressCharts() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [metric, setMetric] = useState('weight');

  const allExercises = WORKOUT_PLAN.flatMap(day =>
    day.exercises.map(ex => ({ ...ex, dayName: day.name, dayColor: day.color }))
  );

  const history = selectedExercise ? loadPRHistory(selectedExercise.id) : [];

  const chartData = history.map(h => ({
    date: h.date,
    Weight: h.weight,
    Reps: h.reps,
    Volume: Math.round(h.weight * h.reps),
  }));

  return (
    <div className="progress-view">
      <h2 className="section-title">Progress Tracker</h2>

      <div className="exercise-picker">
        <label className="picker-label">Select Exercise</label>
        <div className="exercise-list">
          {WORKOUT_PLAN.map(day => (
            <div key={day.id} className="day-group">
              <div className="day-group-label" style={{ color: day.color }}>
                {day.emoji} {day.name}
              </div>
              {day.exercises.map(ex => (
                <button
                  key={ex.id}
                  className={`ex-pick-btn ${selectedExercise?.id === ex.id ? 'selected' : ''}`}
                  style={selectedExercise?.id === ex.id ? { borderColor: day.color, color: day.color } : {}}
                  onClick={() => setSelectedExercise({ ...ex, dayColor: day.color })}
                >
                  {ex.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {selectedExercise && (
        <div className="chart-panel">
          <div className="chart-header">
            <h3 className="chart-title">{selectedExercise.name}</h3>
            <div className="metric-tabs">
              {['weight', 'reps', 'volume'].map(m => (
                <button
                  key={m}
                  className={`metric-tab ${metric === m ? 'active' : ''}`}
                  onClick={() => setMetric(m)}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="no-data">
              <div className="no-data-icon">📊</div>
              <p>No data yet. Log some sessions to see your progress!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedExercise.dayColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={selectedExercise.dayColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#888', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={metric === 'weight' ? 'Weight' : metric === 'reps' ? 'Reps' : 'Volume'}
                  stroke={selectedExercise.dayColor}
                  strokeWidth={2.5}
                  fill="url(#colorGrad)"
                  dot={{ fill: selectedExercise.dayColor, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {chartData.length > 0 && (
            <div className="chart-stats">
              <div className="stat-card">
                <span className="stat-label">Best Weight</span>
                <span className="stat-value">{Math.max(...chartData.map(d => d.Weight))} lbs</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Best Reps</span>
                <span className="stat-value">{Math.max(...chartData.map(d => d.Reps))}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Best Volume</span>
                <span className="stat-value">{Math.max(...chartData.map(d => d.Volume))}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Sessions</span>
                <span className="stat-value">{chartData.length}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
