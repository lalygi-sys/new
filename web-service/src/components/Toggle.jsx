import React from 'react';

/**
 * @component Toggle
 * @description Controlled on/off switch rendered as a styled checkbox.
 * @param {boolean} checked
 * @param {function} onChange - receives native change event.
 * @param {'m'|'s'} [size='m']
 * @a11y Native <input type="checkbox"> inside <label> — Space toggles, state exposed via checked.
 */
export const Toggle = ({ checked, onChange, size = 'm' }) => (
  <label className={`ds-toggle ds-toggle--${size}`}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="ds-toggle-track"><span className="ds-toggle-thumb" /></span>
  </label>
);
