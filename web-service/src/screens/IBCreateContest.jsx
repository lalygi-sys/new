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
import { InfoTip } from '../components/InfoTip.jsx';
import { Chips } from '../components/Chips.jsx';
import { Dropdown } from '../components/Dropdown.jsx';
import { CONTEST_TYPES, CONTEST_TYPE_LIST } from '../lib/seed.js';
import {
  formatPeriod, formatPrize, parseCurrency,
  WIZARD_TOTAL_STEPS, FIXED_CONDITIONS,
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
 * Часовые пояса (subset). Portировано из prototype 0e54cb9.
 * Backend принимает IANA / offset string. UI использует offset для простоты.
 */
const TIMEZONES = [
  { value: 'UTC-08', label: 'UTC−08:00 · Лос-Анджелес' },
  { value: 'UTC-05', label: 'UTC−05:00 · Нью-Йорк' },
  { value: 'UTC+00', label: 'UTC+00:00 · Лондон' },
  { value: 'UTC+01', label: 'UTC+01:00 · Берлин' },
  { value: 'UTC+02', label: 'UTC+02:00 · Кипр (CySEC)' },
  { value: 'UTC+03', label: 'UTC+03:00 · Москва' },
  { value: 'UTC+04', label: 'UTC+04:00 · Дубай (UAE)' },
  { value: 'UTC+08', label: 'UTC+08:00 · Сингапур' },
];

/**
 * @component MeridiemToggle
 * @description AM/PM chips pair. Portировано из prototype wizard 2.0.
 *   Явный AM/PM понятнее клиентам из US/UK рынков, чем 24-hour clock.
 */
const MeridiemToggle = ({ value, onChange }) => (
  <div className="time-meridiem" role="group" aria-label="AM или PM">
    {['AM', 'PM'].map(m => (
      <Chips key={m} label={m} selected={value === m} onClick={() => onChange(m)} size="s" />
    ))}
  </div>
);

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
const WizardStepPeriod = ({
  startDate, endDate, onChangeStart, onChangeEnd,
  startTime, endTime, onChangeStartTime, onChangeEndTime,
  startMeridiem, endMeridiem, onChangeStartMeridiem, onChangeEndMeridiem,
  timezone, onChangeTimezone,
  activeType, contestType, onPrev, onNext, onSaveDraft,
}) => {
  const recommendation = contestType === 'grow' ? '2–8 недель, чтобы прирост был значимым'
    : contestType === 'streak' ? '3–6 недель для демонстрации дисциплины'
    : '1–4 недели';
  const isValid = endDate > startDate;
  return (
    <div>
      <h1 className="ds-heading-03" style={{ marginBottom: 4 }}>Когда играем?</h1>
      <p className="u-text-muted u-mb-20">Укажите даты, время и часовой пояс — клиенты увидят период в своём часовом поясе</p>

      <div className="wizard-period-row">
        <CalendarInput label="Дата начала" value={startDate} onChange={onChangeStart} iconPlacement="right" />
        <div className="time-with-meridiem">
          <Input label="Время начала" value={startTime} onChange={e => onChangeStartTime(e.target.value)} aria-label="Время начала (ЧЧ:ММ)" />
          <MeridiemToggle value={startMeridiem} onChange={onChangeStartMeridiem} />
        </div>
      </div>

      <div className="wizard-period-row">
        <CalendarInput label="Дата окончания" value={endDate} onChange={onChangeEnd} iconPlacement="right" />
        <div className="time-with-meridiem">
          <Input label="Время окончания" value={endTime} onChange={e => onChangeEndTime(e.target.value)} aria-label="Время окончания (ЧЧ:ММ)" />
          <MeridiemToggle value={endMeridiem} onChange={onChangeEndMeridiem} />
        </div>
      </div>

      <Dropdown
        label="Часовой пояс"
        value={timezone}
        onChange={onChangeTimezone}
        options={TIMEZONES}
        leftIcon="globe"
      />

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

/* WizardStepRules удалён в wizard 2.0 — условия стали фиксированными платформенными
   ($100 min balance, 0.01 lot, 1 account, minHold 3 мин). Portировано из
   prototype/index.html commit 0e54cb9. Rules displayed read-only в Confirm step. */

/**
 * @component WizardStepPrizes
 */
const WizardStepPrizes = ({ prizes, onAddPrize, onUpdatePrize, totalPrizeFund, onPrev, onNext, onSaveDraft }) => (
  <div>
    <h1 className="ds-heading-03" style={{ marginBottom: 4 }}>Что разыгрываем?</h1>
    <p className="u-text-muted u-mb-20">Победители увидят место и приз сразу — добавьте от одного до пяти мест</p>
    {/* Тип приза: 'бонус на торговый счёт' убран из опций — ESMA RULE-043 prohibition
        для CFD retail. Прогонять через legal до возврата bonus вариант. */}
    <Input label="Тип приза" type="select" defaultValue="cash">
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
const WizardStepConfirm = ({ activeType, previewPeriod, previewTime, previewPrize, totalPrizeFund, onPrev, onSaveDraft, onLaunch, onEdit }) => {
  // Wizard 2.0 confirm — 2-col grid k/v. Editable rows (type/period/prize) имеют pencil-jump.
  // Fixed conditions ($100 min balance, 0.01 lot, 1 account) show read-only с InfoTip объяснением.
  const validLotTip = (
    <>
      Учитываются только сделки по правилу валидного лота.
      <br /><br />
      <strong>Валидный лот</strong> — удерживался минимум {FIXED_CONDITIONS.minHoldMinutes} мин и прошёл минимум {FIXED_CONDITIONS.minPips} пипса.
    </>
  );
  const rows = [
    { k: 'Тип',                  v: activeType.title,                            step: 1 },
    { k: 'Метрика',              v: activeType.metric,                           step: 1 },
    { k: 'Период',               v: previewPeriod,                               step: 2 },
    { k: 'Время',                v: previewTime,                                 step: 2 },
    { k: 'Мин. баланс клиента',  v: `$${FIXED_CONDITIONS.minBalance}`,           fixed: true },
    { k: 'Мин. объём сделки',    v: `${FIXED_CONDITIONS.minLot} лота`,           fixed: true, tip: validLotTip, tipLabel: 'Правило валидного лота' },
    { k: 'Торговые аккаунты',    v: `Только ${FIXED_CONDITIONS.accounts} счёт клиента`, fixed: true },
    { k: 'Призовой фонд',        v: previewPrize,                                step: 3 },
  ];
  return (
    <div>
      <h1 className="ds-heading-03" style={{ marginBottom: 4 }}>Проверьте и запустите</h1>
      <p className="u-text-muted u-mb-20">Убедитесь, что всё верно перед запуском. Фиксированные условия платформы не меняются.</p>
      <div className="card u-mb-16">
        <div className="card__body">
          <div className="u-grid-2">
            {rows.map(({ k, v, step, fixed, tip, tipLabel }) => (
              <div key={k} className="confirm-row">
                <strong className="u-text-muted u-text-12-upper confirm-row__label">{k}</strong>
                <div className="u-row u-row--between u-gap-04">
                  <span className="confirm-row__value u-row u-row--sm">
                    <span>{v}</span>
                    {tip && <InfoTip label={tipLabel} placement="top">{tip}</InfoTip>}
                  </span>
                  {!fixed && onEdit && (
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
  // Time defaults portированы из prototype 0e54cb9. AM/PM вместо 24-hr для клиентской ясности.
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('11:59');
  const [startMeridiem, setStartMeridiem] = useState('AM');
  const [endMeridiem, setEndMeridiem] = useState('PM');
  const [timezone, setTimezone] = useState('UTC+02'); // CySEC Cyprus default
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
  const previewTime = useMemo(
    () => `${startTime} ${startMeridiem} — ${endTime} ${endMeridiem} (${timezone.replace('UTC', 'UTC')})`,
    [startTime, startMeridiem, endTime, endMeridiem, timezone]
  );
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
          {step === 2 && <WizardStepPeriod
            startDate={startDate} endDate={endDate}
            onChangeStart={setStartDate} onChangeEnd={setEndDate}
            startTime={startTime} endTime={endTime}
            onChangeStartTime={setStartTime} onChangeEndTime={setEndTime}
            startMeridiem={startMeridiem} endMeridiem={endMeridiem}
            onChangeStartMeridiem={setStartMeridiem} onChangeEndMeridiem={setEndMeridiem}
            timezone={timezone} onChangeTimezone={setTimezone}
            activeType={activeType} contestType={contestType}
            onPrev={prev} onNext={next} onSaveDraft={saveDraft} />}
          {step === 3 && <WizardStepPrizes prizes={prizes} onAddPrize={addPrize} onUpdatePrize={updatePrize} totalPrizeFund={totalPrizeFund} onPrev={prev} onNext={next} onSaveDraft={saveDraft} />}
          {step === 4 && <WizardStepConfirm activeType={activeType} previewPeriod={previewPeriod} previewTime={previewTime} previewPrize={previewPrize} totalPrizeFund={totalPrizeFund} onPrev={prev} onSaveDraft={saveDraft} onLaunch={launch} onEdit={setStep} />}
        </div>

        <WizardPreviewCard activeType={activeType} previewPeriod={previewPeriod} previewPrize={previewPrize} />
      </div>
    </div>
  );
}
