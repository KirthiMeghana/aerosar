import type { MissionModel } from '../types';
import { BatteryIcon, SignalIcon, GpsIcon } from './icons';

function formatElapsed(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function MissionStatusBar({ model }: { model: MissionModel }) {
  const { telemetry, missionStatus, socketState } = model;
  const connState = telemetry?.connection ?? (socketState === 'connecting' ? 'offline' : socketState);
  const stateClass =
    connState === 'online' ? 'state-online' : connState === 'degraded' ? 'state-degraded' : 'state-offline';

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <div className="stat-pill">
        <span className="pulse-dot" />
        <span className="stat-pill__label">MISSION</span>
        <span className="stat-pill__value mono">
          {missionStatus ? `${missionStatus.mission_id} · ${missionStatus.state.toUpperCase()}` : 'AWAITING MISSION'}
        </span>
      </div>

      <div className="stat-pill">
        <span className="pulse-dot" style={{ marginRight: 1 }} />
        <span className="stat-pill__label">MISSION TIME</span>
        <span className="stat-pill__value mono">{formatElapsed(missionStatus?.elapsed_seconds ?? 0)}</span>
      </div>

      <div className={`stat-pill ${stateClass}`}>
        <span className="stat-pill__icon">
          <SignalIcon />
        </span>
        <span className="stat-pill__label">LINK</span>
        <span className="stat-pill__value mono">{connState.toUpperCase()}</span>
      </div>

      <div className="stat-pill">
        <span className="stat-pill__icon">
          <GpsIcon />
        </span>
        <span className="stat-pill__label">GPS</span>
        <span className="stat-pill__value mono">{telemetry?.gps.fix ? 'FIX' : 'NO FIX'}</span>
      </div>

      <div className="stat-pill">
        <span className="stat-pill__icon" style={{ color: (telemetry?.battery ?? 100) < 25 ? 'var(--critical)' : undefined }}>
          <BatteryIcon level={telemetry?.battery ?? 100} />
        </span>
        <span className="stat-pill__label">BATTERY</span>
        <span className="stat-pill__value mono">{telemetry ? `${Math.round(telemetry.battery)}%` : '—'}</span>
      </div>
    </div>
  );
}
