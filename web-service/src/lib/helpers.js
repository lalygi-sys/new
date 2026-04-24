/**
 * App-wide constants + formatters + keyboard utility.
 * Ported verbatim from prototype/index-octa.html R2.4/R2.5.
 */

export const VIEWPORT_MOBILE = 643;
export const VIEWPORT_TABLET = 1023;
export const TOAST_DURATION_MS = 4000;
export const MODAL_MAX_WIDTH = { m: 520, l: 640 };
export const MAX_CONTEST_DURATION_DAYS = 90;
export const MIN_LOT_SIZE = 0.01;
export const DEFAULT_MIN_LOT = 0.1;
export const DEFAULT_MIN_HOLD_MIN = 5;
export const DEFAULT_MIN_START_BALANCE = 100;
export const WIZARD_TOTAL_STEPS = 4;

/**
 * Fixed platform conditions. Простая продуктовая модель: один счёт, минимальный баланс,
 * минимальный объём сделки — одинаковы для всех контестов. Portировано из prototype/
 * wizard 2.0 (commit 0e54cb9). Убирает конфигурацию rules в IB wizard.
 */
export const FIXED_CONDITIONS = {
  minBalance: 100,            // USD
  minLot: 0.01,               // торговый лот
  accounts: 1,                // один аккаунт клиента
  minHoldMinutes: 3,          // валидный лот: удержание ≥ 3 мин
  minPips: 3,                 // валидный лот: движение ≥ 3 пипса
};

export const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
export const MONTHS_SHORT = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
export const DOW = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

/**
 * @helper formatDate
 * @description Formats Date → "15 апр 2026".
 */
export const formatDate = d => {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * @helper formatPeriod
 * @description Formats a date range. Same month → "1 — 30 апр 2026"; иначе "15 апр — 15 мая 2026".
 */
export const formatPeriod = (start, end) => {
  if (!start || !end) return 'Не задан';
  const s = start instanceof Date ? start : new Date(start);
  const e = end instanceof Date ? end : new Date(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.getDate()} — ${e.getDate()} ${MONTHS_SHORT[e.getMonth()]} ${e.getFullYear()}`;
  }
  return `${s.getDate()} ${MONTHS_SHORT[s.getMonth()]} — ${e.getDate()} ${MONTHS_SHORT[e.getMonth()]} ${e.getFullYear()}`;
};

/**
 * @helper formatPrize
 * @description Renders prize amount as compact "$500" / "$1K" / "$1.5K".
 */
export const formatPrize = amount => {
  if (amount >= 1000) {
    const k = amount / 1000;
    return `$${k % 1 === 0 ? k : k.toFixed(1)}K`;
  }
  return `$${amount}`;
};

/**
 * @helper parseCurrency
 * @description Extracts numeric value from user-entered currency string. NaN → 0.
 */
export const parseCurrency = v => parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0;

/**
 * @helper maskClientName
 * @description Masks a full name to demo-safe form "Client_A****".
 */
export const maskClientName = full => {
  if (!full) return 'Client_****';
  const first = full.split(/\s+/)[0] || full;
  return `Client_${first.charAt(0).toUpperCase()}****`;
};

/**
 * @helper getStatusTagVariant
 * @description Maps status string → Tag variant.
 */
export const getStatusTagVariant = status => {
  const map = {
    'Active': 'positive', 'active': 'positive',
    'Draft': 'neutral', 'draft': 'neutral',
    'Pending': 'warning', 'pending': 'warning',
    'Flagged': 'negative', 'flagged': 'negative',
    'Completed': 'neutral', 'completed': 'neutral', 'Done': 'neutral', 'done': 'neutral',
    'Starts soon': 'info',
  };
  return map[status] || 'neutral';
};

/**
 * @helper getStatusLabelRu
 * @description Translates English status to Russian UI label (audit F-1 fix 2026-04-24).
 * Status кодируется на backend EN (Active/Draft/etc), UI показывает RU.
 */
export const getStatusLabelRu = status => {
  const map = {
    'Active': 'Активен',
    'Draft': 'Черновик',
    'Pending': 'Ожидает',
    'Flagged': 'С флагом',
    'Completed': 'Завершён',
    'Done': 'Завершён',
    'Cancelled': 'Отменён',
    'Paused': 'Пауза',
  };
  return map[status] || status;
};

/**
 * @helper onKeyActivate
 * @description Handler factory for Enter/Space keyboard activation.
 * WCAG 2.1.1 — mirrors native button semantics on non-button interactive surfaces.
 */
export const onKeyActivate = (handler) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (handler) handler(e);
  }
};
