import { useState } from 'react';
import { WORKOUT_PLAN } from '../data/workouts';

export default function HistoryView({ allSessions }) {
  const [expandedSession, setExpandedSession] = useState(null);

  const getDayInfo = (dayId) => WORKOUT_PLAN.find(d => d.id === dayId);

  if (allSessions.length === 0) {
    return (
      <div className="history-view">
        <h2 className="section-title">Workout History</h2>
        <div className="no-data">
          <div className="no-data-icon">📋</div>
          <p>No sessions logged yet. Start your first workout!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-view">
      <h2 className="section-title">Workout History</h2>
      <div className="history-list">
        {allSessions.map((session) => (
          <div key={session.date} className="history-session">
            <div
              className="session-header"
              onClick={() => setExpandedSession(
                expandedSession === session.date ? null : session.date
              )}
            >
              <span className="session-date">{session.date}</span>
              <div className="session-days">
                {Object.keys(session.data).map(dayId => {
                  const day = getDayInfo(dayId);
                  if (!day) return null;
                  return (
                    <span
                      key={dayId}
                      className="day-chip"
                      style={{ background: day.color + '22', color: day.color, border: `1px solid ${day.color}44` }}
                    >
                      {day.label}
                    </span>
                  );
                })}
              </div>
              <span className="session-toggle">{expandedSession === session.date ? '▲' : '▼'}</span>
            </div>

            {expandedSession === session.date && (
              <div className="session-detail">
                {Object.entries(session.data).map(([dayId, dayData]) => {
                  const day = getDayInfo(dayId);
                  if (!day) return null;
                  return (
                    <div key={dayId} className="session-day-block">
                      <div className="session-day-title" style={{ color: day.color }}>
                        {day.name}
                      </div>
                      {Object.entries(dayData).map(([exId, exData]) => {
                        const exercise = day.exercises.find(e => e.id === exId);
                        if (!exercise || !exData.sets?.length) return null;
                        return (
                          <div key={exId} className="history-exercise">
                            <div className="history-ex-name">{exercise.name}</div>
                            <div className="history-sets">
                              {exData.sets.map((set, i) => set?.weight && set?.reps ? (
                                <span key={i} className="history-set-chip">
                                  {set.weight}lbs × {set.reps}
                                </span>
                              ) : null)}
                            </div>
                            {exData.notes && (
                              <div className="history-notes">💬 {exData.notes}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
