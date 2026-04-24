import React from 'react';
import { Icon } from './Icon.jsx';
import { formatPrize } from '../lib/helpers.js';

/**
 * @component LeaderboardPrizeHero
 * @description Prize breakdown card показывает tier structure контеста (1st/2nd/3rd/...).
 *   Per R1 research (2026-04-23): dedicated hero >> pill chip per row — снимает
 *   визуальный шум с ranking list + upraszcza multi-brand prize rebrand.
 *   Evidence: Fortnite Showdown, Duolingo league promotion zones.
 * @props {number} totalPool
 * @props {Array<{pos:number, prize:number}>} [breakdown] - если не задан, вычисляется стандартный 55/33/12
 * @props {number} [daysLeft]
 * @a11y role="group", aria-labelledby to H2.
 */
export const LeaderboardPrizeHero = React.memo(({ totalPool, breakdown, daysLeft }) => {
  if (!totalPool || totalPool <= 0) return null;
  const tiers = breakdown || [
    { pos: 1, prize: Math.round(totalPool * 0.55) },
    { pos: 2, prize: Math.round(totalPool * 0.33) },
    { pos: 3, prize: Math.round(totalPool * 0.12) },
  ];
  const titleId = `prize-hero-${totalPool}`;
  return (
    <section className="lb-prize-hero" role="group" aria-labelledby={titleId}>
      <div className="lb-prize-hero__header">
        <Icon name="gift" size="sm" />
        <h2 id={titleId} className="lb-prize-hero__title">Призовой фонд · {formatPrize(totalPool)}</h2>
        {daysLeft != null && (
          <span className="lb-prize-hero__days">
            <Icon name="clock" size="xs" /> {daysLeft} дней
          </span>
        )}
      </div>
      <ol className="lb-prize-hero__tiers" aria-label="Распределение призов">
        {tiers.map(t => (
          <li key={t.pos} className={`lb-prize-tier lb-prize-tier--${t.pos}`}>
            <span className="lb-prize-tier__pos" aria-hidden="true">{t.pos === 1 ? '1st' : t.pos === 2 ? '2nd' : t.pos === 3 ? '3rd' : `${t.pos}th`}</span>
            <span className="lb-prize-tier__amount u-text-num">{formatPrize(t.prize)}</span>
          </li>
        ))}
      </ol>
      <div className="lb-prize-hero__footnote">Зарезервирован IB-партнёром · расчёт в течение 7 рабочих дней после завершения контеста</div>
    </section>
  );
});
