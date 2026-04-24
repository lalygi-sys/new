import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * @component TopNav
 * @description Main nav showing role switcher (IB / Client / Admin). Uses NavLink so active role tracks URL.
 * @a11y nav landmark; active role marked через aria-current="page" автоматически NavLink.
 * @octa logo placeholder "D" pending B4.1 replacement.
 */
const ROLES = [
  { key: 'ib', label: 'IB Partner', path: '/ib/contests', testId: 'nav-ib-partner' },
  { key: 'client', label: 'Client', path: '/client/contests', testId: 'nav-client' },
  { key: 'admin', label: 'Admin', path: '/admin', testId: 'nav-admin' },
];

export const TopNav = () => (
  <nav className="topnav" role="navigation" aria-label="Роли">
    <div className="topnav__logo" aria-hidden="true"><span className="topnav__logo-mark">D</span></div>
    <div className="topnav__links-wrap">
      <div className="topnav__links" role="tablist" aria-label="Выбор роли">
        {ROLES.map(r => (
          <NavLink
            key={r.key}
            to={r.path}
            role="tab"
            data-testid={r.testId}
            className={({ isActive }) => `topnav__link ${isActive ? 'topnav__link--active' : ''}`}
          >
            {({ isActive }) => (
              <span
                aria-selected={isActive ? 'true' : 'false'}
                aria-current={isActive ? 'page' : undefined}
              >
                {r.label}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  </nav>
);
