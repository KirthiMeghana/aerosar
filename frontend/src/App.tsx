import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import LiveOperations from './pages/LiveOperations';
import MissionSetup from './pages/MissionSetup';
import MissionHistory from './pages/MissionHistory';
import StandaloneView from './pages/StandaloneView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<LiveOperations />} />
          <Route path="mission-setup" element={<MissionSetup />} />
          <Route path="mission-history" element={<MissionHistory />} />
          <Route path="standalone" element={<StandaloneView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
