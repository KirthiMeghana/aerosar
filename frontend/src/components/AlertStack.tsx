import { useEffect, useState } from 'react';
import type { MissionAlert } from '../types';

function AlertIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l10 18H2L12 3z" strokeLinejoin="round" />
      <path d="M12 10v4" strokeLinecap="round" />
      <circle cx="12" cy="17.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export default function AlertStack({ alerts }: { alerts: MissionAlert[] }) {
  const [visible, setVisible] = useState<MissionAlert[]>([]);

  useEffect(() => {
    if (alerts.length === 0) return;
    const latest = alerts[0];
    setVisible((v) => (v.some((a) => a.id === latest.id) ? v : [latest, ...v].slice(0, 3)));
    const timer = window.setTimeout(() => {
      setVisible((v) => v.filter((a) => a.id !== latest.id));
    }, 6000);
    return () => clearTimeout(timer);
  }, [alerts]);

  if (visible.length === 0) return null;

  return (
    <div className="alert-stack">
      {visible.map((a) => (
        <div key={a.id} className="alert-toast">
          <span className="alert-toast__icon"><AlertIcon /></span>
          <div>
            <div className="alert-toast__title">{a.message}</div>
            <div className="alert-toast__meta">{a.level.toUpperCase()} · {new Date(a.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
