import React from 'react';

/**
 * @component RankDelta
 * @description Shows rank movement since last update: ↑N / ↓N / — (flat).
 *   Per R1 research — critical для trader mental model (CS2 / Robinhood convention).
 * @props {number} value - positive = climbed (ranks better), negative = dropped, 0 = unchanged
 * @a11y aria-label reads "поднялся на N / упал на N / без изменений"
 */
export const RankDelta = React.memo(({ value }) => {
  if (value == null) return <span className="rank-delta rank-delta--flat" aria-label="без данных">—</span>;
  if (value === 0) return <span className="rank-delta rank-delta--flat" aria-label="без изменений">—</span>;
  const up = value > 0;
  return (
    <span
      className={`rank-delta ${up ? 'rank-delta--up' : 'rank-delta--down'}`}
      aria-label={up ? `Поднялся на ${value}` : `Упал на ${Math.abs(value)}`}
    >
      <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
        {up ? (
          <path d="M6 2L10 8H2L6 2Z" fill="currentColor" />
        ) : (
          <path d="M6 10L2 4H10L6 10Z" fill="currentColor" />
        )}
      </svg>
      {Math.abs(value)}
    </span>
  );
});
