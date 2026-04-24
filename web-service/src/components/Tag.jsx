import React from 'react';

/**
 * @component Tag
 * @description Pill-style status/label chip (non-interactive). Semantic variants map to sentiment tokens.
 * @param {string} label - tag text.
 * @param {'neutral'|'positive'|'negative'|'warning'|'brand'|'info'|'inactive'} [variant='neutral']
 * @param {string} [icon] - leading sprite id (без i- prefix).
 * @a11y Rendered as <span> — if status communicates meaningful state change live, wrap caller in aria-live.
 * @octa see Components library → Tag.
 */
export const Tag = React.memo(({ label, variant = 'neutral', icon }) => (
  <span className={`ds-tag ds-tag--${variant}`}>
    {icon && <svg><use href={`#i-${icon}`} /></svg>}
    {label}
  </span>
));
