import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { IconButton } from '../components/IconButton.jsx';
import { Tag } from '../components/Tag.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { ResponsiveTable } from '../components/ResponsiveTable.jsx';
import { ContestIcon3D } from '../components/ContestIcon3D.jsx';
import { ContestTypeInfo } from '../components/ContestTypeInfo.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { store } from '../lib/store.js';
import { CONTEST_TYPES } from '../lib/seed.js';
import { formatPeriod, formatPrize, getStatusTagVariant, getStatusLabelRu } from '../lib/helpers.js';

const STATUS_ORDER = { 'Active': 0, 'Draft': 1, 'Completed': 2 };

/**
 * @screen IBMyContests
 * @description IB landing screen: stats row + контест list (table desktop / card-list mobile).
 * @a11y Table rows role="button" with aria-label summarising row. Mobile card-list mirrors same semantics.
 */
export default function IBMyContests() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [contests, setContests] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, participants: 0, prize_pool: 0 });
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    (async () => {
      const m = await store.getMeta();
      setMeta(m);
      const list = await store.listContests({ ib: m.current_ib });
      const s = await store.getIBStats(m.current_ib);
      // Attach participant counts
      const withParts = await Promise.all(list.map(async c => {
        const parts = await store.listParticipations(c.id);
        return { ...c, participantCount: parts.length };
      }));
      setContests(withParts);
      setStats(s);
    })();
  }, []);

  const rows = useMemo(() => contests
    .slice()
    .sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9))
    .map(c => ({
      id: c.id,
      name: c.name,
      typeId: c.typeId,
      status: c.status,
      statusVariant: getStatusTagVariant(c.status),
      count: c.status === 'Draft' ? '—' : (c.participantCount || (c.status === 'Completed' ? 32 : 0)),
      period: formatPeriod(c.start, c.end),
      progress: c.progress,
      action: c.status === 'Draft' ? 'Продолжить' : c.status === 'Completed' ? 'Итоги' : 'Открыть',
      actionIcon: c.status === 'Draft' ? 'edit' : c.status === 'Completed' ? 'eye' : 'chart',
      share: c.status !== 'Draft',
      nav: c.status === 'Draft' ? 'wizard' : 'detail',
    })),
    [contests]);

  const columns = [
    { key: 'name', label: 'Название', render: r => <strong>{r.name}</strong> },
    { key: 'type', label: 'Тип', render: r => {
      const t = CONTEST_TYPES[r.typeId];
      return (
        <div className="type-cell">
          <span className={`type-icon type-icon--${t.typeIcon}`} aria-hidden="true"><svg width="14" height="14"><use href={`#i-${t.icon}`} /></svg></span>
          <span>{t.title}</span>
          <ContestTypeInfo typeId={t.id} />
        </div>
      );
    }},
    { key: 'status', label: 'Статус', render: r => <Tag label={getStatusLabelRu(r.status)} variant={r.statusVariant} /> },
    { key: 'count', label: 'Участники' },
    { key: 'period', label: 'Период', render: r => (
      <>
        <div>{r.period}</div>
        {r.progress != null && r.progress > 0 && r.progress < 100 && (
          <ProgressBar size="mini" value={r.progress} label={`${r.name} — прогресс периода`} />
        )}
      </>
    )},
    { key: 'actions', label: '', align: 'right', render: r => (
      <div className="td-actions">
        <Button
          variant="outline" size="s" icon={r.actionIcon}
          onClick={e => { e.stopPropagation(); openContest(r); }}
        >{r.action}</Button>
        {r.share && <IconButton
          icon="link" size="s"
          onClick={e => { e.stopPropagation(); showToast('Ссылка скопирована — делитесь в канале', 'positive'); }}
          title="Скопировать ссылку для канала"
          ariaLabel="Скопировать ссылку на контест для канала"
        />}
      </div>
    )},
  ];

  const openContest = r => {
    if (r.nav === 'wizard') navigate('/ib/contests/new');
    else navigate(`/ib/contests/${r.id}`);
  };

  const activeCount = stats.active;
  const subStatus = activeCount > 0
    ? `${activeCount} активных · обновлено только что`
    : 'нет активных контестов';

  return (
    <div className="screen-enter">
      <div className="page-header">
        <div>
          <h1 className="ds-t-title-02" style={{ marginBottom: 4 }}>Мои контесты</h1>
          <div className="u-text-13 u-text-muted" aria-label={`Статус: ${subStatus}`}>{subStatus}</div>
        </div>
        <Button
          variant="primary" size="m" icon="plus"
          onClick={() => navigate('/ib/contests/new')}
          aria-label="Создать контест"
          data-testid="s10-create-contest"
        >
          <span className="page-header__create-label">Создать контест</span>
        </Button>
      </div>
      <div className="u-mb-24">
        <div className="stats stats--cards">
          <StatCard value={String(stats.active)} label="Активных" />
          <StatCard value={String(stats.participants)} label="Участников" trend={stats.participants > 0 ? { dir: 'up', text: '+3 за сутки' } : undefined} />
          <StatCard value={formatPrize(stats.prize_pool)} label="Фонд призов" />
          <StatCard value={String(stats.total)} label="Всего запущено" />
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="empty-state--lg" role="status">
          <div className="empty-state__icon"><ContestIcon3D typeId="volume" size={96} /></div>
          <h2 className="ds-heading-02">Ни одного контеста ещё</h2>
          <p className="u-text-muted empty-state__body">
            Запустите первый — клиенты активизируются на неделю, канал оживает,
            в финале — призовой фонд возвращается лояльностью. Занимает 5 минут.
          </p>
          <div className="empty-state__actions u-row u-row--sm">
            <Button variant="primary" size="m" icon="plus" onClick={() => navigate('/ib/contests/new')}>Создать контест</Button>
          </div>
        </div>
      ) : (
        <ResponsiveTable
          columns={columns}
          rows={rows}
          rowKey={r => r.id}
          onRowClick={openContest}
          rowAriaLabel={r => `${r.name} — ${r.status}, ${r.count} участников, период ${r.period}`}
          ariaLabel="Мои контесты"
        />
      )}
    </div>
  );
}
