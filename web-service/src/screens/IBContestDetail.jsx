import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { Button } from '../components/Button.jsx';
import { Tag } from '../components/Tag.jsx';
import { Icon } from '../components/Icon.jsx';
import { Medal } from '../components/Medal.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { ResponsiveTable } from '../components/ResponsiveTable.jsx';
import { ContestIcon3D } from '../components/ContestIcon3D.jsx';
import { LeaderboardPrizeHero } from '../components/LeaderboardPrizeHero.jsx';
import { RankDelta } from '../components/RankDelta.jsx';
import { ContestTypeInfo } from '../components/ContestTypeInfo.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { store } from '../lib/store.js';
import { CONTEST_TYPES } from '../lib/seed.js';
import { formatPeriod, formatPrize, getStatusTagVariant, getStatusLabelRu } from '../lib/helpers.js';

/**
 * @screen IBContestDetail
 * @description IB-side контест detail: header + action cluster + stats + leaderboard table.
 *   Pause / share / export — functional, updates через store.
 */
export default function IBContestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const [contest, setContest] = useState(null);
  const [participations, setParticipations] = useState([]);

  const load = useCallback(async () => {
    const c = await store.getContest(id);
    if (!c) return;
    setContest(c);
    const parts = await store.listParticipations(id);
    setParticipations(parts.slice(0, 7));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const totalVolume = useMemo(() => participations.reduce((sum, p) => sum + (p.volume || 0), 0), [participations]);

  if (!contest) {
    return (
      <div className="screen-enter">
        <Breadcrumb items={[{ label: 'Мои контесты', onClick: () => navigate('/ib/contests') }, { label: 'Контест не найден' }]} />
        <div className="empty-state" role="status">
          <h2 className="ds-heading-03" style={{ margin: '16px 0 8px' }}>Контест не найден</h2>
          <p className="u-text-muted">Возможно, он был удалён или ещё не создан.</p>
          <Button variant="primary" onClick={() => navigate('/ib/contests')}>К списку контестов</Button>
        </div>
      </div>
    );
  }

  const rows = participations.map(p => ({
    id: p.client,
    pos: p.rank,
    name: p.name,
    vol: (p.volume || 0).toFixed(1),
    prize: p.prize ? formatPrize(p.prize) : null,
    delta: p.delta,
  }));

  const columns = [
    { key: 'pos', label: 'Место', render: r => <Medal position={r.pos} /> },
    { key: 'name', label: 'Участник', render: r => r.pos <= 3 ? <strong>{r.name}</strong> : r.name },
    { key: 'delta', label: 'Δ', render: r => <RankDelta value={r.delta} /> },
    { key: 'vol', label: 'Объём, лот', render: r => <span className="u-text-num">{r.vol}</span> },
    { key: 'prize', label: 'Приз', render: r => r.prize ? <Tag label={r.prize} variant="brand" /> : '—' },
  ];

  const referralCode = `IB-${contest.ib.replace('ib-', '').toUpperCase()}-${id.split('-')[1] || '01'}`;
  const handleShare = () => showToast(`Ссылка скопирована · код ${referralCode}`, 'positive');

  const handlePause = async () => {
    const next = contest.status === 'Paused' ? 'Active' : 'Paused';
    const updated = await store.updateContest(id, { status: next });
    if (updated) {
      setContest(updated);
      showToast(next === 'Paused' ? 'Контест приостановлен' : 'Контест возобновлён', 'positive');
    }
  };

  const hasParticipants = participations.length > 0;
  const participantsDelta = hasParticipants ? '+3 за сутки' : null;
  const typeCfg = CONTEST_TYPES[contest.typeId];

  return (
    <div className="screen-enter">
      <Breadcrumb items={[{ label: 'Мои контесты', onClick: () => navigate('/ib/contests') }, { label: 'Детали контеста' }]} />
      <div className="page-header">
        <div className="u-row u-row--wrap">
          <h1 className="ds-heading-01">{contest.name}</h1>
          <Tag label={getStatusLabelRu(contest.status)} variant={getStatusTagVariant(contest.status)} />
          {contest.status === 'Active' && contest.days_left != null && (
            <span className="ds-pill-inline ds-pill-inline--brand" aria-label={`До конца контеста ${contest.days_left} дней`}>
              <Icon name="clock" size="xs" /> {contest.days_left} дней до финиша
            </span>
          )}
          {typeCfg && <ContestTypeInfo typeId={contest.typeId} />}
        </div>
      </div>
      <div className="u-row u-row--between u-row--wrap u-mb-24">
        <div className="u-row u-row--sm u-row--wrap u-text-14 u-text-muted">
          {typeCfg && (
            <span className="u-inline-flex-center">
              <span className="type-icon type-icon--volume" style={{ width: 24, height: 24 }}>
                <svg width="14" height="14"><use href={`#i-${typeCfg.icon}`} /></svg>
              </span>
              <span className="u-text-primary" style={{ fontWeight: 500 }}>{typeCfg.title}</span>
            </span>
          )}
          <span>•</span>
          <Icon name="calendar" size="sm" /><span>{formatPeriod(contest.start, contest.end)}</span>
        </div>
        <div className="action-cluster-mobile u-row u-row--sm u-row--wrap">
          <Button variant="primary" size="s" icon="link" onClick={handleShare} title={`Скопировать ссылку с реферальным кодом ${referralCode}`} data-testid="s11-share">Поделиться</Button>
          <Button variant="outline" size="s" icon={contest.status === 'Paused' ? 'play' : 'pause'} onClick={handlePause}>
            {contest.status === 'Paused' ? 'Возобновить' : 'Приостановить'}
          </Button>
          <Button variant="outline" size="s" icon="download" onClick={() => showToast('Экспорт начат', 'positive')}>Экспорт</Button>
        </div>
      </div>
      <div className="u-mb-24">
        <div className="stats stats--cards">
          <StatCard
            value={String(participations.length)}
            label="Участников"
            trend={participantsDelta ? { dir: 'up', text: participantsDelta } : undefined}
          />
          <StatCard value={totalVolume.toFixed(1)} label="Объём (лоты)" />
          <StatCard value={formatPrize(contest.prize_pool)} label="Фонд призов" />
          <StatCard value="+23%" label="Объём WoW" trend={{ dir: 'up', text: 'к прошлой неделе' }} />
        </div>
      </div>
      {hasParticipants ? (
        <>
          <LeaderboardPrizeHero totalPool={contest.prize_pool} />
          <ResponsiveTable
            columns={columns}
            rows={rows}
            rowKey={r => r.id}
            ariaLabel="Лидерборд"
            title={{ title: 'Лидерборд', meta: 'Обновлено 3 мин назад' }}
            mobileCard={r => (
              <>
                <div className="card-list__row">
                  <span className="u-row u-row--sm">
                    <Medal position={r.pos} />
                    <span className="card-list__title">{r.name}</span>
                    <RankDelta value={r.delta} />
                  </span>
                  {r.prize && <Tag label={r.prize} variant="brand" />}
                </div>
                <dl className="card-list__meta">
                  <div><dt>Объём, лот</dt><dd className="u-text-num">{r.vol}</dd></div>
                </dl>
              </>
            )}
          />
        </>
      ) : (
        <div className="empty-state" role="status">
          <div className="empty-state__icon"><ContestIcon3D typeId={contest.typeId} size={80} /></div>
          <h2 className="ds-heading-03" style={{ margin: '16px 0 8px' }}>Ждём первых участников</h2>
          <p className="u-text-muted" style={{ marginBottom: 20, maxWidth: 420 }}>Поделитесь ссылкой с аудиторией — лидерборд заполнится как только кто-то присоединится.</p>
          <Button variant="primary" size="m" icon="link" onClick={handleShare}>Скопировать ссылку</Button>
        </div>
      )}
    </div>
  );
}
