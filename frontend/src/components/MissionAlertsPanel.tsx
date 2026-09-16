import { useState } from 'react';
import type { MissionModel, AlertLevel } from '../types';
import { CheckIcon, WarningIcon } from './icons';

function severityClass(level: AlertLevel | string) {
  if (level === 'critical') return 'critical';
  if (level === 'warning') return 'high';
  if (level === 'info') return 'low';
  return 'neutral';
}

export default function MissionAlertsPanel({ model }: { model: MissionModel }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = model.alerts.filter((a) => !dismissed.has(a.id)).slice(0, 6);

  return (
    <section className="panel dashboard__alerts">
      <div className="panel__head">
        <span className="panel__eyebrow">
          <WarningIcon />
          ACTION REQUIRED
        </span>
      </div>
      <div className="panel__body panel__body--padded">
        <h2 className="panel__heading" style={{ marginBottom: 12 }}>
          Mission alerts
        </h2>

        {visible.length === 0 ? (
          <div className="empty-state">
            <WarningIcon size={26} />
            <strong>All clear</strong>
            <span>Mission alerts will appear here as the drone reports them.</span>
          </div>
        ) : (
          <div className="alert-list">
            {visible.map((a) => (
              <div key={a.id} className={`alert-row alert-row--${severityClass(a.level)}`}>
                <span className="alert-row__dot" />
                <div className="alert-row__body">
                  <p className="alert-row__title">{a.message}</p>
                  <p className="alert-row__meta">{a.level.toUpperCase()} severity</p>
                </div>
                <span className="alert-row__time">
                  {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button
                  className="alert-row__ack"
                  type="button"
                  aria-label="Acknowledge alert"
                  onClick={() => setDismissed((prev) => new Set(prev).add(a.id))}
                >
                  <CheckIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
