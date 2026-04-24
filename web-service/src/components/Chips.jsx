import React from 'react';

/**
 * @component Chips
 * @description Filter chip — native <button> with aria-pressed for toggle semantic.
 * @props {string} label
 * @props {boolean} selected
 * @props {function} onClick
 * @props {'s'} [size]
 * @a11y Native <button> + aria-pressed=selected; keyboard activation free via native button behavior.
 */
export const Chips = ({ label, selected, onClick, size }) => (
  <button
    type="button"
    className={`ds-chip ${selected ? 'ds-chip--selected' : ''} ${size ? `ds-chip--${size}` : ''}`}
    onClick={onClick}
    aria-pressed={!!selected}
  >
    {label}
  </button>
);

/**
 * @component ChipsGroup
 * @description Flex container for <Chips /> — handles wrap + gap.
 */
export const ChipsGroup = ({ children }) => <div className="ds-chips-group">{children}</div>;
