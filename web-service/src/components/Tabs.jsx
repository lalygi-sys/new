import React from 'react';

/**
 * @component Tabs
 * @description Horizontal tablist container. Pair with <Tab /> children.
 * @param {ReactNode} children - <Tab /> list.
 * @param {boolean} [padded] - adds 24px horizontal padding.
 */
export const Tabs = ({ children, padded }) => (
  <div className={`ds-tabs ${padded ? 'ds-tabs--padded' : ''}`}>{children}</div>
);

/**
 * @component Tab
 * @description Single tab button in a horizontal tablist.
 * @param {string} label - tab text.
 * @param {boolean} [active] - rendered with primary underline when true.
 * @param {function} [onClick]
 */
export const Tab = ({ label, active, onClick }) => (
  <button type="button" className={`ds-tab ${active ? 'ds-tab--active' : ''}`} onClick={onClick}>{label}</button>
);
