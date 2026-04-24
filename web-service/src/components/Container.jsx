import React from 'react';

/**
 * @component Container
 * @description Page-level content frame (1216px max-width, padded, bordered, card-surface). Used as screen shell inside App.
 * @param {ReactNode} children
 * @param {object} [style] - layout-specific overrides.
 */
export const Container = ({ children, style }) => (
  <div className="ds-container" style={style}>{children}</div>
);
