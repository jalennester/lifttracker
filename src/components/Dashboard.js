import { WORKOUT_PLAN, formatDate } from '../data/workouts';
import { getExercisePR, loadAllSessions } from '../hooks/useWorkoutTracker';

function computeStreak(sessions) {
  if (!sessions.length) return 0;
  const sessionDates = new Set(sessions.map(s => s.date));

  const today = new Date();
  const todayStr = formatDate(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  // Start from today if worked out, else yesterday (user might not have gone yet today)
  let startDate;
  if (sessionDates.has(todayStr)) startDate = new Date(today);
  else if (sessionDates.has(yesterdayStr)) startDate = new Date(yesterday);
  else return 0;

  let streak = 0;
  const checkDate = new Date(startDate);
  while (true) {
    const dateStr = formatDate(checkDate);
    if (sessionDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function Dashboard({ onStartWorkout }) {
  const sessions = loadAllSessions();
  const streak = computeStreak(sessions);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekSessions = sessions.filter(s => new Date(s.date) >= weekStart);

  const allExercises = WORKOUT_PLAN.flatMap(d => d.exercises.map(e => ({ ...e, dayColor: d.color, dayEmoji: d.emoji })));
  const prs = allExercises
    .map(ex => ({ exercise: ex, pr: getExercisePR(ex.id) }))
    .filter(x => x.pr)
    .sort((a, b) => new Date(b.pr.date) - new Date(a.pr.date))
    .slice(0, 6);

  const totalSessions = sessions.length;
  const totalVolume = sessions.reduce((acc, s) => {
    Object.values(s.data).forEach(dayData => {
      Object.values(dayData).forEach(exData => {
        exData.sets?.forEach(set => {
          if (set?.weight && set?.reps) acc += parseFloat(set.weight) * parseInt(set.reps);
        });
      });
    });
    return acc;
  }, 0);

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <h1 className="hero-title">Lock In 🔒</h1>
        <p className="hero-sub">Track every rep. Chase every PR.</p>
      </div>

      <div className="stats-row">
        <div className="stat-tile">
          <span className="tile-number">{totalSessions}</span>
          <span className="tile-label">Total Sessions</span>
        </div>
        <div className="stat-tile">
          <span className="tile-number">{weekSessions.length}</span>
          <span className="tile-label">This Week</span>
        </div>
        <div className="stat-tile">
          <span className="tile-number">{prs.length}</span>
          <span className="tile-label">PRs Set</span>
        </div>
        <div className="stat-tile">
          <span className="tile-number">{totalVolume > 0 ? (totalVolume / 1000).toFixed(1) + 'k' : '0'}</span>
          <span className="tile-label">Total Volume</span>
        </div>
        <div className="stat-tile stat-tile-streak">
          <span className="tile-number tile-streak">{streak > 0 ? streak : '—'}</span>
          <span className="tile-label">{streak > 0 ? '🔥 Day Streak' : 'Day Streak'}</span>
        </div>
      </div>

      <div className="days-grid">
        <h2 className="section-title">Start a Workout</h2>
        {WORKOUT_PLAN.map((day, i) => (
          <button
            key={day.id}
            className="day-card"
            onClick={() => onStartWorkout(day)}
            style={{ '--day-color': day.color }}
          >
            <div className="day-card-badge">{i + 1}</div>
            <div className="day-card-info">
              <span className="day-card-label">{day.label}</span>
              <span className="day-card-name">{day.name}</span>
              <span className="day-card-count">{day.exercises.length} exercises</span>
            </div>
            <div className="day-card-arrow">→</div>
          </button>
        ))}
      </div>

      {prs.length > 0 && (
        <div className="recent-prs">
          <h2 className="section-title">Recent PRs 🏆</h2>
          <div className="pr-list">
            {prs.map(({ exercise, pr }) => (
              <div key={exercise.id} className="pr-row">
                <span className="pr-ex-name">{exercise.name}</span>
                <div className="pr-stats">
                  <span className="pr-weight" style={{ color: exercise.dayColor }}>{pr.weight} lbs</span>
                  <span className="pr-reps">× {pr.reps} reps</span>
                  <span className="pr-date">{pr.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
