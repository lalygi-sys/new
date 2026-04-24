import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { Button } from '../components/Button.jsx';
import { Tag } from '../components/Tag.jsx';
import { Icon } from '../components/Icon.jsx';
import { Medal } from '../components/Medal.jsx';
import { Modal } from '../components/Modal.jsx';
import { Input } from '../components/Input.jsx';
import { Notification } from '../components/Notification.jsx';
import { Chips, ChipsGroup } from '../components/Chips.jsx';
import { ResponsiveTable } from '../components/ResponsiveTable.jsx';
import { ContestTypeInfo } from '../components/ContestTypeInfo.jsx';
import { JurisdictionChip } from '../components/JurisdictionChip.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { store } from '../lib/store.js';
import { CONTEST_TYPES } from '../lib/seed.js';
import { formatPeriod, formatPrize } from '../lib/helpers.js';

const regulatoryLabel = reg => reg === 'cysec' ? 'CySEC' : reg === 'offshore' ? 'Offshore' : reg ? reg.toUpperCase() : '—';
const severityLabel = s => s === 'high' ? 'Высокая' : s === 'medium' ? 'Средняя' : 'Низкая';

/**
 * @screen AdminContestDetail
 * @description Admin deep-dive: flagged Notification + 2-col grid (leaderboard | actions + audit trail).
 *   Pause / note / cancel — функциональные actions через store (persist audit через reload).
 */
