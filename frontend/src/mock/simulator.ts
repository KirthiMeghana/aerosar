import type { ServerMessage } from '../types';

// Simulates the backend's WebSocket stream so the dashboard is fully demoable
// before the real drone/backend pipeline is wired up. Swap `useMissionSocket`
// to a real `ws://` URL and this is never imported.

const BASE_LAT = 26.2389;
const BASE_LNG = 73.0243;

let t = 0;
let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;

function jitter(base: number, range: number) {
  return base + (Math.random() - 0.5) * range;
}

export function startSimulator(onMessage: (msg: ServerMessage) => void): () => void {
  const missionId = `SAR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`;

  onMessage({
    type: 'mission_status',
    data: { state: 'active', elapsed_seconds: 0, mission_id: missionId }
  });
  onMessage({ type: 'video_status', data: { streaming: true } });
  onMessage({
    type: 'route',
    data: {
      points: [
        [BASE_LAT - 0.002, BASE_LNG - 0.003],
        [BASE_LAT - 0.0005, BASE_LNG - 0.0015],
        [BASE_LAT + 0.0008, BASE_LNG + 0.0006],
        [BASE_LAT + 0.0022, BASE_LNG + 0.0021]
      ]
    }
  });

  const detectionScript: { delay: number; category: 'survivor' | 'hazard'; subtype: any; note: string }[] = [
    { delay: 1200, category: 'hazard', subtype: 'fire', note: 'Active fire, structure roofline' },
    { delay: 2400, category: 'survivor', subtype: 'high', note: 'Person waving, mobile' },
    { delay: 3600, category: 'hazard', subtype: 'structure', note: 'Partial building collapse' },
    { delay: 4800, category: 'survivor', subtype: 'critical', note: 'Person motionless near fire' },
    { delay: 6200, category: 'hazard', subtype: 'flood', note: 'Standing water, road blocked' },
    { delay: 7400, category: 'survivor', subtype: 'low', note: 'Person sheltering, mobile' },
    { delay: 8600, category: 'survivor', subtype: 'critical', note: 'Person trapped under debris' },
    { delay: 9800, category: 'hazard', subtype: 'fire', note: 'Secondary fire spreading' }
  ];

  const timers: number[] = [];

  detectionScript.forEach((d) => {
    const timer = window.setTimeout(() => {
      const lat = jitter(BASE_LAT, 0.006);
      const lng = jitter(BASE_LNG, 0.006);
      onMessage({
        type: 'detection',
        data: {
          id: nextId('det'),
          category: d.category,
          subtype: d.subtype,
          lat,
          lng,
          confidence: 0.8 + Math.random() * 0.19,
          note: d.note,
          timestamp: new Date().toISOString()
        }
      });

      if (d.category === 'survivor' && d.subtype === 'critical') {
        window.setTimeout(() => {
          onMessage({
            type: 'alert',
            data: {
              id: nextId('alert'),
              level: 'critical',
              message: 'Critical survivor detected near active hazard',
              timestamp: new Date().toISOString()
            }
          });
        }, 400);
      }
    }, d.delay);
    timers.push(timer);
  });

  const telemetryInterval = window.setInterval(() => {
    t += 1;
    onMessage({
      type: 'telemetry',
      data: {
        battery: Math.max(12, 92 - t * 0.6),
        gps: { lat: jitter(BASE_LAT, 0.001), lng: jitter(BASE_LNG, 0.001), fix: true },
        altitude: 40 + Math.sin(t / 4) * 6,
        speed: 6 + Math.sin(t / 3) * 2,
        heading: (t * 7) % 360,
        connection: t % 23 === 0 ? 'degraded' : 'online',
        timestamp: new Date().toISOString()
      }
    });
  }, 1000);

  const statusInterval = window.setInterval(() => {
    onMessage({
      type: 'mission_status',
      data: { state: 'active', elapsed_seconds: t, mission_id: missionId }
    });
  }, 1000);

  return () => {
    timers.forEach(clearTimeout);
    clearInterval(telemetryInterval);
    clearInterval(statusInterval);
  };
}
