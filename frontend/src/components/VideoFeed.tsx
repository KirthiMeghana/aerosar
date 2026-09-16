import type { MissionModel } from '../types';

export default function VideoFeed({ model }: { model: MissionModel }) {
  const { video, telemetry } = model;
  const streaming = video?.streaming ?? false;

  return (
    <section className="panel dashboard__video">
      <div className="panel__head">
        <span className="panel__title">
          <span className={`pulse-dot ${streaming ? '' : 'offline'}`} style={{ position: 'static' }} />
          LIVE VIDEO
        </span>
        {streaming && (
          <span className="rec-tag">
            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor" /></svg>
            REC
          </span>
        )}
      </div>
      <div className="panel__body">
        <div className="video-frame">
          <div className="video-frame__noise" />
          {!streaming ? (
            <div className="video-frame__placeholder">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M2 3l19 19M17 10.5l4-3v9l-4-3M14 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>No signal</span>
            </div>
          ) : (
            <div className="video-frame__placeholder">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M20 8.5l-4 2v3l4 2v-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
              <span>Feed connected · awaiting stream source</span>
            </div>
          )}

          <div className="video-frame__hud">
            <span className="hud-corner tl" />
            <span className="hud-corner tr" />
            <span className="hud-corner bl" />
            <span className="hud-corner br" />
            <div className="hud-readout top-left">
              ALT {telemetry ? telemetry.altitude.toFixed(1) : '—'}m<br />
              SPD {telemetry ? telemetry.speed.toFixed(1) : '—'}m/s
            </div>
            <div className="hud-readout top-right">
              HDG {telemetry ? Math.round(telemetry.heading).toString().padStart(3, '0') : '—'}°
            </div>
            <div className="hud-readout bottom-left">
              {telemetry ? `${telemetry.gps.lat.toFixed(5)}, ${telemetry.gps.lng.toFixed(5)}` : 'NO GPS'}
            </div>
            <div className="hud-readout bottom-right">
              {telemetry ? new Date(telemetry.timestamp).toLocaleTimeString() : '--:--:--'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
