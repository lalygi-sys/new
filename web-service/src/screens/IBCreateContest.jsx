import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { RadioCard } from '../components/RadioCard.jsx';
import { Medal } from '../components/Medal.jsx';
import { InfoBox } from '../components/InfoBox.jsx';
import { Icon } from '../components/Icon.jsx';
import { ContestIcon3D } from '../components/ContestIcon3D.jsx';
import { ContestTypeInfo } from '../components/ContestTypeInfo.jsx';
import { CalendarInput } from '../components/CalendarInput.jsx';
import { WizardStepper } from '../components/WizardStepper.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { store } from '../lib/store.js';
import { CONTEST_TYPES, CONTEST_TYPE_LIST } from '../lib/seed.js';
import {
  formatPeriod, formatPrize, parseCurrency,
  WIZARD_TOTAL_STEPS, MIN_LOT_SIZE, DEFAULT_MIN_LOT,
  DEFAULT_MIN_HOLD_MIN, DEFAULT_MIN_START_BALANCE,
} from '../lib/helpers.js';

/* ── Wizard sub-components (preserved in single file per screen) ─── */

/**
 * @component WizardNav
 * @description Shared back/save-draft/next cluster для шагов 2-4.
 */
const WizardNav = ({ onPrev, onNext, onSaveDraft, nextLabel = 'Далее', invalid = false, invalidMessage }) => {
  const showToast = useToast();
  const handleNext = () => {
    if (invalid) {
      showToast(invalidMessage || 'Проверьте заполнение шага', 'negative');
      document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    onNext();
  };
  return (
    <div className="u-row u-row--between u-row--wrap u-mt-24">
      <Button variant="outline" icon="arrow-left" onClick={onPrev}>Назад</Button>
      <div className="u-row u-row--sm">
        <Button variant="outline" icon="save" onClick={onSaveDraft}>Сохранить черновик</Button>
        <Button variant="primary" iconRight="chevron-right" onClick={handleNext}>{nextLabel}</Button>
      </div>
    </div>
  );
};

const WIZARD_PRESETS = [
  { id: 'weekly-volume', label: 'Еженедельный Volume', typeId: 'volume', hint: 'Самый популярный' },
  { id: 'monthly-growth', label: 'Месячный Growth', typeId: 'grow', hint: 'Для обучения' },
  { id: 'weekend-streak', label: 'Выходной Streak', typeId: 'streak', hint: 'Короткий формат' },
];

/**
 * @component WizardStepType
 * @description Step 1 — выбор типа контеста. Quick-start presets для one-click setup.
 */
const WizardStepType = ({ contestType, onChangeType, onNext }) => (
  <div>
    <h1 className="ds-heading-03 u-mb-4" style={{ marginBottom: 4 }}>Какой будет контест?</h1>
    <p className="u-text-muted u-mb-20">Выберите механику — она определит формулу расчёта и фильтры участников</p>
    <div className="u-text-12-upper u-text-muted u-mb-8">Быстрый старт</div>
    <div className="wizard-presets" role="list" aria-label="Готовые шаблоны">
      {WIZARD_PRESETS.map(p => (
        <button
          key={p.id}
          type="button"
          role="listitem"
          className={`wizard-preset ${contestType === p.typeId ? 'wizard-preset--active' : ''}`}
          onClick={() => onChangeType(p.typeId)}
        >
          <span className="wizard-preset__label">{p.label}</span>
          <span className="wizard-preset__hint u-text-muted">{p.hint}</span>
        </button>
      ))}
    </div>
    <div className="u-text-12-upper u-text-muted u-mb-8" style={{ marginTop: 20 }}>Или выберите механику</div>
    <div className="radio-cards" role="radiogroup" aria-label="Тип контеста">
      {CONTEST_TYPE_LIST.map(t => (
        <RadioCard
          key={t.id}
          selected={contestType === t.id}
          onSelect={() => onChangeType(t.id)}
          label={`${t.title} — ${t.desc}`}
        >
          <ContestIcon3D typeId={t.id} size={40} />
          <div className="u-flex-1">
            <div className="u-row u-row--sm">
              <div className="ds-t-body-02-bold">{t.title}</div>
              <ContestTypeInfo typeId={t.id} />
            </div>
            <div className="u-text-13 u-text-muted" style={{ marginTop: 2 }}>{t.desc}</div>
          </div>
        </RadioCard>
      ))}
    </div>
    <div className="u-mt-24 u-text-right">
      <Button variant="primary" iconRight="chevron-right" onClick={onNext} data-testid="wizard-step-1-next">Далее</Button>
    </div>
  </div>
);

/**
 * @component WizardStepPeriod
 * @description Step 2 — даты. Блокирует Next при end <= start.
 */
const WizardStepPeriod = ({ startDate, endDate, onChangeStart, onChangeEnd, activeType, contestType, onPrev, onNext, onSaveDraft }) => {
  const recommendation = contestType === 'grow' ? '2–8 недель, чтобы прирост был значимым'
    : contestType === 'streak' ? '3–6 недель для демонстрации дисциплины'
    : '1–4 недели';
  const isValid = endDate > startDate;
  return (
    <div>
      <h1 className="ds-heading-03" style={{ marginBottom: 4 }}>Когда играем?</h1>
      <p className="u-text-muted u-mb-20">Рекомендуем 2–4 недели — достаточно времени, но аудитория не остынет</p>
      <CalendarInput label="Дата начала" value={startDate} onChange={onChangeStart} />
      <CalendarInput label="Дата окончания" value={endDate} onChange={onChangeEnd} />
      {!isValid && (
        <div className="inline-hint-error" role="alert">
          <Icon name="alert-triangle" size="xs" />
          <span>Дата окончания должна быть позже начала</span>
        </div>
      )}
      <InfoBox icon="lightbulb"><strong>Для {activeType.title}:</strong> {recommendation}</InfoBox>
      <WizardNav onPrev={onPrev} onNext={onNext} onSaveDraft={onSaveDraft} invalid={!isValid} invalidMessage="Дата окончания должна быть позже начала" />
    </div>
  );
};

/**
 * @component WizardStepRules
 */
const WizardStepRules = ({ contestType, activeType, onPrev, onNext, onSaveDraft }) => (
  <div>
    <h1 className="ds-heading-03" style={{ marginBottom: 4 }}>Условия участия</h1>
    <p className="u-text-muted u-mb-20">
      Кто может участвовать и что учитывается в <strong>{activeType.title}</strong>.{' '}
      <span className="u-inline-flex-center" style={{ gap: 4, verticalAlign: 'middle' }}>
        <ContestTypeInfo typeId={activeType.id} />
        <span className="u-text-13">посмотреть формулу Score</span>
      </span>
    </p>
    <Input label="Учитываемые инструменты" type="select" defaultValue="all">
      <option value="all">Все инструменты</option>
      <option value="forex">Только Forex</option>
      <option value="cfd">Только CFD</option>
    </Input>
    {contestType === 'grow' ? (
      <>
        <Input label="Минимальный стартовый баланс ($)" type="number" defaultValue={DEFAULT_MIN_START_BALANCE} step="10" min="0" description="Ниже этого баланса клиенты не смогут присоединиться к контесту" />
        <Input
          label="Учёт пополнений и выводов" type="select" defaultValue="exclude"
          description={<span><Icon name="alert-triangle" size="xs" style={{ color: 'var(--ds-warning)' }} /> Рекомендуем исключить, чтобы оценить только результат торговли</span>}
        >
          <option value="exclude">Исключить из прироста</option>
          <option value="include">Учитывать</option>
        </Input>
      </>
    ) : (
      <>
        <Input label="Минимальный объём сделки (лот)" type="number" defaultValue={DEFAULT_MIN_LOT} step={MIN_LOT_SIZE} min={MIN_LOT_SIZE} />
        <Input
          label="Минимальное время удержания позиции" type="select" defaultValue={String(DEFAULT_MIN_HOLD_MIN)}
          description={<span><Icon name="alert-triangle" size="xs" style={{ color: 'var(--ds-warning)' }} /> Защита от wash trading</span>}
        >
          <option value="5">5 минут</option>
          <option value="10">10 минут</option>
          <option value="15">15 минут</option>
          <option value="30">30 минут</option>
        </Input>
      </>
    )}
    <Input label="Дополнительные условия (опционально)" type="textarea" placeholder="Например: только для клиентов с депозитом от $500" />
    <WizardNav onPrev={onPrev} onNext={onNext} onSaveDraft={onSaveDraft} />
  </div>
);

/**
 * @component WizardStepPrizes
 */
const WizardStepPrizes = ({ prizes, onAddPrize, onUpdatePrize, totalPrizeFund, onPrev, onNext, onSaveDraft }) => (
  <div>
    <h1 className="ds-heading-03" style={{ marginBottom: 4 }}>Что разыгрываем?</h1>
    <p className="u-text-muted u-mb-20">Победители увидят место и приз сразу — добавьте от одного до пяти мест</p>
    <Input label="Тип приза" type="select" defaultValue="bonus">
      <option value="bonus">Бонус на торговый счёт</option>
      <option value="cash">Денежный приз</option>
      <option value="gift">Подарок (описание)</option>
    </Input>
    {prizes.map((p, i) => (
      <div key={p.pos} className="prize-row">
        <div className="u-text-center"><Medal position={p.pos} /></div>
        <div><label className="u-text-13">{p.pos}-е место</label></div>
        <div>
          <input
            type="text"
            className="ds-input-field u-text-center"
            value={p.val}
            onChange={e => onUpdatePrize(i, e.target.value)}
            aria-label={`Приз за ${p.pos}-е место`}
          />
        </div>
      </div>
    ))}
    <Button variant="outline" size="s" icon="plus" className="u-mt-8" onClick={onAddPrize}>Добавить место</Button>
    <InfoBox icon="lightbulb"><strong>Общий призовой фонд: {formatPrize(totalPrizeFund)}</strong></InfoBox>
    <WizardNav onPrev={onPrev} onNext={onNext} onSaveDraft={onSaveDraft} nextLabel="К запуску" />
  </div>
);

/**
 * @component WizardStepConfirm
 */
const WizardStepConfirm = ({ activeType, previewPeriod, previewPrize, onPrev, onSaveDraft, onLaunch, onEdit }) => {
  // UX-F2 fix (Stripe Connect / Airtable pattern): каждая строка summary имеет pencil-icon
  // → jump к соответствующему шагу. Вместо 4 клика "Назад".
  const rows = [
    { k: 'Тип',            v: activeType.title,           step: 1 },
    { k: 'Метрика',        v: activeType.metric,          step: 1 },
    { k: 'Период',         v: previewPeriod,              step: 2 },
    { k: 'Инструменты',    v: 'Все инструменты',          step: 3 },
    { k: 'Мин. объём',     v: `${DEFAULT_MIN_LOT} лот`,   step: 3 },
    { k: 'Призовой фонд',  v: previewPrize,               step: 4 },
  ];
  return (
    <div>
      <h1 className="ds-heading-03" style={{ marginBottom: 4 }}>Проверьте и запустите</h1>
      <p className="u-text-muted u-mb-20">После запуска тип, период и призы не меняются. Черновик — можно.</p>
      <div className="card u-mb-16">
        <div className="card__body">
          <div className="u-grid-2">
            {rows.map(({ k, v, step }) => (
              <div key={k} className="confirm-row">
                <strong className="u-text-muted u-text-12-upper confirm-row__label">{k}</strong>
                <div className="u-row u-row--between u-gap-04">
                  <span className="confirm-row__value">{v}</span>
                  {onEdit && (
                    <button
                      type="button"
                      className="confirm-row__edit"
                      onClick={() => onEdit(step)}
                      aria-label={`Изменить «${k}» — шаг ${step}`}
                      title={`Изменить — шаг ${step}`}
                    >
                      <Icon name="edit" size="xs" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <InfoBox icon="shield"><strong>Резерв на счёте:</strong> {previewPrize} — проверяем при запуске. Фонд будет виден клиентам как зарезервированный бюджет контеста.</InfoBox>
      <div className="u-row u-row--wrap u-mt-24 u-gap-04">
        <Button variant="outline" icon="arrow-left" onClick={onPrev}>Назад</Button>
        <Button variant="outline" icon="save" onClick={onSaveDraft}>Сохранить черновик</Button>
        <Button variant="primary" icon="rocket" style={{ flex: 1, minWidth: 180 }} onClick={onLaunch} data-testid="wizard-step-5-launch">Запустить контест</Button>
      </div>
    </div>
  );
};

/**
 * @component WizardPreviewCard
 */
const WizardPreviewCard = ({ activeType, previewPeriod, previewPrize }) => (
  <div className="preview-card">
    <div className="u-row u-row--between u-mb-12">
      <h2 className="preview-card__label">Предпросмотр</h2>
      <span className="preview-card__badge"><Icon name="eye" size="xs" /> Так увидят клиенты</span>
    </div>
    <div className="preview-inner">
      <div className="preview-inner__hero"><ContestIcon3D typeId={activeType.id} size={80} /></div>
      <div className="u-inline-flex-center u-mb-8" style={{ justifyContent: 'center' }}>
        <div className="preview-inner__title">{activeType.title}</div>
        <ContestTypeInfo typeId={activeType.id} />
      </div>
      <p className="preview-inner__teaser">{activeType.shortDesc}</p>
      <div className="preview-inner__meta">
        <span><Icon name="calendar" size="xs" /> {previewPeriod}</span>
        <span aria-hidden="true" className="preview-inner__meta-sep">·</span>
        <span><Icon name="users" size="xs" /> 0 участников</span>
      </div>
      <div className="preview-inner__prize">
        <span className="preview-inner__prize-label">Главный приз</span>
        <span className="preview-inner__prize-value">{previewPrize}</span>
      </div>
      <div className="u-mt-16"><Button variant="primary" size="m" block>Участвую</Button></div>
    </div>
  </div>
);

/**
 * @screen IBCreateContest
 * @description 5-step wizard: type → period → rules → prizes → review. Creates contest through store на launch.
 */
export default function IBCreateContest() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [step, setStep] = useState(1);
  const [contestType, setContestType] = useState('volume');
  const [startDate, setStartDate] = useState(new Date(2026, 3, 15));
  const [endDate, setEndDate] = useState(new Date(2026, 4, 15));
  const [prizes, setPrizes] = useState([
    { pos: 1, val: '$500' },
    { pos: 2, val: '$300' },
    { pos: 3, val: '$100' },
  ]);

  const addPrize = useCallback(() => {
    setPrizes(p => [...p, { pos: p.length + 1, val: '$50' }]);
  }, []);
  const updatePrize = useCallback((idx, val) => {
    setPrizes(p => p.map((pr, i) => i === idx ? { ...pr, val } : pr));
  }, []);

  const totalPrizeFund = useMemo(
    () => prizes.reduce((sum, p) => sum + parseCurrency(p.val), 0),
    [prizes]
  );
  const activeType = CONTEST_TYPES[contestType];
  const previewPeriod = useMemo(() => formatPeriod(startDate, endDate), [startDate, endDate]);
  const previewPrize = formatPrize(totalPrizeFund);

  const next = useCallback(() => setStep(s => Math.min(WIZARD_TOTAL_STEPS, s + 1)), []);
  const prev = useCallback(() => setStep(s => Math.max(1, s - 1)), []);

  const persistAndNavigate = useCallback(async (status, toastMsg, toastType) => {
    const daysLeft = Math.max(0, Math.round((endDate - new Date()) / (1000 * 60 * 60 * 24)));
    await store.createContest({
      name: `${activeType.title} ${startDate.getFullYear()}`,
      typeId: contestType,
      status,
      start: startDate,
      end: endDate,
      prize_pool: totalPrizeFund,
      days_left: daysLeft,
    });
    showToast(toastMsg, toastType);
    navigate('/ib/contests');
  }, [activeType, startDate, endDate, contestType, totalPrizeFund, showToast, navigate]);

  const saveDraft = useCallback(() => {
    persistAndNavigate('Draft', 'Черновик сохранён', 'positive');
  }, [persistAndNavigate]);

  const launch = useCallback(() => {
    persistAndNavigate('Active', 'Контест запущен!', 'positive');
  }, [persistAndNavigate]);

  return (
    <div className="screen-enter">
      <Breadcrumb items={[{ label: 'Мои контесты', onClick: () => navigate('/ib/contests') }, { label: 'Создание контеста' }]} />
      <div className="wizard-layout">
        <div>
          <WizardStepper currentStep={step} totalSteps={WIZARD_TOTAL_STEPS} />
          <div className="u-text-13 u-text-muted u-mb-16" style={{ marginTop: -4 }}>
            Шаг {step} из {WIZARD_TOTAL_STEPS} · примерно {Math.max(1, WIZARD_TOTAL_STEPS - step + 1)} мин
          </div>

          {step === 1 && <WizardStepType contestType={contestType} onChangeType={setContestType} onNext={next} />}
          {step === 2 && <WizardStepPeriod startDate={startDate} endDate={endDate} onChangeStart={setStartDate} onChangeEnd={setEndDate} activeType={activeType} contestType={contestType} onPrev={prev} onNext={next} onSaveDraft={saveDraft} />}
          {step === 3 && <WizardStepRules contestType={contestType} activeType={activeType} onPrev={prev} onNext={next} onSaveDraft={saveDraft} />}
          {step === 4 && <WizardStepPrizes prizes={prizes} onAddPrize={addPrize} onUpdatePrize={updatePrize} totalPrizeFund={totalPrizeFund} onPrev={prev} onNext={next} onSaveDraft={saveDraft} />}
          {step === 5 && <WizardStepConfirm activeType={activeType} previewPeriod={previewPeriod} previewPrize={previewPrize} onPrev={prev} onSaveDraft={saveDraft} onLaunch={launch} onEdit={setStep} />}
        </div>

        <WizardPreviewCard activeType={activeType} previewPeriod={previewPeriod} previewPrize={previewPrize} />
      </div>
    </div>
  );
}
