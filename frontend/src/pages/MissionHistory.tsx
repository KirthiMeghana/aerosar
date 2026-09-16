const MOCK_HISTORY = [
  {
    mission: 'SR-1141 · Coastal sweep',
    sub: 'Sector 4 · 2 days ago',
    unit: 'Unit A3',
    duration: '38 min',
    outcome: '3 rescued'
  },
  {
    mission: 'SR-1138 · Ridge search',
    sub: 'Sector 2 · 4 days ago',
    unit: 'Unit B1',
    duration: '52 min',
    outcome: '1 rescued'
  },
  {
    mission: 'SR-1129 · Wildfire perimeter',
    sub: 'Sector 7 · 9 days ago',
    unit: 'Unit A3',
    duration: '1h 12m',
    outcome: '0 rescued · area mapped'
  },
  {
    mission: 'SR-1121 · Night flood check',
    sub: 'Sector 3 · 12 days ago',
    unit: 'Unit C2',
    duration: '44 min',
    outcome: '2 rescued'
  }
];

export default function MissionHistory() {
  return (
    <div className="page">
      <div className="breadcrumb">
        <span>OPERATIONS</span>
        <span className="breadcrumb__sep">›</span>
        <span className="breadcrumb__current">MISSION HISTORY</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-header__title">Mission history</h1>
          <p className="page-header__subtitle">A record of completed and past deployments across every unit.</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel__head">
          <span className="panel__title">FLIGHT RECORD</span>
        </div>
        <table className="history-table">
          <thead>
            <tr>
              <th>Mission</th>
              <th>Unit</th>
              <th>Duration</th>
              <th>Outcome</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_HISTORY.map((row) => (
              <tr key={row.mission}>
                <td>
                  <div className="history-table__mission">{row.mission}</div>
                  <div className="history-table__sub">{row.sub}</div>
                </td>
                <td>{row.unit}</td>
                <td className="mono">{row.duration}</td>
                <td>{row.outcome}</td>
                <td>
                  <span className="status-chip status-chip--complete">Complete</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div style={{ height: 16 }} />

      <section className="panel">
        <div className="panel__body placeholder-panel">
          <div className="placeholder-panel__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 21l-4.3-4.3" />
              <circle cx="11" cy="11" r="7" />
            </svg>
          </div>
          <p className="placeholder-panel__title">Search &amp; filters coming soon</p>
          <p className="placeholder-panel__desc">
            Filtering by unit, sector, date range, and outcome will land here in a future update.
          </p>
        </div>
      </section>

      <div className="footer-note">this page shows sample data — mission history isn't wired to the backend yet</div>
    </div>
  );
}
