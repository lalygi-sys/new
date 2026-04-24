import React from 'react';

/**
 * @component IconButton
 * @description Icon-only button. `title` shows tooltip, `aria-label` is exposed to SR; both default from title when aria-label omitted.
 * @props {string} icon - SVG sprite id (without i- prefix).
 * @props {'m'|'s'} [size='s']
 * @props {function} onClick
 * @props {string} title - tooltip text.
 * @props {string} [ariaLabel] - overrides title for screen readers.
 * @a11y Always renders aria-label (falls back to title) — WCAG 4.1.2.
 */
export const IconButton = ({ icon, size = 's', onClick, title, ariaLabel, className = '' }) => (
  <button
    type="button"
    className={`ds-icon-btn ds-icon-btn--${size} ${className}`}
    onClick={onClick}
    title={title}
    aria-label={ariaLabel || title}
  >
    <svg aria-hidden="true"><use href={`#i-${icon}`} /></svg>
  </button>
);
