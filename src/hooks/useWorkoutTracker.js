import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { formatDate } from '../data/workouts';

// ─── Supabase Helpers ─────────────────────────────────────────────────────────

async function fetchAllSessions(userId) {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('date, day_id, data')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;

  // Group rows by date → { date, data: { dayId: exerciseData } }
  const map = {};
  data.forEach(row => {
    if (!map[row.date]) map[row.date] = { date: row.date, data: {} };
    map[row.date].data[row.day_id] = row.data;
  });
  return Object.values(map).sort((a, b) => b.date.localeCompare(a.date));
}

async function fetchAllPRs(userId) {
  const { data, error } = await supabase
    .from('personal_records')
    .select('exercise_id, weight, reps, date, volume')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) throw error;

  // Group by exerciseId → { exerciseId: [{ weight, reps, date, volume }] }
  const map = {};
  data.forEach(row => {
    if (!map[row.exercise_id]) map[row.exercise_id] = [];
    map[row.exercise_id].push({ weight: row.weight, reps: row.reps, date: row.date, volume: row.volume });
  });
  return map;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useWorkoutTracker = (user) => {
  const [loading, setLoading] = useState(true);
  const [allSessions, setAllSessions] = useState([]);
  const [allPRs, setAllPRs] = useState({});
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedDay, setSelectedDay] = useState(null);
  const [sessionData, setSessionData] = useState({});
  const [newPRs, setNewPRs] = useState([]);

  // Load all data when user logs in
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    Promise.all([fetchAllSessions(user.id), fetchAllPRs(user.id)])
      .then(([sessions, prs]) => {
        setAllSessions(sessions);
        setAllPRs(prs);
      })
      .catch(err => console.error('Failed to load data:', err))
      .finally(() => setLoading(false));
  }, [user]);

  // Load session data when entering a workout day
  useEffect(() => {
    if (!selectedDay) return;
    const session = allSessions.find(s => s.date === selectedDate);
    setSessionData(session?.data?.[selectedDay.id] || {});
  }, [selectedDate, selectedDay, allSessions]);

  const updateSet = useCallback((exerciseId, setIndex, field, value) => {
    setSessionData(prev => {
      const updated = { ...prev };
      if (!updated[exerciseId]) updated[exerciseId] = { sets: [], notes: '' };
      if (!updated[exerciseId].sets[setIndex]) {
        updated[exerciseId].sets[setIndex] = { weight: '', reps: '' };
      }
      updated[exerciseId].sets[setIndex] = {
        ...updated[exerciseId].sets[setIndex],
        [field]: value,
      };
      return updated;
    });
  }, []);

  const updateNotes = useCallback((exerciseId, notes) => {
    setSessionData(prev => {
      const updated = { ...prev };
      if (!updated[exerciseId]) updated[exerciseId] = { sets: [], notes: '' };
      updated[exerciseId] = { ...updated[exerciseId], notes };
      return updated;
    });
  }, []);

  const saveCurrentSession = useCallback(async () => {
    if (!selectedDay || !user) return;

    // Upsert session row
    const { error: sessionError } = await supabase
      .from('workout_sessions')
      .upsert(
        { user_id: user.id, date: selectedDate, day_id: selectedDay.id, data: sessionData },
        { onConflict: 'user_id,date,day_id' }
      );

    if (sessionError) { console.error(sessionError); return; }

    // Update local sessions cache
    setAllSessions(prev => {
      const exists = prev.find(s => s.date === selectedDate);
      if (exists) {
        return prev.map(s =>
          s.date === selectedDate
            ? { ...s, data: { ...s.data, [selectedDay.id]: sessionData } }
            : s
        );
      }
      return [{ date: selectedDate, data: { [selectedDay.id]: sessionData } }, ...prev]
        .sort((a, b) => b.date.localeCompare(a.date));
    });

    // Detect PRs
    const prsFound = [];
    const prInserts = [];

    for (const [exerciseId, exData] of Object.entries(sessionData)) {
      if (!exData.sets) continue;
      for (const set of exData.sets) {
        if (!set?.weight || !set?.reps) continue;
        const weight = parseFloat(set.weight);
        const reps = parseInt(set.reps);
        if (isNaN(weight) || isNaN(reps)) continue;

        const history = allPRs[exerciseId] || [];
        const currentBest = history.reduce((best, e) => e.weight > best.weight ? e : best, { weight: 0 });

        if (weight > currentBest.weight) {
          prsFound.push({ exerciseId, weight, reps });
          prInserts.push({
            user_id: user.id,
            exercise_id: exerciseId,
            weight,
            reps,
            date: selectedDate,
            volume: weight * reps,
          });
        }
      }
    }

    if (prInserts.length > 0) {
      const { error: prError } = await supabase.from('personal_records').insert(prInserts);
      if (!prError) {
        setAllPRs(prev => {
          const updated = { ...prev };
          prInserts.forEach(pr => {
            if (!updated[pr.exercise_id]) updated[pr.exercise_id] = [];
            updated[pr.exercise_id] = [
              ...updated[pr.exercise_id],
              { weight: pr.weight, reps: pr.reps, date: pr.date, volume: pr.volume },
            ];
          });
          return updated;
        });
      }
    }

    setNewPRs(prsFound);
    return prsFound;
  }, [selectedDay, selectedDate, sessionData, user, allPRs]);

  const getProgressData = useCallback((exerciseId) => {
    return allPRs[exerciseId] || [];
  }, [allPRs]);

  const getExercisePR = useCallback((exerciseId) => {
    const history = allPRs[exerciseId];
    if (!history?.length) return null;
    return history.reduce((best, e) => e.weight > best.weight ? e : best, history[0]);
  }, [allPRs]);

  return {
    loading,
    allSessions,
    allPRs,
    selectedDate, setSelectedDate,
    selectedDay, setSelectedDay,
    sessionData,
    updateSet, updateNotes,
    saveCurrentSession,
    getProgressData,
    getExercisePR,
    newPRs, setNewPRs,
  };
};
