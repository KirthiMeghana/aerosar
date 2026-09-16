import { useOutletContext } from 'react-router-dom';
import type { LayoutContext } from '../layouts/AppLayout';
import type { SurvivorSubtype } from '../types';

const SEVERITY_LABEL: Record<SurvivorSubtype, string> = { critical: 'Critical', high: 'High', low: 'Stable' };
const SEVERITY_ORDER: Record<SurvivorSubtype, number> = { critical: 0, high: 1, low: 2 };
const SEVERITY_CLASS: Record<SurvivorSubtype, string> = { critical: 'critical', high: 'high', low: 'low' };

export default function StandaloneView() {
  const { model } = useOutletContext<LayoutContext>();
  const { telemetry, missionStatus, detections } = model;

  const survivors = detections
    .filter((d) => d.category === 'survivor')
    .sort((a, b) => SEVERITY_ORDER[a.subtype as SurvivorSubtype] - SEVERITY_ORDER[b.subtype as SurvivorSubtype]);
  const hazards = detections.filter((d) => d.category === 'hazard');

  const elapsed = missionStatus?.elapsed_seconds ?? 0;
  const progress = Math.min(96, Math.round(elapsed / 3 + survivors.length * 6));

  const fireCount = hazards.filter((d) => d.subtype === 'fire').length;
  const floodCount = hazards.filter((d) => d.subtype === 'flood').length;
  const structureCount = hazards.filter((d) => d.subtype === 'structure').length;

  return (
    <div className="page">
      <div className="breadcrumb">
        <span>OPERATIONS</span>
        <span className="breadcrumb__sep">›</span>
        <span className="breadcrumb__current">STANDALONE VIEW</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-header__title">Standalone mission view</h1>
          <p className="page-header__subtitle">A focused display for field operators and external monitors.</p>
        </div>
        <div className="page-header__action">
          <span className="pill">
            <span className="legend-dot" style={{ background: 'var(--signal)' }} /> Public mission channel
          </span>
        </div>
      </div>

      <div className="hero">
        <div>
          <div className="hero__eyebrow">Active response window</div>
          <h2 className="hero__title">{missionStatus ? 'Flood response — Sector 7' : 'Awaiting mission —'}</h2>
          <p className="hero__subtitle">Mapping safe access while tracking survivor signals in the field.</p>
        </div>
        <div className="hero__meta">
          <span className="hero__badge">
            <span className="legend-dot" style={{ background: 'var(--signal)' }} /> LIVE
          </span>
          <span className="hero__badge-id mono">{missionStatus?.mission_id ?? '—'}</span>
        </div>
      </div>

      <div className="two-col">
        <section className="panel">
          <div className="panel__head">
            <span className="panel__eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19V5M4 19h16M9 19V9M14 19v-6M19 19V7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              MISSION PROGRESS
            </span>
          </div>
          <div className="panel__body panel__body--padded">
            <h3 className="panel__heading" style={{ marginBottom: 16 }}>
              Response completion
            </h3>
            <div className="progress-figure">{progress}%</div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '14px 0 0' }}>
              Estimated based on elapsed mission time and survivors located.
            </p>
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <span className="panel__eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M2 12h20" strokeLinecap="round" />
              </svg>
              FIELD STATUS
            </span>
          </div>
          <div className="panel__body panel__body--padded">
            <h3 className="panel__heading" style={{ marginBottom: 16 }}>
              Current conditions
            </h3>
            <div className="conditions-grid">
              <div className="condition-tile">
                <span className="condition-tile__value">{telemetry ? `${Math.round(telemetry.battery)}%` : '—'}</span>
                <span className="condition-tile__label">Battery</span>
              </div>
              <div className="condition-tile">
                <span className="condition-tile__value">{survivors.length}</span>
                <span className="condition-tile__label">Located</span>
              </div>
              <div className="condition-tile">
                <span className="condition-tile__value">{hazards.length}</span>
                <span className="condition-tile__label">Hazards</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="two-col" style={{ marginTop: 16 }}>
        <section className="panel">
          <div className="panel__head">
            <span className="panel__title">PRIORITY QUEUE · SURVIVORS</span>
          </div>
          <div className="panel__body panel__body--padded">
            {survivors.length === 0 ? (
              <div className="empty-state">
                <span>No survivors located yet</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {survivors.slice(0, 6).map((s, i) => (
                  <div key={s.id} className={`alert-row alert-row--${SEVERITY_CLASS[s.subtype as SurvivorSubtype]}`}>
                    <span className="alert-row__dot" />
                    <div className="alert-row__body">
                      <p className="alert-row__title">
                        S-0{i + 1} · {SEVERITY_LABEL[s.subtype as SurvivorSubtype]}
                      </p>
                      <p className="alert-row__meta">{s.note ?? 'Survivor detected'}</p>
                    </div>
                    <span className="alert-row__time mono">{(s.confidence * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <span className="panel__title">AREA ASSESSMENT · HAZARDS</span>
          </div>
          <div className="panel__body panel__body--padded">
            <div className="tile-row">
              <div className="tile tile--critical">
                <div className="tile__top">
                  <span className="tile__value">{fireCount}</span>
                </div>
                <span className="tile__label">Fire zones</span>
              </div>
              <div className="tile tile--flood">
                <div className="tile__top">
                  <span className="tile__value">{floodCount}</span>
                </div>
                <span className="tile__label">Flood zone</span>
              </div>
              <div className="tile tile--structure">
                <div className="tile__top">
                  <span className="tile__value">{structureCount}</span>
                </div>
                <span className="tile__label">Structures</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="footer-note">public read-only view · running on simulated telemetry</div>
    </div>
  );
}
