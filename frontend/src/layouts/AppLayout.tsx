import { Outlet } from 'react-router-dom';
import { useMissionSocket } from '../hooks/useMissionSocket';
import { useTheme } from '../hooks/useTheme';
import NavHeader from '../components/NavHeader';
import AlertStack from '../components/AlertStack';
import type { MissionModel } from '../types';
import type { Theme } from '../hooks/useTheme';

// Set this to your backend's real WebSocket URL when it's ready, e.g.
// 'ws://localhost:8000/ws'. Leave it null to run against the built-in
// simulator so the UI is demoable standalone.
const WS_URL: string | null = null;

export type LayoutContext = { model: MissionModel; theme: Theme };

export default function AppLayout() {
  const model = useMissionSocket(WS_URL);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <NavHeader theme={theme} onToggleTheme={toggleTheme} />
      <AlertStack alerts={model.alerts} />
      <Outlet context={{ model, theme } satisfies LayoutContext} />
    </div>
  );
}
