import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { Tag } from '../components/Tag.jsx';
import { Icon } from '../components/Icon.jsx';
import { Medal } from '../components/Medal.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { ResponsiveTable } from '../components/ResponsiveTable.jsx';
import { ContestTypeInfo } from '../components/ContestTypeInfo.jsx';
import { LeaderboardPrizeHero } from '../components/LeaderboardPrizeHero.jsx';
import { RankDelta } from '../components/RankDelta.jsx';
import { store } from '../lib/store.js';
import { formatPrize } from '../lib/helpers.js';
import { Skeleton } from '../components/Skeleton.jsx';
import { RegulatoryFooter } from '../components/RegulatoryFooter.jsx';

/**
 * @screen ClientLeaderboard
 * @description Client-side leaderboard с user progress hero + full ranking.
 */
export default function ClientLeaderboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setContest(await store.getContest(id));
      setAll(await store.listParticipations(id));
      setLoading(false);
    })();
  }, [id]);

  const self = all.find(p => p.self);
  const top3 = all.filter(p => p.rank <= 3);
  const midGap = all.filter(p => p.rank >= 10 && p.rank < (self ? self.rank : 12));
  const tailAfterSelf = all.filter(p => self && p.rank > self.rank).slice(0, 2);

  const rows = useMemo(() => [
    ...top3.map(p => ({ id: p.client, pos: p.rank, name: p.name, vol: (p.volume || 0).toFixed(1), prize: p.prize ? formatPrize(p.prize) : null, delta: p.delta, kind: 'top' })),
    ...(top3.length ? [{ id: '__gap', pos: null, name: '• • •', vol: '', prize: '', kind: 'gap' }] : []),
    ...midGap.map(p => ({ id: p.client, pos: p.rank, name: p.name, vol: (p.volume || 0).toFixed(1), prize: null, delta: p.delta, kind: 'mid' })),
    ...(self ? [{ id: 'self', pos: self.rank, name: 'ВЫ', vol: (self.volume || 0).toFixed(1), prize: null, delta: self.delta, kind: 'self' }] : []),
    ...tailAfterSelf.map(p => ({ id: p.client, pos: p.rank, name: p.name, vol: (p.volume || 0).toFixed(1), prize: null, delta: p.delta, kind: 'tail' })),
  ], [top3, midGap, self, tailAfterSelf]);

  const distanceToThird = ((all.find(p => p.rank === 3)?.volume) || 0) - (self?.volume || 0);
  const pctToZone = self
    ? Math.min(100, Math.round(((self.volume || 0) / ((all.find(p => p.rank === 3)?.volume) || 1)) * 100))
    : 0;

  if (loading) {
    return (
      <div className="screen-enter" aria-busy="true">
        <Breadcrumb items={[{ label: 'Контесты', onClick: () => navigate('/client/contests') }, { label: 'Лидерборд' }]} />
        <Skeleton variant="rect" width="60%" height={40} className="u-mb-16" />
        <Skeleton variant="rect" width="100%" height={160} className="u-mb-24" />
        <Skeleton variant="rect" width="100%" height={120} />
      </div>
    );
  }
  if (!contest) {
    return (
      <div className="screen-enter">
        <Breadcrumb items={[{ label: 'Контесты', onClick: () => navigate('/client/contests') }, { label: 'Лидерборд' }]} />
        <div className="empty-state--lg" role="status">
          <div className="empty-state__icon"><Icon name="search" size="lg" style={{ color: 'var(--ds-text-muted)', width: 64, height: 64 }} /></div>
          <h2 className="ds-heading-03">Контест не найден</h2>
          <p className="u-text-muted empty-state__body">Возможно, он завершился или был отменён.</p>
          <div className="empty-state__actions u-row u-row--sm">
            <button type="button" className="ds-btn ds-btn--m ds-btn--primary" onClick={() => navigate('/client/contests')}>К списку контестов</button>
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    { key: 'pos', label: 'Место', render: r => r.kind === 'gap' ? <span aria-hidden="true">• • •</span> : r.kind === 'self' ? <Medal position={r.pos} variant="self" /> : <Medal position={r.pos} /> },
    { key: 'name', label: 'Участник', render: r => r.kind === 'gap' ? '' : r.kind === 'top' ? <strong>{r.name}</strong> : r.kind === 'self' ? <strong>Ваше место</strong> : r.name },
    { key: 'delta', label: 'Δ', render: r => r.kind === 'gap' ? '' : <RankDelta value={r.delta} /> },
    { key: 'vol', label: 'Объём, лот', render: r => r.kind === 'gap' ? '' : <span className="u-text-num">{r.vol}</span> },
    { key: 'prize', label: 'Приз', render: r => r.kind === 'gap' ? '' : r.prize ? <Tag label={r.prize} variant="brand" /> : '—' },
  ];

  return (
    <div className="screen-enter">
      <Breadcrumb items={[{ label: 'Контесты', onClick: () => navigate('/client/contests') }, { label: 'Лидерборд' }]} />
      <div className="u-row u-row--between u-row--wrap u-mb-20">
        <div className="u-row">
          <h1 className="ds-heading-01">{contest.name}</h1>
          <ContestTypeInfo typeId={contest.typeId} />
        </div>
        {contest.days_left != null && (
          <span className="u-text-14 u-text-muted u-inline-flex-center u-gap-02">
            <Icon name="clock" size="sm" /> {contest.days_left} дней
          </span>
        )}
      </div>
      <LeaderboardPrizeHero totalPool={contest.prize_pool} />
      <div className="user-progress">
        <div className="u-row u-row--between u-row--wrap u-row--top">
          <div>
            <div className="ds-heading-hero">#{self?.rank || '—'}</div>
            <div className="u-text-14 u-mt-8" style={{ opacity: 0.85 }}>из {all.length} участников{self ? ' · в топ-25%' : ''}</div>
          </div>
          <div className="u-text-right">
            <div className="ds-t-title-02" style={{ color: 'inherit' }}>{(self?.volume || 0).toFixed(1)} лот</div>
            <div className="u-mt-8 u-text-13" style={{ opacity: 0.75 }}>До бронзы · ещё {Math.max(0, distanceToThird).toFixed(1)} лот</div>
          </div>
        </div>
        <div className="u-mt-16">
          <ProgressBar size="on-primary" value={pctToZone} label="Прогресс до призовой зоны" />
        </div>
        <div className="u-mt-8 u-text-right u-text-13" style={{ opacity: 0.85 }}>{pctToZone}% до призовой зоны</div>
      </div>
      <div className="card">
        <ResponsiveTable
          columns={columns}
          rows={rows}
          rowKey={r => r.id}
          borderless
          ariaLabel="Лидерборд"
          title={{ title: 'Лидерборд', meta: 'Обновлено 2 мин назад · в реальном времени' }}
          rowClassName={r => r.kind === 'self' ? 'highlight' : ''}
          rowAriaLabel={r => r.kind === 'self' ? `${r.pos}-е место — ваша позиция` : r.kind === 'gap' ? undefined : `${r.pos}-е место — ${r.name}`}
          rowTestId={r => r.kind === 'self' ? 'leaderboard-self' : undefined}
          emptyState="Участников ещё нет — вы будете первым."
          mobileCard={r => {
            if (r.kind === 'gap') return <div className="u-text-center u-text-muted u-text-13" aria-hidden="true">• • •</div>;
            return (
              <>
                <div className="card-list__row">
                  <span className="u-row u-row--sm">
                    {r.kind === 'self' ? <Medal position={r.pos} variant="self" /> : <Medal position={r.pos} />}
                    <span className="card-list__title">{r.kind === 'self' ? <strong>Ваше место</strong> : r.name}</span>
                    <RankDelta value={r.delta} />
                  </span>
                  {r.prize && <Tag label={r.prize} variant="brand" />}
                </div>
                <dl className="card-list__meta">
                  <div><dt>Объём, лот</dt><dd className="u-text-num">{r.vol}</dd></div>
                </dl>
              </>
            );
          }}
        />
      </div>
      <RegulatoryFooter />
    </div>
  );
}
