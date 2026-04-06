import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Dashboard from './components/Dashboard';
import WorkoutSession from './components/WorkoutSession';
import ProgressCharts from './components/ProgressCharts';
import HistoryView from './components/HistoryView';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import { useWorkoutTracker } from './hooks/useWorkoutTracker';
import './App.css';

const NAV = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'progress', label: 'Progress', icon: '📈' },
  { id: 'history', label: 'History', icon: '📋' },
];

// Migrate any existing localStorage data to Supabase on first login
async function migrateLocalStorage(userId) {
  if (localStorage.getItem('migrated_to_supabase')) return;

  const sessionMigrations = [];
  const prMigrations = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('lifts_')) {
      const date = key.replace('lifts_', '');
      const data = JSON.parse(localStorage.getItem(key));
      Object.entries(data).forEach(([dayId, dayData]) => {
        sessionMigrations.push({ user_id: userId, date, day_id: dayId, data: dayData });
      });
    } else if (key?.startsWith('pr_')) {
      const exerciseId = key.replace('pr_', '');
      const history = JSON.parse(localStorage.getItem(key) || '[]');
      history.forEach(entry => {
        prMigrations.push({
          user_id: userId,
          exercise_id: exerciseId,
          weight: entry.weight,
          reps: entry.reps,
          date: entry.date,
          volume: entry.volume ?? entry.weight * entry.reps,
        });
      });
    }
  }

  if (sessionMigrations.length) {
    await supabase.from('workout_sessions')
      .upsert(sessionMigrations, { onConflict: 'user_id,date,day_id', ignoreDuplicates: true });
  }
  if (prMigrations.length) {
    await supabase.from('personal_records').insert(prMigrations).catch(() => {});
  }

  localStorage.setItem('migrated_to_supabase', 'true');
}

export default function App() {
  const [view, setView] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const {
    loading: dataLoading,
    allSessions, allPRs,
    selectedDate, setSelectedDate,
    selectedDay, setSelectedDay,
    sessionData,
    updateSet, updateNotes,
    saveCurrentSession,
    getProgressData,
    getExercisePR,
  } = useWorkoutTracker(user);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      setAuthLoading(false);
      if (u) migrateLocalStorage(u.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) migrateLocalStorage(u.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStartWorkout = (day) => { setSelectedDay(day); setView('session'); };
  const handleBack = () => { setSelectedDay(null); setView('home'); };
  const handleSignOut = () => supabase.auth.signOut();

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />;
  if (authLoading) return <div className="app-loading"><span>🔒</span></div>;
  if (!user) return <AuthScreen />;
  if (dataLoading) return <div className="app-loading"><span>Loading your data...</span></div>;

  return (
    <div className="app">
      {view !== 'session' && (
        <nav className="nav-bar">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-btn ${view === n.id ? 'active' : ''}`}
              onClick={() => setView(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
          <button
            className="nav-btn"
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          >
            <span className="nav-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="nav-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </nav>
      )}

      <main className="main-content">
        {view === 'home' && (
          <Dashboard
            allSessions={allSessions}
            allPRs={allPRs}
            getExercisePR={getExercisePR}
            onStartWorkout={handleStartWorkout}
            onSignOut={handleSignOut}
            user={user}
          />
        )}
        {view === 'session' && selectedDay && (
          <WorkoutSession
            day={selectedDay}
            sessionData={sessionData}
            onUpdateSet={updateSet}
            onUpdateNotes={updateNotes}
            onSave={saveCurrentSession}
            onBack={handleBack}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            getExercisePR={getExercisePR}
          />
        )}
        {view === 'progress' && (
          <ProgressCharts getProgressData={getProgressData} />
        )}
        {view === 'history' && (
          <HistoryView allSessions={allSessions} />
        )}
      </main>
    </div>
  );
}
