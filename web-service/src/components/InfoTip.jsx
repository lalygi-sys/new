import React from 'react';

/**
 * @component InfoTip
 * @description Hover / focus-visible tooltip. Портированo из prototype 0e54cb9.
 *   Placement top (default) or bottom. Inline-flex — embedded inside other elements.
 * @param {ReactNode} children - tooltip body (supports JSX)
 * @param {string} [label] - aria-label (required if children not string)
 * @param {'top'|'bottom'} [placement='top']
 * @param {string} [className]
 * @a11y tabIndex=0 + role="tooltip" on bubble. Focus-visible тригерит.
 */
export const InfoTip = ({ children, label, placement = 'top', className = '' }) => (
  <span
    className={`info-tip info-tip--${placement} ${className}`}
    tabIndex={0}
    aria-label={label || (typeof children === 'string' ? children : 'Подробнее')}
  >
    <span className="info-tip__icon">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <use href="#i-info" />
      </svg>
    </span>
    <span className="info-tip__bubble" role="tooltip">{children}</span>
  </span>
);
