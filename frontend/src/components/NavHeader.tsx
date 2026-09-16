import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { Theme } from '../hooks/useTheme';
import { SparkleIcon, PulseIcon, SlidersIcon, ClockIcon, GlobeIcon, HamburgerIcon, SunIcon, MoonIcon } from './icons';

const NAV_ITEMS = [
  { to: '/', label: 'Live operations', icon: <PulseIcon />, end: true },
  { to: '/mission-setup', label: 'Mission setup', icon: <SlidersIcon /> },
  { to: '/mission-history', label: 'Mission history', icon: <ClockIcon /> },
  { to: '/standalone', label: 'Standalone view', icon: <GlobeIcon /> }
];

export default function NavHeader({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="nav">
        <div className="nav__brand">
          <div className="nav__brand-mark">
            <SparkleIcon />
          </div>
          <div>
            <div className="nav__brand-title">
              Aero<span>SAR</span>
            </div>
            <div className="nav__brand-subtitle">Autonomous response systems</div>
          </div>
        </div>

        <nav className="nav__links">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'nav__link' + (isActive ? ' is-active' : '')}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__right">
          <div className="nav__status">
            <span className="legend-dot" style={{ background: 'var(--signal)' }} />
            <span className="nav__status-label">Network nominal</span>
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title="Toggle theme"
          >
            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
          <div className="nav__avatar" title="Operator">
            OP
          </div>
          <button
            className="nav__menu-toggle"
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <HamburgerIcon />
          </button>
        </div>
      </header>

      <nav className={'nav__mobile-links' + (menuOpen ? ' is-open' : '')}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => 'nav__link' + (isActive ? ' is-active' : '')}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
