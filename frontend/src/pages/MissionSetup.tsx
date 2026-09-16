export default function MissionSetup() {
  return (
    <div className="page">
      <div className="breadcrumb">
        <span>OPERATIONS</span>
        <span className="breadcrumb__sep">›</span>
        <span className="breadcrumb__current">MISSION SETUP</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-header__title">Mission setup</h1>
          <p className="page-header__subtitle">Configure a new deployment before handing it off to the field unit.</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel__head">
          <span className="panel__title">NEW MISSION · DRAFT</span>
        </div>
        <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
          <div className="form-field">
            <label htmlFor="fMissionName">Mission name</label>
            <input id="fMissionName" type="text" placeholder="e.g. Flood response — Sector 7" />
          </div>
          <div className="form-field">
            <label htmlFor="fUnit">Assigned unit</label>
            <select id="fUnit" defaultValue="Unit A3">
              <option>Unit A3</option>
              <option>Unit B1</option>
              <option>Unit C2</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="fSector">Sector / area</label>
            <input id="fSector" type="text" placeholder="e.g. Sector 7-B" />
          </div>
          <div className="form-field">
            <label htmlFor="fPriority">Priority level</label>
            <select id="fPriority" defaultValue="Standard">
              <option>Standard</option>
              <option>Elevated</option>
              <option>Critical</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn--primary" type="button" disabled>
              Launch mission
            </button>
            <button className="btn btn--ghost" type="button" disabled>
              Save as draft
            </button>
          </div>
        </form>
      </section>

      <div style={{ height: 16 }} />

      <section className="panel">
        <div className="panel__body placeholder-panel">
          <div className="placeholder-panel__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M8 2v4M16 2v4M3 10h18" />
            </svg>
          </div>
          <p className="placeholder-panel__title">Fleet scheduling is coming soon</p>
          <p className="placeholder-panel__desc">
            Assigning launch windows, flight paths, and backup units to a mission will land here in a future update.
          </p>
        </div>
      </section>

      <div className="footer-note">this page is a preview — mission setup isn't wired to the backend yet</div>
    </div>
  );
}
