# AeroSAR — WebSocket Message Contract

Both frontends (React and vanilla) connect to a single WebSocket endpoint and
expect JSON text frames shaped like this:

```json
{ "type": "<message_type>", "data": { ... } }
```

Send whichever messages are relevant, whenever they change — the frontend
does not poll, it just reacts to whatever arrives. Every message type below
is optional; the UI degrades gracefully (shows "—" / "no signal") if a
category never arrives.

## 1. `telemetry` — drone status, sent on every change or on an interval (e.g. 1s)
```json
{
  "type": "telemetry",
  "data": {
    "battery": 76,                 // 0-100
    "gps": { "lat": 26.2389, "lng": 73.0243, "fix": true },
    "altitude": 42.5,              // meters
    "speed": 8.2,                  // m/s
    "heading": 128,                // degrees, 0 = north
    "connection": "online",        // "online" | "degraded" | "offline"
    "timestamp": "2026-09-14T10:15:00Z"
  }
}
```

## 2. `detection` — a new survivor or hazard spotted by the drone
```json
{
  "type": "detection",
  "data": {
    "id": "det-0192",
    "category": "survivor",        // "survivor" | "hazard"
    "subtype": "critical",         // survivor: "critical" | "high" | "low"
                                    // hazard: "fire" | "flood" | "structure"
    "lat": 26.2391,
    "lng": 73.0247,
    "confidence": 0.92,
    "note": "Person, motionless, near collapsed wall",
    "timestamp": "2026-09-14T10:15:04Z"
  }
}
```
Send one `detection` message per new object found. To update an existing
one (e.g. survivor status changes), send it again with the same `id`.

## 3. `alert` — a critical event the operator must notice immediately
```json
{
  "type": "alert",
  "data": {
    "id": "alert-04",
    "level": "critical",           // "critical" | "warning" | "info"
    "message": "Survivor near active fire",
    "timestamp": "2026-09-14T10:15:05Z"
  }
}
```

## 4. `mission_status`
```json
{
  "type": "mission_status",
  "data": {
    "state": "active",             // "idle" | "active" | "returning" | "completed" | "aborted"
    "elapsed_seconds": 342,
    "mission_id": "SAR-2026-0914-01"
  }
}
```

## 5. `route` — safe route for ground rescue teams to follow
```json
{
  "type": "route",
  "data": {
    "points": [[26.2389, 73.0243], [26.2390, 73.0246], [26.2393, 73.0250]]
  }
}
```

## 6. `video_status` — tells the UI whether/where a live feed is available
```json
{
  "type": "video_status",
  "data": { "streaming": true, "url": "https://.../stream.m3u8" }
}
```
If you don't have real video piping yet, just send `"streaming": false` and
the UI shows a "no signal" placeholder — it won't crash.

---

### Notes for the backend teammate
- Reconnection: the frontend auto-retries the socket every 3s if it drops —
  you don't need to handle reconnection logic on your end, just accept new
  connections.
- Coordinate order is always `lat, lng` (not GeoJSON's `lng, lat`).
- Timestamps: ISO-8601 strings, UTC preferred.
- Nothing needs to be sent in a particular order except that `telemetry`
  should ideally arrive at least once early on so the header isn't empty.
