import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { Button } from '../components/Button.jsx';
import { Icon } from '../components/Icon.jsx';
import { Medal } from '../components/Medal.jsx';
import { ContestIcon3D } from '../components/ContestIcon3D.jsx';
import { ContestTypeInfo } from '../components/ContestTypeInfo.jsx';
import { JurisdictionChip } from '../components/JurisdictionChip.jsx';
import { RegulatoryFooter } from '../components/RegulatoryFooter.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { store } from '../lib/store.js';
import { formatPeriod, formatPrize, DEFAULT_MIN_LOT, DEFAULT_MIN_HOLD_MIN } from '../lib/helpers.js';

/**
 * @screen ClientContestTerms
 * @description Client-side контест terms screen — hero + 2-col stats + rules & prizes side-by-side. Accept → store.createParticipation.
 */
export default function ClientContestTerms() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const [contest, setContest] = useState(null);
  const [participationCount, setParticipationCount] = useState(0);
  const [ib, setIb] = useState(null);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    (async () => {
      const c = await store.getContest(id);
      if (!c) return;
      setContest(c);
      const parts = await store.listParticipations(id);
      setParticipationCount(parts.length);
      if (c.ib) setIb(await store.getIBPartner(c.ib));
      setMeta(await store.getMeta());
    })();
  }, [id]);

  if (!contest) {
    return (
      <div className="screen-enter">
        <Breadcrumb items={[{ label: 'Контесты', onClick: () => navigate('/client/contests') }, { label: 'Контест не найден' }]} />
        <div className="empty-state" role="status">
          <h2 className="ds-heading-03" style={{ margin: '16px 0 8px' }}>Контест не найден</h2>
          <Button variant="primary" onClick={() => navigate('/client/contests')}>К списку</Button>
        </div>
      </div>
    );
  }

  const prizes = [
    { pos: 1, prize: formatPrize(Math.floor(contest.prize_pool * 0.55)), color: 'var(--ds-primary)' },
    { pos: 2, prize: formatPrize(Math.floor(contest.prize_pool * 0.33)) },
    { pos: 3, prize: formatPrize(Math.floor(contest.prize_pool * 0.12)) },
  ];

  const handleAccept = async () => {
    if (!meta) return;
    await store.createParticipation(id, meta.current_client);
    showToast('Вы участвуете!', 'positive');
    navigate(`/client/contests/${id}/board`);
  };

  return (
    <div className="screen-enter">
      <Breadcrumb items={[{ label: 'Контесты', onClick: () => navigate('/client/contests') }, { label: 'Детали контеста' }]} />
      <div className="u-text-center u-mb-24">
        <div className="u-mb-12" style={{ display: 'flex', justifyContent: 'center' }}><ContestIcon3D typeId={contest.typeId} size={72} /></div>
        <div className="u-inline-flex-center u-gap-03" style={{ justifyContent: 'center' }}>
          <h1 className="ds-heading-01">{contest.name}</h1>
          <ContestTypeInfo typeId={contest.typeId} />
        </div>
        <p className="u-text-muted u-mt-8" style={{ maxWidth: 460, margin: '8px auto 0' }}>
          Ранжирование по торговому объёму. При попадании в топ-3 — премия до {prizes[0].prize} по итогам контеста. Торговля CFD сопряжена с риском потерь.
        </p>
      </div>
      <div className="card u-mb-16">
        <div className="card__body">
          <div className="u-grid-2 u-text-center">
            <div>
              <div className="stat-value">{contest.days_left ?? '—'} дней</div>
              <div className="stat-label">До финиша</div>
            </div>
            <div>
              <div className="stat-value">{participationCount}</div>
              <div className="stat-label">Уже в игре</div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="u-row u-row--sm u-row--wrap u-mb-16 u-gap-03"
        style={{ padding: 'var(--ds-space-04) var(--ds-space-05)', background: 'var(--ds-bg-selected)', border: '1px solid var(--ds-border)', borderRadius: 'var(--ds-radius-lg)' }}
      >
        <Icon name="shield" size="sm" style={{ color: 'var(--ds-primary)', flexShrink: 0 }} />
        <div className="u-row u-row--sm u-row--wrap u-text-13" style={{ gap: 'var(--ds-space-02)', flex: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 600 }}>Контест от IB · {ib ? ib.name : 'партнёра'}</span>
          {ib?.country && <span className="u-text-muted">· {ib.country}</span>}
          {ib?.regulatory && <JurisdictionChip regulatory={ib.regulatory} />}
          <span className="u-text-muted">· призовой фонд зарезервирован · расчёт в течение 7 рабочих дней после завершения</span>
        </div>
      </div>
      {ib?.regulatory === 'offshore' && (
        <div
          className="ds-notification ds-notification--warning u-mb-16"
          role="alert"
          aria-label="Предупреждение о регуляторной юрисдикции"
        >
          <span className="ds-notification__icon" style={{ color: 'var(--ds-warning)' }}>
            <Icon name="alert-triangle" size="sm" />
          </span>
          <div className="ds-notification__content">
            <div className="ds-notification__title" style={{ color: 'var(--ds-warning-text-on-bg)' }}>Offshore-регулятор</div>
            <div className="ds-notification__desc">
              Этот контест хостит IB-партнёр с offshore-регистрацией ({ib.country}).
              Убедитесь, что участие в контесте допустимо по законодательству вашей юрисдикции
              и вашему клиентскому соглашению.
            </div>
          </div>
        </div>
      )}
      <div className="terms-layout u-mb-24">
        <div className="card">
          <div className="card__header">
            <h2 className="ds-heading-04" style={{ margin: 0 }}>
              <Icon name="clipboard" size="sm" style={{ marginRight: 4 }} /> Правила
            </h2>
          </div>
          <div className="card__body u-text-14">
            <ul style={{ paddingLeft: 'var(--ds-space-06)', display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-03)' }}>
              <li>Учитываются все инструменты</li>
              <li>Минимальный объём сделки: {DEFAULT_MIN_LOT} лот</li>
              <li>Минимальное время удержания: {DEFAULT_MIN_HOLD_MIN} минут</li>
              <li>Позиция определяется суммарным объёмом в лотах</li>
              <li>Результат обновляется в реальном времени</li>
              <li>Период: {formatPeriod(contest.start, contest.end)}</li>
            </ul>
          </div>
        </div>
        <div className="card">
          <div className="card__header">
            <h2 className="ds-heading-04" style={{ margin: 0 }}>
              <Icon name="gift" size="sm" style={{ marginRight: 4 }} /> Призы
            </h2>
          </div>
          <div className="card__body">
            <div className="u-col">
              {prizes.map(p => (
                <div key={p.pos} className="u-row u-row--between">
                  <span className="u-row u-row--sm"><Medal position={p.pos} /> {p.pos}-е место</span>
                  <strong style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px', color: p.color || 'var(--ds-text-secondary)' }}>{p.prize}</strong>
                </div>
              ))}
            </div>
            <div className="u-text-13 u-text-muted u-mt-12" style={{ paddingTop: 12, borderTop: '1px solid var(--ds-border)' }}>
              Выплата на торговый счёт в течение 7 рабочих дней после окончания контеста.
            </div>
          </div>
        </div>
      </div>
      <div className="u-row u-row--wrap u-gap-04">
        <Button
          variant="primary" icon="check-circle" style={{ flex: 1, minWidth: 160 }}
          onClick={handleAccept}
          data-testid="s21-accept"
        >Принять вызов</Button>
        <Button variant="outline" onClick={() => navigate('/client/contests')}>Не сейчас</Button>
      </div>
      <p className="u-text-muted u-text-center u-mt-12 ds-t-utility-01">
        Нажимая «Принять вызов», вы соглашаетесь с правилами контеста и условиями участия.
      </p>
      <RegulatoryFooter />
    </div>
  );
}
