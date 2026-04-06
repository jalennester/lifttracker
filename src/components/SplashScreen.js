import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setLeaving(true), 1700);
    const doneTimer = setTimeout(onDone, 2300);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div className={`splash-screen${leaving ? ' splash-leaving' : ''}`}>
      <div className="splash-content">
        <span className="splash-lock">🔒</span>
        <h1 className="splash-title">LOCK IN</h1>
        <p className="splash-tagline">Track every rep. Chase every PR.</p>
      </div>
    </div>
  );
}
