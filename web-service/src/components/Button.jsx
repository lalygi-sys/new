import React from 'react';

/**
 * @component Button
 * @description Primary action button. Variants match Octa DS palette; supports leading/trailing SVG sprite icon and block fullwidth.
 * @param {ReactNode} children - button label.
 * @param {'primary'|'secondary'|'tertiary'|'text'|'positive'|'negative'|'outline'} [variant='primary']
 * @param {'m'|'s'} [size='m'] - 48px / 36px heights per RIG Storybook.
 * @param {string} [icon] - leading sprite id (без i- prefix).
 * @param {string} [iconRight] - trailing sprite id.
 * @param {boolean} [block] - stretches to 100% width.
 * @param {function} [onClick]
 * @param {boolean} [disabled]
 * @param {object} [style] - layout-specific overrides only.
 * @param {string} [className]
 * @a11y Native <button type="button"> — Enter/Space activation free. Disabled state communicates via native [disabled].
 * @octa see Components library → Button (primary/secondary/tertiary/destructive variants).
 */
export const Button = ({ children, variant = 'primary', size = 'm', icon, iconRight, block, onClick, disabled, style, className = '', ...rest }) => (
  <button
    type="button"
    className={`ds-btn ds-btn--${size} ds-btn--${variant} ${block ? 'ds-btn--block' : ''} ${className}`}
    onClick={onClick} disabled={disabled} style={style}
    {...rest}
  >
    {icon && <svg><use href={`#i-${icon}`} /></svg>}
    {children}
    {iconRight && <svg><use href={`#i-${iconRight}`} /></svg>}
  </button>
);
