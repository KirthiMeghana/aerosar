import { useOutletContext } from 'react-router-dom';
import type { LayoutContext } from '../layouts/AppLayout';
import MissionStatusBar from '../components/MissionStatusBar';
import VideoFeed from '../components/VideoFeed';
import MapPanel from '../components/MapPanel';
import Tallies from '../components/Tallies';
import MissionAlertsPanel from '../components/MissionAlertsPanel';
import MissionLog from '../components/MissionLog';

export default function LiveOperations() {
  const { model, theme } = useOutletContext<LayoutContext>();

  return (
    <div className="page">
      <div className="breadcrumb">
        <span>OPERATIONS</span>
        <span className="breadcrumb__sep">›</span>
        <span className="breadcrumb__current">LIVE OPERATIONS</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-header__title">Live mission view</h1>
          <p className="page-header__subtitle">Real-time telemetry, detections, and mission alerts from the field.</p>
        </div>
        <div className="page-header__action">
          <MissionStatusBar model={model} />
        </div>
      </div>

      <div className="dashboard">
        <VideoFeed model={model} />
        <MapPanel model={model} theme={theme} />
        <Tallies model={model} />
        <MissionAlertsPanel model={model} />
        <MissionLog model={model} />
      </div>

      <div className="footer-note">running on simulated telemetry — set WS_URL in AppLayout.tsx to connect the real backend</div>
    </div>
  );
}
