import React from 'react';
import { Icon } from './Icon.jsx';

/**
 * @component InfoBox
 * @description Inline hint / recommendation block with primary-tinted background and leading icon.
 * @param {string} [icon] - sprite id (без i- prefix).
 * @param {ReactNode} children - body text.
 */
export const InfoBox = ({ icon, children }) => (
  <div className="info-box">
    {icon && <Icon name={icon} size="sm" style={{ color: 'var(--ds-primary)', marginTop: 1 }} />}
    <span>{children}</span>
  </div>
);
