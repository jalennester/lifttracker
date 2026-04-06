import ExerciseCard from './ExerciseCard';
import RestTimer from './RestTimer';
import { useState } from 'react';

export default function WorkoutSession({
  day, sessionData, onUpdateSet, onUpdateNotes,
  onSave, onBack, selectedDate, setSelectedDate
}) {
  const [saved, setSaved] = useState(false);
  const [prs, setPrs] = useState([]);

  const handleSave = () => {
    const foundPRs = onSave();
    setPrs(foundPRs || []);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const muscles = [...new Set(day.exercises.map(e => e.muscle))];

  const completedSets = day.exercises.reduce((acc, ex) => {
    const sets = sessionData[ex.id]?.sets || [];
    return acc + sets.filter(s => s?.weight && s?.reps).length;
  }, 0);
  const totalSets = day.exercises.reduce((acc, ex) => acc + ex.defaultSets, 0);

  return (
    <div className="workout-session">
      <div className="session-topbar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="session-title-wrap">
          <h2 className="session-day-name" style={{ color: day.color }}>
            {day.emoji} {day.label} — {day.name}
          </h2>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{ width: `${totalSets > 0 ? (completedSets / totalSets) * 100 : 0}%`, background: day.color }}
            />
          </div>
          <span className="progress-label">{completedSets}/{totalSets} sets logged</span>
        </div>
        <input
          type="date"
          className="date-picker"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="session-layout">
        <div className="exercises-column">
          {muscles.map(muscle => (
            <div key={muscle} className="muscle-group">
              <div className="muscle-group-header">{muscle}</div>
              {day.exercises.filter(e => e.muscle === muscle).map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  data={sessionData[exercise.id]}
                  onUpdateSet={onUpdateSet}
                  onUpdateNotes={onUpdateNotes}
                  dayColor={day.color}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-column">
          <RestTimer />
          <button
            className="save-btn"
            style={{ '--day-color': day.color }}
            onClick={handleSave}
          >
            {saved ? '✓ Saved!' : 'Save Session'}
          </button>
          {prs.length > 0 && (
            <div className="pr-popup">
              <div className="pr-popup-title">🏆 New PR{prs.length > 1 ? 's' : ''}!</div>
              {prs.map((pr, i) => (
                <div key={i} className="pr-popup-row">
                  {pr.weight} lbs × {pr.reps}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
