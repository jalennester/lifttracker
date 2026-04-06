import { useState, useEffect, useCallback } from 'react';
import { getStorageKey, getPRKey, formatDate } from '../data/workouts';

// ─── Storage Helpers ──────────────────────────────────────────────────────────

export const saveSession = (date, dayId, setsData) => {
  const key = getStorageKey(date);
  const existing = JSON.parse(localStorage.getItem(key) || '{}');
  existing[dayId] = setsData;
  localStorage.setItem(key, JSON.stringify(existing));
};

export const loadSession = (date, dayId) => {
  const key = getStorageKey(date);
  const data = JSON.parse(localStorage.getItem(key) || '{}');
  return data[dayId] || {};
};

export const loadAllSessions = () => {
  const sessions = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('lifts_')) {
      const date = key.replace('lifts_', '');
      const data = JSON.parse(localStorage.getItem(key));
      sessions.push({ date, data });
    }
  }
  return sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const savePR = (exerciseId, weight, reps, date) => {
  const key = getPRKey(exerciseId);
  const current = JSON.parse(localStorage.getItem(key) || '[]');
  current.push({ weight, reps, date, volume: weight * reps });
  localStorage.setItem(key, JSON.stringify(current));
};

export const loadPRHistory = (exerciseId) => {
  const key = getPRKey(exerciseId);
  return JSON.parse(localStorage.getItem(key) || '[]');
};

export const getExercisePR = (exerciseId) => {
  const history = loadPRHistory(exerciseId);
  if (!history.length) return null;
  return history.reduce((best, entry) => 
    entry.weight > best.weight ? entry : best, history[0]);
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useWorkoutTracker = () => {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedDay, setSelectedDay] = useState(null);
  const [sessionData, setSessionData] = useState({});
  const [newPRs, setNewPRs] = useState([]);

  const loadDay = useCallback((date, dayId) => {
    const data = loadSession(date, dayId);
    setSessionData(data);
  }, []);

  useEffect(() => {
    if (selectedDay) {
      loadDay(selectedDate, selectedDay.id);
    }
  }, [selectedDate, selectedDay, loadDay]);

  const updateSet = useCallback((exerciseId, setIndex, field, value) => {
    setSessionData(prev => {
      const updated = { ...prev };
      if (!updated[exerciseId]) updated[exerciseId] = { sets: [], notes: '' };
      if (!updated[exerciseId].sets[setIndex]) {
        updated[exerciseId].sets[setIndex] = { weight: '', reps: '' };
      }
      updated[exerciseId].sets[setIndex] = {
        ...updated[exerciseId].sets[setIndex],
        [field]: value
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

  const saveCurrentSession = useCallback(() => {
    if (!selectedDay) return;
    saveSession(selectedDate, selectedDay.id, sessionData);

    // Check for PRs
    const prsFound = [];
    Object.entries(sessionData).forEach(([exerciseId, exData]) => {
      if (!exData.sets) return;
      exData.sets.forEach(set => {
        if (!set || !set.weight || !set.reps) return;
        const weight = parseFloat(set.weight);
        const reps = parseInt(set.reps);
        if (isNaN(weight) || isNaN(reps)) return;

        const currentPR = getExercisePR(exerciseId);
        if (!currentPR || weight > currentPR.weight) {
          savePR(exerciseId, weight, reps, selectedDate);
          prsFound.push({ exerciseId, weight, reps });
        }
      });
    });
    setNewPRs(prsFound);
    return prsFound;
  }, [selectedDay, selectedDate, sessionData]);

  const getProgressData = useCallback((exerciseId) => {
    return loadPRHistory(exerciseId).map(entry => ({
      date: entry.date,
      weight: entry.weight,
      reps: entry.reps,
      volume: entry.volume,
    }));
  }, []);

  return {
    selectedDate, setSelectedDate,
    selectedDay, setSelectedDay,
    sessionData,
    updateSet, updateNotes,
    saveCurrentSession,
    getProgressData,
    newPRs, setNewPRs,
    loadAllSessions,
  };
};
