import React from 'react';
import { onKeyActivate } from '../lib/helpers.js';

/**
 * @component RadioCard
 * @description Selectable card acting as a radio option в radiogroup (WCAG 4.1.2). Enter/Space selects, Tab moves focus.
 * @props {boolean} selected
 * @props {function} onSelect - called when user clicks or presses Enter/Space.
 * @props {string} label - SR-exposed label; visible children are the rich card body.
 * @props {ReactNode} children - card body content.
 * @a11y role=radio, aria-checked, tabIndex=0; parent MUST wrap в role=radiogroup with aria-label.
 */
export const RadioCard = ({ selected, onSelect, label, children }) => (
  <div
    className={`radio-card ${selected ? 'radio-card--selected' : ''}`}
    role="radio"
    tabIndex={0}
    aria-checked={selected}
    aria-label={label}
    onClick={onSelect}
    onKeyDown={onKeyActivate(onSelect)}
  >
    {children}
  </div>
);
