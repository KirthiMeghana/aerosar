import type { MissionModel } from '../types';

function count(model: MissionModel, category: 'survivor' | 'hazard', subtype: string) {
  return model.detections.filter((d) => d.category === category && d.subtype === subtype).length;
}

function SurvivorIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 21c0-4 3-7 7-7s7 3 7 7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Tallies({ model }: { model: MissionModel }) {
  return (
    <section className="dashboard__tallies">
      <div className="tally-grid">
        <div>
          <div className="tally-section-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="7" r="3.4" />
              <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
            </svg>
            SURVIVORS
          </div>
          <div className="tile-row">
            <div className="tile tile--critical">
              <div className="tile__top">
                <span className="tile__icon"><SurvivorIcon /></span>
                <span className="tile__value">{count(model, 'survivor', 'critical')}</span>
              </div>
              <span className="tile__label">Critical</span>
            </div>
            <div className="tile tile--high">
              <div className="tile__top">
                <span className="tile__icon"><SurvivorIcon /></span>
                <span className="tile__value">{count(model, 'survivor', 'high')}</span>
              </div>
              <span className="tile__label">High</span>
            </div>
            <div className="tile tile--low">
              <div className="tile__top">
                <span className="tile__icon"><SurvivorIcon /></span>
                <span className="tile__value">{count(model, 'survivor', 'low')}</span>
              </div>
              <span className="tile__label">Low</span>
            </div>
          </div>
        </div>

        <div>
          <div className="tally-section-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2s6 5.5 6 10.5a6 6 0 1 1-12 0C6 7.5 12 2 12 2z" />
            </svg>
            HAZARDS
          </div>
          <div className="tile-row">
            <div className="tile tile--critical">
              <div className="tile__top">
                <span className="tile__icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c1 3-3 4-3 7a3 3 0 006 0c1.2 1 2 2.6 2 4.2A5.2 5.2 0 0112 18a5.2 5.2 0 01-5-5.4C7 8 12 6 12 2z" />
                  </svg>
                </span>
                <span className="tile__value">{count(model, 'hazard', 'fire')}</span>
              </div>
              <span className="tile__label">Fire zones</span>
            </div>
            <div className="tile tile--flood">
              <div className="tile__top">
                <span className="tile__icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 15c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0" />
                    <path d="M2 19c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0" />
                  </svg>
                </span>
                <span className="tile__value">{count(model, 'hazard', 'flood')}</span>
              </div>
              <span className="tile__label">Flood zone</span>
            </div>
            <div className="tile tile--structure">
              <div className="tile__top">
                <span className="tile__icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 21V9l8-5 8 5v12" />
                    <path d="M9 21v-6h6v6" />
                  </svg>
                </span>
                <span className="tile__value">{count(model, 'hazard', 'structure')}</span>
              </div>
              <span className="tile__label">Structures</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
