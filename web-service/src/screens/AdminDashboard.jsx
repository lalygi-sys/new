import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { Tag } from '../components/Tag.jsx';
import { Icon } from '../components/Icon.jsx';
import { Notification } from '../components/Notification.jsx';
import { Chips, ChipsGroup } from '../components/Chips.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { ResponsiveTable } from '../components/ResponsiveTable.jsx';
import { JurisdictionChip } from '../components/JurisdictionChip.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { store } from '../lib/store.js';
import { getStatusTagVariant, getStatusLabelRu } from '../lib/helpers.js';

const severityOrder = { high: 0, medium: 1, low: 2 };
const regulatoryLabel = reg => reg === 'cysec' ? 'CySEC' : reg === 'offshore' ? 'Offshore' : reg ? reg.toUpperCase() : '—';
const severityLabel = s => s === 'high' ? 'Высокая' : s === 'medium' ? 'Средняя' : 'Низкая';

/**
 * @screen AdminDashboard
 * @description Admin overview — severity-sorted alerts + stats + filterable contests table.
 */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [filter, setFilter] = useState('all');
  const [adminStats, setAdminStats] = useState({ active: 0, pending: 0, flagged: 0, completed: 0 });
  const [flaggedAlerts, setFlaggedAlerts] = useState([]);
  const [allRows, setAllRows] = useState([]);

  useEffect(() => {
    (async () => {
      setAdminStats(await store.getAdminStats());

      const alerts = await store.listAlerts({ status: 'open' });
      const ibs = await store.listIBPartners();
      const enriched = await Promise.all(alerts.map(async a => {
        const c = await store.getContest(a.contest_id);
        const ib = ibs.find(p => p.id === a.ib_id);
        return {
          id: a.id, severity: a.severity,
          partner: ib ? ib.name : 'Unknown',
          jurisdiction: ib ? regulatoryLabel(ib.regulatory) : '—',
          regulatory: ib?.regulatory,
          contest: c ? c.name : 'Unknown',
          contestId: a.contest_id,
          desc: a.desc,
        };
      }));
      enriched.sort((x, y) => (severityOrder[x.severity] ?? 9) - (severityOrder[y.severity] ?? 9));
      setFlaggedAlerts(enriched);

      const contests = await store.listContests({});
      const rows = await Promise.all(contests.map(async c => {
        const ib = ibs.find(p => p.id === c.ib);
        const parts = await store.listParticipations(c.id);
        const filterKey = c.status.toLowerCase() === 'draft' ? 'pending' : c.status.toLowerCase();
        return {
          id: c.id,
          name: c.name,
          partner: ib ? ib.name : 'Unknown',
          jurisdiction: ib ? regulatoryLabel(ib.regulatory) : '—',
          regulatory: ib?.regulatory,
          status: c.status === 'Draft' ? 'Pending' : c.status === 'Completed' ? 'Done' : c.status,
          rawStatus: c.status,
          tag: getStatusTagVariant(c.status === 'Draft' ? 'Pending' : c.status === 'Completed' ? 'Done' : c.status),
          count: parts.length || (c.status === 'Completed' ? 32 : 0),
          flagged: !!c.flagged,
          action: c.flagged ? 'Проверить' : c.status === 'Active' ? 'Статистика' : c.status === 'Completed' ? 'Результаты' : 'Обзор',
          actionIcon: c.flagged ? undefined : c.status === 'Active' ? 'chart' : 'eye',
          actionVariant: c.flagged ? 'primary' : 'outline',
          filterKey,
        };
      }));
      setAllRows(rows);
    })();
  }, []);

  const rows = useMemo(
    () => filter === 'all' ? allRows : allRows.filter(r => r.filterKey === filter),
    [filter, allRows]
  );

  const filterCount = key => key === 'all' ? allRows.length : allRows.filter(r => r.filterKey === key).length;
  const chipLabel = key => {
    const map = { all: 'Все', active: 'Активные', pending: 'Черновики', flagged: 'С флагом', done: 'Завершённые' };
    const base = map[key] || key;
    const n = filterCount(key);
    return n > 0 ? `${base} · ${n}` : base;
  };

  const columns = [
    { key: 'name', label: 'Контест', render: r => <strong>{r.name}</strong> },
    { key: 'partner', label: 'IB · Юрисдикция', render: r => (
      <div className="u-col u-gap-02" style={{ alignItems: 'flex-start' }}>
        <span>{r.partner}</span>
        <JurisdictionChip regulatory={r.regulatory} />
      </div>
    )},
    { key: 'status', label: 'Статус', render: r => <Tag label={getStatusLabelRu(r.status)} variant={r.tag} icon={r.flagged ? 'alert-triangle' : undefined} /> },
    { key: 'count', label: 'Участники', align: 'right', render: r => <span className="u-text-num">{r.count}</span> },
    { key: 'actions', label: '', align: 'right', render: r => (
      <div className="td-actions">
        <Button
          variant={r.actionVariant} size="s" icon={r.actionIcon}
          onClick={e => { e.stopPropagation(); navigate(`/admin/contests/${r.id}`); }}
        >{r.action}</Button>
      </div>
    )},
  ];

  return (
    <div className="screen-enter">
      <div className="page-header"><h1 className="ds-t-title-02">Admin Panel — Contests</h1></div>
      {flaggedAlerts.length > 0 && (
        <div className="u-mb-24">
          <div className="u-row u-row--sm u-text-negative u-mb-12 u-text-13" style={{ fontWeight: 600 }}>
            <Icon name="alert-triangle" size="sm" />
            <span>Требуют проверки{flaggedAlerts.length > 1 ? ` · ${flaggedAlerts.length}` : ''}</span>
          </div>
          {flaggedAlerts.length === 1 ? (
            <Notification
              variant="negative" icon="alert-circle"
              title={
                <span className="u-row u-row--sm u-row--wrap" style={{ gap: 'var(--ds-space-02)' }}>
                  <span>Severity {severityLabel(flaggedAlerts[0].severity)} · IB {flaggedAlerts[0].partner}</span>
                  <JurisdictionChip regulatory={flaggedAlerts[0].regulatory} />
                  <span>— «{flaggedAlerts[0].contest}»</span>
                </span>
              }
              description={flaggedAlerts[0].desc}
              actions={<>
                <Button variant="primary" size="s" onClick={() => navigate(`/admin/contests/${flaggedAlerts[0].contestId}`)}>Посмотреть</Button>
                <Button variant="outline" size="s" onClick={async () => { await store.appendAudit(flaggedAlerts[0]?.contestId || '_', { text: 'Алерт проигнорирован администратором из дашборда', alert: true }); showToast('Алерт проигнорирован, запись в audit trail', 'positive'); }}>Игнорировать</Button>
              </>}
            />
          ) : (
            <div className="card">
              <div className="card__body" style={{ padding: 0 }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {flaggedAlerts.map((a, i) => (
                    <li
                      key={a.id}
                      className="u-row u-row--top u-row--wrap"
                      style={{ padding: 'var(--ds-space-05) var(--ds-space-06)', borderBottom: i < flaggedAlerts.length - 1 ? '1px solid var(--ds-border)' : 'none' }}
                    >
                      <span className="u-text-negative" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
                        <Icon name="alert-circle" size="md" />
                      </span>
                      <div className="u-flex-1" style={{ minWidth: 240 }}>
                        <div className="u-row u-row--sm u-row--wrap" style={{ marginBottom: 'var(--ds-space-02)' }}>
                          <Tag label={severityLabel(a.severity)} variant={a.severity === 'high' ? 'negative' : a.severity === 'medium' ? 'warning' : 'inactive'} />
                          <JurisdictionChip regulatory={a.regulatory} />
                        </div>
                        <div className="ds-t-body-02-bold" style={{ marginBottom: 2 }}>IB {a.partner} — «{a.contest}»</div>
                        <div className="u-text-13 u-text-secondary">{a.desc}</div>
                      </div>
                      <div className="u-row u-row--sm">
                        <Button variant="primary" size="s" onClick={() => navigate(`/admin/contests/${a.contestId}`)}>Посмотреть</Button>
                        <Button variant="outline" size="s" onClick={async () => { await store.appendAudit(flaggedAlerts[0]?.contestId || '_', { text: 'Алерт проигнорирован администратором из дашборда', alert: true }); showToast('Алерт проигнорирован, запись в audit trail', 'positive'); }}>Игнорировать</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="u-mb-24">
        <div className="stats stats--cards">
          <StatCard value={String(adminStats.active)} label="Активные" trend={{ dir: 'up', text: '+3 за неделю' }} />
          <StatCard value={String(adminStats.pending)} label="Черновики" />
          <StatCard value={String(adminStats.flagged)} label="С флагом" color="var(--ds-negative)" trend={{ dir: 'up', text: '+1 за сутки' }} />
          <StatCard value={String(Math.max(45, adminStats.completed))} label="Завершённые" trend={{ dir: 'up', text: '+5 за месяц' }} />
        </div>
      </div>
      <div className="u-row u-row--between u-row--wrap u-p-05-07">
        <h2 className="ds-heading-04" style={{ margin: 0 }}>Все контесты</h2>
        <ChipsGroup>
          {['all', 'active', 'pending', 'flagged', 'done'].map(f => (
            <Chips key={f} label={chipLabel(f)} selected={filter === f} onClick={() => setFilter(f)} />
          ))}
        </ChipsGroup>
      </div>
      <div role="status" aria-live="polite" className="u-visually-hidden">
        {`Показано ${rows.length} ${rows.length === 1 ? 'контест' : rows.length < 5 ? 'контеста' : 'контестов'} по фильтру ${filter === 'all' ? 'все' : filter}`}
      </div>
      <div style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <ResponsiveTable
          columns={columns}
          rows={rows}
          rowKey={r => r.id}
          onRowClick={r => navigate(`/admin/contests/${r.id}`)}
          rowClassName={r => r.flagged ? 'table-row--flagged' : ''}
          rowAriaLabel={r => `${r.name} — ${r.partner} — ${r.jurisdiction} — ${r.status}${r.flagged ? ' — требует проверки' : ''}`}
          ariaLabel="Контесты"
          emptyState={`Нет контестов по фильтру «${filter}»`}
          mobileCard={r => (
            <>
              <div className="card-list__row">
                <span className="card-list__title">{r.name}</span>
                <Tag label={getStatusLabelRu(r.status)} variant={r.tag} icon={r.flagged ? 'alert-triangle' : undefined} />
              </div>
              <dl className="card-list__meta">
                <div><dt>IB Partner</dt><dd>{r.partner}</dd></div>
                <div><dt>Юрисдикция</dt><dd><JurisdictionChip regulatory={r.regulatory} /></dd></div>
                <div><dt>Участники</dt><dd className="u-text-num">{r.count}</dd></div>
              </dl>
              <div className="card-list__actions">
                <Button
                  variant={r.actionVariant} size="s" icon={r.actionIcon}
                  onClick={e => { e.stopPropagation(); navigate(`/admin/contests/${r.id}`); }}
                >{r.action}</Button>
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
}
