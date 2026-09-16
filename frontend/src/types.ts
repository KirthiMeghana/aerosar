export type ConnectionState = 'online' | 'degraded' | 'offline' | 'connecting';

export interface Telemetry {
  battery: number;
  gps: { lat: number; lng: number; fix: boolean };
  altitude: number;
  speed: number;
  heading: number;
  connection: ConnectionState;
  timestamp: string;
}

export type SurvivorSubtype = 'critical' | 'high' | 'low';
export type HazardSubtype = 'fire' | 'flood' | 'structure';

export interface Detection {
  id: string;
  category: 'survivor' | 'hazard';
  subtype: SurvivorSubtype | HazardSubtype;
  lat: number;
  lng: number;
  confidence: number;
  note?: string;
  timestamp: string;
}

export type AlertLevel = 'critical' | 'warning' | 'info';

export interface MissionAlert {
  id: string;
  level: AlertLevel;
  message: string;
  timestamp: string;
}

export type MissionState = 'idle' | 'active' | 'returning' | 'completed' | 'aborted';

export interface MissionStatus {
  state: MissionState;
  elapsed_seconds: number;
  mission_id: string;
}

export interface RouteData {
  points: [number, number][];
}

export interface VideoStatus {
  streaming: boolean;
  url?: string;
}

export interface MissionModel {
  telemetry: Telemetry | null;
  detections: Detection[];
  alerts: MissionAlert[];
  missionStatus: MissionStatus | null;
  route: RouteData | null;
  video: VideoStatus | null;
  socketState: ConnectionState;
}

export type ServerMessage =
  | { type: 'telemetry'; data: Telemetry }
  | { type: 'detection'; data: Detection }
  | { type: 'alert'; data: MissionAlert }
  | { type: 'mission_status'; data: MissionStatus }
  | { type: 'route'; data: RouteData }
  | { type: 'video_status'; data: VideoStatus };
