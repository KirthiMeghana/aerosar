import type { MissionModel } from '../types';

type LogEntry = { id: string; time: string; kind: string; text: string };

export default function MissionLog({ model }: { model: MissionModel }) {
  const entries: LogEntry[] = [
    ...model.detections.map((d) => ({
      id: d.id,
      time: d.timestamp,
      kind: d.subtype,
      text: d.note ?? `${d.category === 'survivor' ? 'Survivor' : 'Hazard'} detected (${d.subtype})`
    })),
    ...model.alerts.map((a) => ({ id: a.id, time: a.timestamp, kind: a.level, text: a.message }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <section className="panel dashboard__log">
      <div className="panel__head">
        <span className="panel__title">MISSION LOG</span>
        <span className="stat-pill__label mono">{entries.length} EVENTS</span>
      </div>
      <div className="panel__body">
        {entries.length === 0 ? (
          <div className="empty-state">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4h16v16H4z" opacity="0" />
              <path d="M6 8h12M6 12h12M6 16h8" strokeLinecap="round" />
            </svg>
            <span>No events yet — log fills in as the drone reports detections</span>
          </div>
        ) : (
          <div className="log-list scrollbar-thin">
            {entries.map((e) => (
              <div key={e.id + e.time} className="log-row">
                <span className="log-row__time">{new Date(e.time).toLocaleTimeString()}</span>
                <span className={`tag ${e.kind}`}>{e.kind}</span>
                <span>{e.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