export default function AdminContestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [contest, setContest] = useState(null);
  const [ib, setIb] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [alert, setAlert] = useState(null);

  const [auditFilter, setAuditFilter] = useState('all');
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  const loadAll = useCallback(async () => {
    const c = await store.getContest(id);
    if (!c) return;
    setContest(c);
    setIb(c.ib ? await store.getIBPartner(c.ib) : null);
    setParticipations(await store.listParticipations(id));
    setAuditLog(await store.getAuditLog(id));
    const alerts = await store.listAlerts({ contest_id: id });
    setAlert(alerts[0] || null);
  }, [id]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const isPaused = contest?.status === 'Paused';
  const isCancelled = contest?.status === 'Cancelled';
  const isFlagged = !!contest?.flagged;
  const flaggedCount = useMemo(() => participations.filter(p => p.flagged).length, [participations]);
  const filteredAudit = useMemo(
    () => auditFilter === 'alerts' ? auditLog.filter(a => a.alert) : auditLog,
    [auditFilter, auditLog]
  );

  const handlePauseToggle = useCallback(async () => {
    if (!contest) return;
    const next = isPaused ? 'Active' : 'Paused';
    await store.updateContest(id, { status: next });
    await store.appendAudit(id, {
      text: next === 'Paused' ? 'Контест приостановлен администратором' : 'Контест возобновлён администратором',
      alert: next === 'Paused',
    });
    await loadAll();
    showToast(next === 'Paused' ? 'Контест приостановлен' : 'Контест возобновлён', 'positive');
  }, [contest, isPaused, id, loadAll, showToast]);

  const handleCancel = useCallback(async () => {
    if (isCancelled) return;
    await store.updateContest(id, { status: 'Cancelled' });
    await store.appendAudit(id, {
      text: 'Контест отменён. Все участники уведомлены. Призы удержаны до compliance review.',
      alert: true,
    });
    await loadAll();
    showToast('Контест отменён', 'negative');
  }, [isCancelled, id, loadAll, showToast]);

  const handleNoteSave = useCallback(async () => {
    const text = noteDraft.trim();
    if (!text) return;
    await store.appendAudit(id, { text: `Заметка: ${text}`, alert: false });
    setNoteDraft('');
    setNoteModalOpen(false);
    await loadAll();
    showToast('Заметка добавлена в audit trail', 'positive');
  }, [noteDraft, id, loadAll, showToast]);

  const handleComplianceTransfer = useCallback(async () => {
    await store.appendAudit(id, { text: 'Кейс передан compliance team для review', alert: true });
    await loadAll();
    showToast('Кейс передан compliance team', 'positive');
  }, [id, loadAll, showToast]);

  const handleDisqualify = useCallback(async () => {
    const clientName = alert?.client_id ? `Client_${alert.client_id.slice(-1).toUpperCase()}****` : 'Client_Z****';
    await store.appendAudit(id, {
      text: `${clientName} дисквалифицирован администратором. Лидерборд пересчитан.`,
      alert: true,
    });
    await loadAll();
    showToast(`${clientName} дисквалифицирован. Лидерборд пересчитан.`, 'positive');
  }, [id, alert, loadAll, showToast]);

  const handleAlertDismiss = useCallback(async (reason = 'false-positive') => {
    await store.appendAudit(id, {
      text: reason === 'false-positive'
        ? 'Алерт отклонён как ложное срабатывание'
        : 'Алерт отклонён администратором',
      alert: true,
    });
    await loadAll();
    showToast('Алерт отклонён, запись в audit trail', 'positive');
  }, [id, loadAll, showToast]);

  if (!contest) {
    return (
      <div className="screen-enter">
        <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Контест не найден' }]} />
        <div className="empty-state" role="status">
          <h2 className="ds-heading-03" style={{ margin: '16px 0 8px' }}>Контест не найден</h2>
          <Button variant="primary" onClick={() => navigate('/admin')}>К dashboard</Button>
        </div>
      </div>
    );
  }

  const clientName = participations.find(p => p.client === alert?.client_id)?.name;

  const rows = participations.map(p => ({
    id: p.client,
    pos: p.rank,
    name: p.name,
    vol: (p.volume || 0).toFixed(1),
    trades: p.trades,
    hold: p.avg_hold,
    flagged: !!p.flagged,
  }));

  const columns = [
    { key: 'pos', label: 'Место', render: r => <Medal position={r.pos} /> },
    { key: 'name', label: 'Клиент', render: r => (
      <span className="u-row u-row--sm">
        <span className={r.flagged ? 'u-text-primary' : undefined} style={r.flagged ? { fontWeight: 600 } : undefined}>{r.name}</span>
        {r.flagged && <Tag label="Флаг" variant="negative" icon="alert-triangle" />}
      </span>
    )},
    { key: 'vol', label: 'Объём', render: r => <span className="u-text-num">{r.vol}</span> },
    { key: 'trades', label: 'Сделки', align: 'right', render: r => <span className="u-text-num">{r.trades ?? '—'}</span> },
    { key: 'hold', label: 'Ср. удерж.', render: r => <span style={r.flagged ? { color: 'var(--ds-negative)' } : undefined}>{r.hold ?? '—'}</span> },
  ];

  const typeCfg = CONTEST_TYPES[contest.typeId];

  return (
    <div className="screen-enter">
      <Breadcrumb items={[{ label: 'Dashboard', onClick: () => navigate('/admin') }, { label: 'Детали контеста' }]} />
      <div className="u-row u-row--wrap u-mb-24">
        <h1 className="ds-heading-01">{contest.name}</h1>
        {isFlagged && <Tag label="С флагом" variant="negative" icon="alert-triangle" />}
        {isCancelled && <Tag label="Отменён" variant="negative" />}
        {isPaused && <Tag label="Пауза" variant="warning" />}
        {typeCfg && <ContestTypeInfo typeId={contest.typeId} />}
      </div>
      <dl className="contest-meta-grid u-mb-32">
        <div className="u-col" style={{ gap: 2, minWidth: 0 }}>
          <dt className="u-text-12-upper u-text-muted">IB Partner</dt>
          <dd className="u-row u-row--sm" style={{ margin: 0, fontWeight: 500 }}>
            <span>{ib ? ib.name : 'Unknown'}</span>
            <JurisdictionChip regulatory={ib?.regulatory} />
          </dd>
        </div>
        <div className="u-col" style={{ gap: 2, minWidth: 0 }}>
          <dt className="u-text-12-upper u-text-muted">Тип</dt>
          <dd className="u-inline-flex-center" style={{ margin: 0, fontWeight: 500 }}>
            {typeCfg && (
              <>
                <span className="type-icon type-icon--volume" style={{ width: 20, height: 20 }}>
                  <svg width="12" height="12"><use href={`#i-${typeCfg.icon}`} /></svg>
                </span>
                <span>{typeCfg.title}</span>
              </>
            )}
          </dd>
        </div>
        <div className="u-col" style={{ gap: 2, minWidth: 0 }}>
          <dt className="u-text-12-upper u-text-muted">Период</dt>
          <dd style={{ margin: 0, fontWeight: 500 }}>{formatPeriod(contest.start, contest.end)}</dd>
        </div>
        <div className="u-col" style={{ gap: 2, minWidth: 0 }}>
          <dt className="u-text-12-upper u-text-muted">Призовой фонд</dt>
          <dd className="u-text-num" style={{ margin: 0, fontWeight: 500 }}>{formatPrize(contest.prize_pool)}</dd>
        </div>
      </dl>
      {alert && (
        <Notification
          className="u-mt-05"
          variant="negative" icon="alert-circle"
          title={`Severity ${severityLabel(alert.severity || 'high')} · Подозрительная активность: ${clientName || 'Client_Z****'}`}
          description="200 лотов за 1 час • средняя позиция: 2 мин • 45 встречных сделок (buy+sell одновременно) • паттерн: возможный wash trading"
          actions={<>
            <Button
              variant="negative" size="s"
              onClick={handleDisqualify}
              data-testid="s31-disqualify"
            >Дисквалифицировать</Button>
            <Button variant="outline" size="s" onClick={handleComplianceTransfer}>Передать compliance</Button>
            <Button variant="outline" size="s" onClick={() => handleAlertDismiss('false-positive')}>Ложное срабатывание</Button>
          </>}
        />
      )}
      <div className="admin-detail-grid u-mt-24">
        <div className="card">
          <ResponsiveTable
            columns={columns}
            rows={rows}
            rowKey={r => r.id}
            borderless
            ariaLabel="Лидерборд (полный)"
            title={{ title: `Лидерборд · ${participations.length} участников${flaggedCount ? ` · ${flaggedCount} c флагом` : ''}` }}
            rowClassName={r => r.flagged ? 'table-row--flagged' : ''}
            rowAriaLabel={r => `${r.pos}-е место — ${r.name}${r.flagged ? ' — флаг' : ''}`}
            mobileCard={r => (
              <>
                <div className="card-list__row">
                  <span className="u-row u-row--sm">
                    <Medal position={r.pos} />
                    <span className="card-list__title">{r.name}</span>
                  </span>
                  {r.flagged && <Tag label="Флаг" variant="negative" icon="alert-triangle" />}
                </div>
                <dl className="card-list__meta">
                  <div><dt>Объём</dt><dd className="u-text-num">{r.vol}</dd></div>
                  <div><dt>Сделки</dt><dd className="u-text-num">{r.trades ?? '—'}</dd></div>
                  <div><dt>Ср. удерж.</dt><dd style={r.flagged ? { color: 'var(--ds-negative)' } : undefined}>{r.hold ?? '—'}</dd></div>
                </dl>
              </>
            )}
          />
        </div>
        <div>
          <div className="card u-mb-20">
            <div className="card__header"><h2 className="ds-heading-04" style={{ margin: 0 }}>Действия</h2></div>
            <div className="card__body u-col u-col--sm">
              <Button
                variant={isFlagged && !isPaused ? 'primary' : 'outline'}
                icon={isPaused ? 'play' : 'pause'}
                onClick={handlePauseToggle}
                disabled={isCancelled}
                aria-pressed={isPaused}
              >
                {isPaused ? 'Возобновить контест' : 'Приостановить контест'}
              </Button>
              <Button variant="outline" icon="edit" onClick={() => setNoteModalOpen(true)} disabled={isCancelled}>Добавить заметку</Button>
              <Button variant="outline" icon="flag" onClick={handleComplianceTransfer} disabled={isCancelled}>Передать compliance</Button>
              <Button variant="negative" icon="x-circle" onClick={handleCancel} disabled={isCancelled}>
                {isCancelled ? 'Контест отменён' : 'Отменить контест'}
              </Button>
            </div>
          </div>
          <div className="card">
            <div className="card__header u-row u-row--between u-row--wrap u-gap-03">
              <h2 className="ds-heading-04" style={{ margin: 0 }}>Audit Trail</h2>
              <ChipsGroup>
                <Chips label={`Все · ${auditLog.length}`} size="s" selected={auditFilter === 'all'} onClick={() => setAuditFilter('all')} />
                <Chips label={`Только алерты · ${auditLog.filter(a => a.alert).length}`} size="s" selected={auditFilter === 'alerts'} onClick={() => setAuditFilter('alerts')} />
              </ChipsGroup>
            </div>
            <div className="card__body">
              {filteredAudit.length === 0 ? (
                <div className="u-text-14 u-text-muted">Нет событий по фильтру</div>
              ) : (
                <div className="audit-trail">
                  {filteredAudit.map((a, i) => (
                    <div key={i} className={`audit-item ${a.alert ? 'audit-item--alert' : ''}`}>
                      <div className="u-text-muted u-text-num ds-t-utility-01">{a.time}</div>
                      <div className="u-text-14 u-text-secondary">
                        {a.alert && <Icon name="alert-triangle" size="xs" style={{ color: 'var(--ds-negative)' }} />} {a.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title="Добавить заметку"
        footer={<>
          <Button variant="outline" onClick={() => setNoteModalOpen(false)}>Отменить</Button>
          <Button variant="primary" icon="save" onClick={handleNoteSave} disabled={!noteDraft.trim()}>Сохранить</Button>
        </>}
      >
        <Input
          type="textarea"
          label="Текст заметки"
          description="Заметка попадёт в audit trail с отметкой времени. Видят только admin-пользователи."
          value={noteDraft}
          onChange={e => setNoteDraft(e.target.value)}
          placeholder="Например: связался с IB для уточнения паттерна. Ждём ответ."
          rows={4}
          autoFocus
        />
      </Modal>
    </div>
  );
}
