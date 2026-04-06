import { useState, useEffect, useRef } from 'react';

export default function RestTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [preset, setPreset] = useState(90);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setRunning(false);
            // Play a beep
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              [0, 0.15, 0.3].forEach(offset => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 880;
                gain.gain.setValueAtTime(0.3, ctx.currentTime + offset);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.1);
                osc.start(ctx.currentTime + offset);
                osc.stop(ctx.currentTime + offset + 0.1);
              });
            } catch (e) {}
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const start = (secs) => {
    setSeconds(secs || preset);
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
    setSeconds(0);
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = running ? (seconds / preset) * 100 : 0;

  return (
    <div className="rest-timer">
      <div className="timer-label">Rest Timer</div>
      <div className="timer-ring-wrap">
        <svg viewBox="0 0 80 80" className="timer-ring">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="34" fill="none"
            stroke={seconds < 10 && running ? '#e63946' : '#4cc9f0'}
            strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
          />
        </svg>
        <div className="timer-display">
          {running || seconds > 0
            ? `${mins}:${String(secs).padStart(2, '0')}`
            : `${Math.floor(preset / 60)}:${String(preset % 60).padStart(2, '0')}`
          }
        </div>
      </div>
      <div className="timer-presets">
        {[60, 90, 120, 180].map(s => (
          <button
            key={s}
            className={`preset-btn ${preset === s ? 'active' : ''}`}
            onClick={() => { setPreset(s); if (!running) setSeconds(0); }}
          >
            {s < 60 ? `${s}s` : `${s / 60}m`}
          </button>
        ))}
      </div>
      <div className="timer-controls">
        {!running ? (
          <button className="timer-btn start" onClick={() => start()}>
            {seconds > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button className="timer-btn pause" onClick={() => setRunning(false)}>Pause</button>
        )}
        <button className="timer-btn reset" onClick={stop}>Reset</button>
      </div>
    </div>
  );
}
