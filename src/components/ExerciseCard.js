import { useState } from 'react';
import { getExercisePR } from '../hooks/useWorkoutTracker';

export default function ExerciseCard({ exercise, data, onUpdateSet, onUpdateNotes, dayColor }) {
  const [showNotes, setShowNotes] = useState(false);
  const pr = getExercisePR(exercise.id);
  const sets = data?.sets || [];
  const notes = data?.notes || '';

  const numSets = exercise.defaultSets;

  const getSetStatus = (set) => {
    if (!set || !set.weight || !set.reps) return 'empty';
    if (pr && parseFloat(set.weight) > pr.weight) return 'pr';
    if (set.weight && set.reps) return 'done';
    return 'partial';
  };

  return (
    <div className="exercise-card">
      <div className="exercise-header">
        <div className="exercise-info">
          <span className="muscle-tag" style={{ borderColor: dayColor, color: dayColor }}>
            {exercise.muscle}
          </span>
          <h3 className="exercise-name">{exercise.name}</h3>
          {exercise.note && <span className="exercise-note">({exercise.note})</span>}
        </div>
        {pr && (
          <div className="pr-badge">
            <span className="pr-label">PR</span>
            <span className="pr-value">{pr.weight} lbs</span>
          </div>
        )}
      </div>

      <div className="sets-grid">
        <div className="sets-header">
          <span>Set</span>
          <span>Weight (lbs)</span>
          <span>Reps</span>
          <span>Status</span>
        </div>
        {Array.from({ length: numSets }).map((_, i) => {
          const set = sets[i] || {};
          const status = getSetStatus(set);
          return (
            <div key={i} className={`set-row ${status}`}>
              <span className="set-number">{i + 1}</span>
              <input
                type="number"
                className="set-input"
                placeholder="0"
                value={set.weight || ''}
                onChange={e => onUpdateSet(exercise.id, i, 'weight', e.target.value)}
              />
              <input
                type="number"
                className="set-input"
                placeholder="0"
                value={set.reps || ''}
                onChange={e => onUpdateSet(exercise.id, i, 'reps', e.target.value)}
              />
              <div className="set-indicator">
                {status === 'pr' && <span className="indicator pr-indicator">🏆 PR!</span>}
                {status === 'done' && <span className="indicator done-indicator">✓</span>}
                {status === 'partial' && <span className="indicator partial-indicator">…</span>}
                {status === 'empty' && <span className="indicator empty-indicator">–</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="exercise-footer">
        <button
          className="notes-toggle"
          onClick={() => setShowNotes(!showNotes)}
        >
          {showNotes ? '▲ Hide notes' : '▼ Add notes'}
        </button>
        {showNotes && (
          <textarea
            className="notes-input"
            placeholder="How did this feel? Any form cues, drop sets, pain points..."
            value={notes}
            onChange={e => onUpdateNotes(exercise.id, e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
