import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Detection, MissionModel } from '../types';
import type { Theme } from '../hooks/useTheme';

const COLORS: Record<string, string> = {
  critical: '#ef5b53',
  high: '#f0a63e',
  low: '#2fbf74',
  fire: '#ff6b57',
  flood: '#3fa4e0',
  structure: '#8b96ac'
};

const ICONS: Record<string, string> = {
  critical: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" fill="#0a0d10"/><path d="M6 20c0-3.5 2.7-6 6-6s6 2.5 6 6" stroke="#0a0d10" stroke-width="1.8" stroke-linecap="round"/></svg>',
  high: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" fill="#0a0d10"/><path d="M6 20c0-3.5 2.7-6 6-6s6 2.5 6 6" stroke="#0a0d10" stroke-width="1.8" stroke-linecap="round"/></svg>',
  low: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" fill="#0a0d10"/><path d="M6 20c0-3.5 2.7-6 6-6s6 2.5 6 6" stroke="#0a0d10" stroke-width="1.8" stroke-linecap="round"/></svg>',
  fire: '<svg width="11" height="11" viewBox="0 0 24 24" fill="#0a0d10"><path d="M12 2c1 3-3 4-3 7a3 3 0 006 0c1.2 1 2 2.6 2 4.2A5.2 5.2 0 0112 18a5.2 5.2 0 01-5-5.4C7 8 12 6 12 2z"/></svg>',
  flood: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0d10" stroke-width="2" stroke-linecap="round"><path d="M2 15c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0"/><path d="M2 19c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0"/></svg>',
  structure: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0a0d10" stroke-width="1.8"><path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-6h6v6"/></svg>'
};

function buildIcon(subtype: string) {
  const color = COLORS[subtype] ?? '#8b96ac';
  const svg = ICONS[subtype] ?? '';
  return L.divIcon({
    className: '',
    html: `<span class="marker-pin" style="background:${color}"><span>${svg}</span></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 21],
    popupAnchor: [0, -20]
  });
}

function buildDroneIcon(theme: Theme) {
  const accent = theme === 'dark' ? '#7c9bff' : '#5b7fff';
  const ring = theme === 'dark' ? 'rgba(124,155,255,0.28)' : 'rgba(91,127,255,0.22)';
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${accent};border:2px solid #ffffff;box-shadow:0 0 0 4px ${ring}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

function tileUrlFor(theme: Theme) {
  return theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
}

function popupHtml(d: Detection) {
  const label =
    d.category === 'survivor' ? `Survivor · ${d.subtype}` : `Hazard · ${d.subtype}`;
  return `
    <div class="popup-title">${label}</div>
    ${d.note ? `<div style="margin-bottom:4px;">${d.note}</div>` : ''}
    <div class="popup-meta">${(d.confidence * 100).toFixed(0)}% confidence · ${new Date(d.timestamp).toLocaleTimeString()}</div>
  `;
}

export default function MapPanel({ model, theme }: { model: MissionModel; theme: Theme }) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const droneMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;
    const map = L.map(mapDivRef.current, {
      zoomControl: true,
      attributionControl: true,
      center: [26.2389, 73.0243],
      zoom: 15
    });
    tileLayerRef.current = L.tileLayer(tileUrlFor(theme), {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // swap base tiles + drone marker + route color when the theme changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) tileLayerRef.current.remove();
    tileLayerRef.current = L.tileLayer(tileUrlFor(theme), {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    if (droneMarkerRef.current) droneMarkerRef.current.setIcon(buildDroneIcon(theme));

    if (routeLineRef.current && model.route) {
      routeLineRef.current.remove();
      routeLineRef.current = L.polyline(model.route.points, {
        color: theme === 'dark' ? '#57dd9a' : '#2fbf74',
        weight: 3,
        opacity: 0.85,
        dashArray: '6 6'
      }).addTo(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // detections
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const seen = new Set<string>();
    model.detections.forEach((d) => {
      seen.add(d.id);
      const existing = markersRef.current.get(d.id);
      if (existing) {
        existing.setLatLng([d.lat, d.lng]);
        existing.setPopupContent(popupHtml(d));
      } else {
        const marker = L.marker([d.lat, d.lng], { icon: buildIcon(d.subtype) })
          .bindPopup(popupHtml(d))
          .addTo(map);
        markersRef.current.set(d.id, marker);
      }
    });
    markersRef.current.forEach((marker, id) => {
      if (!seen.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [model.detections]);

  // drone position
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !model.telemetry) return;
    const pos: [number, number] = [model.telemetry.gps.lat, model.telemetry.gps.lng];
    if (!droneMarkerRef.current) {
      droneMarkerRef.current = L.marker(pos, { icon: buildDroneIcon(theme), zIndexOffset: 1000 }).addTo(map);
      map.panTo(pos, { animate: true });
    } else {
      droneMarkerRef.current.setLatLng(pos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.telemetry]);

  // safe route
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !model.route) return;
    if (routeLineRef.current) routeLineRef.current.remove();
    routeLineRef.current = L.polyline(model.route.points, {
      color: theme === 'dark' ? '#57dd9a' : '#2fbf74',
      weight: 3,
      opacity: 0.85,
      dashArray: '6 6'
    }).addTo(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.route]);

  return (
    <section className="panel dashboard__map">
      <div className="panel__head">
        <span className="panel__title">
          <span className="pulse-dot" style={{ position: 'static' }} />
          LIVE MAP
        </span>
        <span className="stat-pill__label mono">{model.detections.length} DETECTIONS</span>
      </div>
      <div className="panel__body">
        <div ref={mapDivRef} style={{ height: '100%', width: '100%' }} />
        <div className="map-legend">
          <div className="map-legend__item"><span className="legend-dot" style={{ background: COLORS.critical }} /> Critical survivor</div>
          <div className="map-legend__item"><span className="legend-dot" style={{ background: COLORS.high }} /> High priority</div>
          <div className="map-legend__item"><span className="legend-dot" style={{ background: COLORS.low }} /> Low priority</div>
          <div className="map-legend__item"><span className="legend-dot" style={{ background: COLORS.fire }} /> Fire hazard</div>
          <div className="map-legend__item"><span className="legend-dot" style={{ background: COLORS.flood }} /> Flood</div>
          <div className="map-legend__item"><span className="legend-dot" style={{ background: COLORS.low }} /> Safe route</div>
        </div>
      </div>
    </section>
  );
}
