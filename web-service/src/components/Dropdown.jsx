import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon.jsx';

/**
 * @component Dropdown (Select)
 * @description DS Input trigger + options popover. Portированo из prototype/index-octa.html 0e54cb9.
 *   Better UX чем native <select>: custom styling, hover states, selected marker, keyboard-friendly.
 * @param {string} label
 * @param {string|number} value
 * @param {(value) => void} onChange
 * @param {Array<{value, label}>} options
 * @param {string} [placeholder]
 * @param {string} [description]
 * @param {string} [error]
 * @param {string} [leftIcon] - sprite id
 * @a11y click outside closes; value trigger focusable via native button.
 */
export const Dropdown = ({ label, value, onChange, options = [], placeholder, description, error, leftIcon }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="ds-dropdown-wrap">
      {label && <label className="ds-input-label">{label}</label>}
      <button
        type="button"
        className={`ds-input-field ds-input-field--button ${error ? 'ds-input-field--error' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {leftIcon && <span className="ds-input-icon ds-input-icon--left"><Icon name={leftIcon} size="sm" /></span>}
        <span className={`ds-input-value ${!selected ? 'ds-input-value--placeholder' : ''}`}>
          {selected ? selected.label : (placeholder || '')}
        </span>
        <span className="ds-input-icon ds-input-icon--right"><Icon name="chevron-down" size="sm" /></span>
      </button>
      {error && <div className="ds-input-error">{error}</div>}
      {description && !error && <div className="ds-input-desc">{description}</div>}
      {open && (
        <div className="ds-dropdown" role="listbox">
          {options.map(opt => (
            <div
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`ds-dropdown__option ${opt.value === value ? 'ds-dropdown__option--selected' : ''}`}
              onClick={() => { onChange && onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
