import React from 'react';

/**
 * @component Checkbox
 * @description Controlled checkbox with inline label.
 * @param {boolean} checked
 * @param {function} onChange - receives native change event.
 * @param {ReactNode} [label] - visible label rendered next to box.
 * @param {'m'|'s'} [size='m']
 * @a11y Native <input type="checkbox"> inside <label> — Space activation free.
 */
export const Checkbox = ({ checked, onChange, label, size = 'm' }) => (
  <label className="ds-checkbox">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="ds-checkbox-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </span>
    {label && <span>{label}</span>}
  </label>
);
