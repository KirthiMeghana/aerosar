import { useEffect, useRef, useState } from 'react';
import type { MissionModel, ServerMessage, ConnectionState } from '../types';
import { startSimulator } from '../mock/simulator';

const MAX_ALERTS = 20;
const MAX_LOG = 60;

const initialModel: MissionModel = {
  telemetry: null,
  detections: [],
  alerts: [],
  missionStatus: null,
  route: null,
  video: null,
  socketState: 'connecting'
};

function applyMessage(model: MissionModel, msg: ServerMessage): MissionModel {
  switch (msg.type) {
    case 'telemetry':
      return { ...model, telemetry: msg.data };
    case 'detection': {
      const existingIdx = model.detections.findIndex((d) => d.id === msg.data.id);
      const detections = [...model.detections];
      if (existingIdx >= 0) detections[existingIdx] = msg.data;
      else detections.push(msg.data);
      return { ...model, detections: detections.slice(-MAX_LOG) };
    }
    case 'alert':
      return { ...model, alerts: [msg.data, ...model.alerts].slice(0, MAX_ALERTS) };
    case 'mission_status':
      return { ...model, missionStatus: msg.data };
    case 'route':
      return { ...model, route: msg.data };
    case 'video_status':
      return { ...model, video: msg.data };
    default:
      return model;
  }
}

/**
 * Connects to `wsUrl`. If `wsUrl` is null/empty, falls back to the in-browser
 * simulator so the dashboard is demoable standalone. Point this at your
 * teammate's real WebSocket endpoint (see WS_CONTRACT.md) when it's ready.
 */
export function useMissionSocket(wsUrl: string | null) {
  const [model, setModel] = useState<MissionModel>(initialModel);
  const socketRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let stopSimulator: (() => void) | null = null;

    if (!wsUrl) {
      setModel((m) => ({ ...m, socketState: 'online' }));
      stopSimulator = startSimulator((msg) => {
        if (!cancelled) setModel((m) => applyMessage(m, msg));
      });
      return () => {
        cancelled = true;
        stopSimulator?.();
      };
    }

    function connect() {
      setModel((m) => ({ ...m, socketState: 'connecting' as ConnectionState }));
      const ws = new WebSocket(wsUrl!);
      socketRef.current = ws;

      ws.onopen = () => {
        if (cancelled) return;
        setModel((m) => ({ ...m, socketState: 'online' }));
      };
      ws.onmessage = (event) => {
        if (cancelled) return;
        try {
          const parsed: ServerMessage = JSON.parse(event.data);
          setModel((m) => applyMessage(m, parsed));
        } catch (err) {
          console.error('Malformed WS message', err);
        }
      };
      ws.onclose = () => {
        if (cancelled) return;
        setModel((m) => ({ ...m, socketState: 'offline' }));
        retryRef.current = window.setTimeout(connect, 3000);
      };
      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      cancelled = true;
      if (retryRef.current) clearTimeout(retryRef.current);
      socketRef.current?.close();
    };
  }, [wsUrl]);

  return model;
}
