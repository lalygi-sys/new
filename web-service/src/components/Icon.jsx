import React from 'react';

/**
 * @component Icon
 * @description SVG icon wrapper pulling from the inline sprite. Decorative by default (aria-hidden).
 * @param {string} name - sprite id (без i- prefix).
 * @param {'xs'|'sm'|'md'|'lg'} [size='sm'] - visual size via .icon--${size}.
 * @param {string} [className]
 * @param {object} [style]
 * @a11y aria-hidden="true" — icon is always decorative; callers provide text label separately.
 */
export const Icon = React.memo(({ name, size = 'sm', className = '', style }) => (
  <span className={`icon icon--${size} ${className}`} style={style} aria-hidden="true">
    <svg><use href={`#i-${name}`} /></svg>
  </span>
));
