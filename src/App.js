import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutSession from './components/WorkoutSession';
import ProgressCharts from './components/ProgressCharts';
import HistoryView from './components/HistoryView';
import SplashScreen from './components/SplashScreen';
import { useWorkoutTracker } from './hooks/useWorkoutTracker';
import './App.css';

const NAV = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'progress', label: 'Progress', icon: '📈' },
  { id: 'history', label: 'History', icon: '📋' },
];

export default function App() {
  const [view, setView] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const {
    selectedDate, setSelectedDate,
    selectedDay, setSelectedDay,
    sessionData,
    updateSet, updateNotes,
    saveCurrentSession,
    getProgressData,
    loadAllSessions,
  } = useWorkoutTracker();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleStartWorkout = (day) => {
    setSelectedDay(day);
    setView('session');
  };

  const handleBack = () => {
    setSelectedDay(null);
    setView('home');
  };

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

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
            title="Toggle theme"
          >
            <span className="nav-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="nav-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </nav>
      )}

      <main className="main-content">
        {view === 'home' && (
          <Dashboard onStartWorkout={handleStartWorkout} />
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
          />
        )}
        {view === 'progress' && (
          <ProgressCharts getProgressData={getProgressData} />
        )}
        {view === 'history' && (
          <HistoryView loadAllSessions={loadAllSessions} />
        )}
      </main>
    </div>
  );
}
