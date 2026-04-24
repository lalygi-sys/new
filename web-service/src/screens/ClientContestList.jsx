import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from '../components/Tag.jsx';
import { Icon } from '../components/Icon.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { ContestIcon3D } from '../components/ContestIcon3D.jsx';
import { ContestTypeInfo } from '../components/ContestTypeInfo.jsx';
import { store } from '../lib/store.js';
import { CONTEST_TYPES } from '../lib/seed.js';
import { formatPeriod, formatPrize, onKeyActivate } from '../lib/helpers.js';
import { SkeletonCard } from '../components/Skeleton.jsx';
import { RegulatoryFooter } from '../components/RegulatoryFooter.jsx';

/**
 * @screen ClientContestList
 * @description Client-side card list available контестов + completed summary row.
 * @a11y Cards rendered role="button" tabIndex=0 with full-row aria-label.
 */
export default function ClientContestList() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [completed, setCompleted] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const all = await store.listContests({ role: 'client' });
      const withCounts = await Promise.all(all.map(async c => {
        const t = CONTEST_TYPES[c.typeId];
        const parts = await store.listParticipations(c.id);
        const top1 = Math.floor(c.prize_pool * 0.55);
        return {
          ...c,
          participantCount: parts.length,
          shortDesc: t ? t.shortDesc : '',
          heroDesc: t ? t.shortDesc : '',
          top1Prize: top1,
          statusLabel: c.status === 'Draft' ? 'Стартует скоро' : 'Идёт сейчас',
          statusVariant: c.status === 'Draft' ? 'info' : 'positive',
        };
      }));
      setCards(withCounts);

      const all2 = await store.listContests({});
      setCompleted(all2.find(c => c.status === 'Completed'));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="screen-enter">
      <div className="u-mb-24">
        <h1 className="ds-t-title-02">Контесты</h1>
        <p className="u-text-muted u-mt-8 ds-t-body-01" style={{ maxWidth: 560 }}>
          Соревнуйтесь с другими трейдерами. Ранжирование по объёму, серии или росту счёта — по правилам контеста. Участие добровольное, результат зависит от ваших торговых решений и сопряжён с риском потерь.
        </p>
      </div>
      {loading ? (
        <div className="contest-grid" aria-busy="true" aria-live="polite">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : cards.length === 0 ? (
        <div className="card">
          <div className="card__body u-text-center" style={{ padding: 'var(--ds-space-10) var(--ds-space-06)' }}>
            <div className="u-mb-12" style={{ display: 'flex', justifyContent: 'center' }}><ContestIcon3D typeId="top" size={64} /></div>
            <h2 className="ds-heading-04 u-mb-8">Новые контесты скоро</h2>
            <p className="u-text-muted ds-t-body-02">Пока активных нет. Загляните завтра или следите за рассылкой.</p>
          </div>
        </div>
      ) : (
        <div className="contest-grid">
          {cards.map(c => {
            const open = () => navigate(`/client/contests/${c.id}`);
            const dates = c.start && c.end ? formatPeriod(c.start, c.end) : 'Старт скоро';
            const daysText = c.days_left ? `${c.days_left} дней до финиша` : null;
            const totalDays = c.start && c.end
              ? Math.max(1, Math.round((c.end - c.start) / (1000 * 60 * 60 * 24)))
              : 30;
            const daysPassed = Math.round(c.progress * totalDays / 100);
            const progressText = c.progress > 0
              ? `Прошло ${daysPassed} из ${totalDays} дней`
              : (c.status === 'Draft' ? 'Старт совсем скоро' : 'Ещё не стартовал');

            return (
              <div
                key={c.id}
                className="contest-card"
                role="button"
                tabIndex={0}
                aria-label={`${c.name} — ${c.statusLabel}, ${c.participantCount} участников, призовой фонд ${formatPrize(c.prize_pool)}`}
                onClick={open}
                onKeyDown={onKeyActivate(open)}
              >
                <div className="u-row u-row--lg u-mb-16">
                  <ContestIcon3D typeId={c.typeId} size={48} />
                  <div className="u-flex-1">
                    <div className="u-row u-row--sm">
                      <div className="contest-card__title">{c.name}</div>
                      <ContestTypeInfo typeId={c.typeId} />
                    </div>
                    <Tag label={c.statusLabel} variant={c.statusVariant} />
                  </div>
                </div>
                <div className="u-text-14 u-text-secondary u-mb-16">{c.heroDesc}</div>
                {/* Prize block — dedicated row, выделен subtle background (не вплетён в description) */}
                <div className="contest-card__prize">
                  <span className="contest-card__prize-label">
                    <Icon name="gift" size="xs" /> Главный приз
                  </span>
                  <span className="contest-card__prize-value">до {formatPrize(c.top1Prize)}</span>
                </div>
                {/* Temporal group — dates + participants (когда и кто) */}
                <div className="contest-card__meta">
                  <span><Icon name="calendar" size="xs" /> {dates}</span>
                  <span><Icon name="users" size="xs" /> {c.participantCount} участников</span>
                </div>
                {/* Progress group — bar + text + days remaining */}
                <div className="contest-card__progress">
                  {c.progress > 0 ? (
                    <div className="u-row u-row--between ds-t-utility-01 u-text-muted" style={{ marginBottom: 'var(--ds-space-02)' }}>
                      <span>{progressText}{daysText ? ` · ${daysText}` : ''}</span>
                      <span className="u-text-brand" style={{ fontWeight: 500 }}>{c.progress}%</span>
                    </div>
                  ) : (
                    <div className="ds-t-utility-01 u-text-muted" style={{ marginBottom: 'var(--ds-space-02)' }}>{progressText}</div>
                  )}
                  <ProgressBar size="mini" value={c.progress} label={`${c.name} — прогресс периода`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {completed && !loading && (
        <>
          <div className="section-title">Завершённые</div>
          <div
            className="u-row u-row--between u-row--wrap u-gap-04"
            style={{ padding: 'var(--ds-space-05) var(--ds-space-06)', background: 'var(--ds-bg)', borderRadius: 'var(--ds-radius-xl)', border: '1px solid var(--ds-border)' }}
          >
            <div className="u-row">
              <Icon name="check-circle" size="md" style={{ color: 'var(--ds-positive)' }} />
              <div>
                <div className="ds-t-body-02-bold">{completed.name}</div>
                <div className="u-text-13 u-text-muted" style={{ marginTop: 2 }}>
                  {CONTEST_TYPES[completed.typeId]?.title} • {formatPeriod(completed.start, completed.end)}
                </div>
              </div>
            </div>
            <div className="u-text-14 u-text-muted">
              Ваше место · <span className="u-text-brand" style={{ fontWeight: 600 }}>#7</span> из 32
            </div>
          </div>
        </>
      )}
      <RegulatoryFooter />
    </div>
  );
}
