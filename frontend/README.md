# AeroSAR Mission Control — React + TypeScript + Leaflet + WebSocket

A real-time dashboard for an autonomous SAR drone: live video panel, live map
(survivor/hazard markers + safe route + drone position), survivor/hazard
tallies, critical alerts, and a mission event log.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL. It runs immediately against a **built-in
simulator** — no backend needed — so you can demo it right now. Detections,
alerts, and telemetry stream in over ~10 seconds on load.

## Connecting the real backend

Open `src/App.tsx` and set:

```ts
const WS_URL: string | null = 'ws://localhost:8000/ws'; // your teammate's endpoint
```

That's it — the simulator is skipped and the dashboard renders whatever your
backend sends. See **`../WS_CONTRACT.md`** for the exact JSON message shapes
the backend should emit (`telemetry`, `detection`, `alert`, `mission_status`,
`route`, `video_status`). Give that file to your backend teammate — it's the
whole API contract between your two halves of the project.

## Where things live

- `src/types.ts` — shared TypeScript types / the WS message contract
- `src/hooks/useMissionSocket.ts` — connects the socket, reduces incoming
  messages into one state object, falls back to the simulator when `WS_URL`
  is null, auto-reconnects every 3s if the socket drops
- `src/mock/simulator.ts` — the demo data generator (not used once a real
  `WS_URL` is set)
- `src/components/` — `Header`, `VideoFeed`, `MapPanel`, `Tallies`,
  `AlertStack`, `MissionLog`
- `src/index.css` — all design tokens (colors, type, spacing) and layout

## Wiring real video

`VideoFeed.tsx` currently shows a HUD-styled placeholder. When you have a
real stream (WebRTC, HLS, or an MJPEG endpoint), drop it into the
`.video-frame` div in place of the placeholder — the HUD overlay (altitude,
speed, heading, GPS, timestamp) is already layered on top of the frame with
`position: absolute`, so it'll sit above whatever video element you use.

## Notes

- Built with plain Leaflet (not `react-leaflet`) directly against a ref, so
  you have full control over marker/layer lifecycle.
- Map tiles are CARTO's dark basemap (free, no API key) — swap the
  `tileLayer` URL in `MapPanel.tsx` if you'd rather use something else.
- Responsive down to mobile: the video/map/tally grid stacks into a single
  column under ~980px.
