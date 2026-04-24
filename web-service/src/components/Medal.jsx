import React from 'react';

/**
 * @component Medal
 * @description Position indicator for leaderboard ranks. 1/2/3 — gold/silver/bronze fill, else neutral numeric pill.
 * @props {number|string} position - 1/2/3 for gold/silver/bronze, else generic numeric.
 * @props {'self'} [variant] - highlights current user row with primary-container fill.
 * @a11y aria-label с ordinal formatting "1-е место" / "2-е место" / ...
 */
export const Medal = React.memo(({ position, variant }) => {
  const rankCls = (typeof position === 'number' && position <= 3) ? `medal--${position}` : '';
  const variantCls = variant === 'self' ? 'medal--self' : '';
  const ordinal = typeof position === 'number' ? `${position}-е место` : `${position}`;
  const label = variant === 'self' ? `${ordinal} — ваша позиция` : ordinal;
  return (
    <span className={`medal ${rankCls} ${variantCls}`.trim()} role="img" aria-label={label}>
      {position}
    </span>
  );
});
