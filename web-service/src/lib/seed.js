/**
 * SEED — initial demo data, single source of truth для 3 ролей.
 * Ported from prototype/index-octa.html Phase 3b.
 *
 * Dates — ISO strings for JSON-safety в localStorage. Rehydration
 * через seed → store.hydrate восстанавливает Date objects.
 *
 * Plan: memory/artifacts/disko-demo-seed-plan-2026-04-23.md
 * Personas: memory/artifacts/disko-ib-personas-2026-04-23.md
 */

export const CONTEST_TYPES = {
  volume: {
    id: 'volume',
    title: 'Volume Race',
    desc: 'Кто наторгует больше лотов за период',
    shortDesc: 'Ранжирование по торговому объёму за период.',
    icon: 'chart',
    circle: 'primary',
    typeIcon: 'volume',
    metric: 'Объём (лоты)',
    scoring: {
      formula: 'Score = Σ объём качественных сделок (в лотах)',
      rules: [
        'Учитываются только сделки объёмом ≥ минимального лота (по умолчанию 0.1)',
        'Минимальное время удержания позиции — 5 минут (защита от wash-trading)',
        'Встречные одновременные buy+sell по одному инструменту не учитываются',
        'Результат обновляется в реальном времени после закрытия сделки',
      ],
      tiebreak: 'При равном объёме — выше тот, кто раньше достиг результата',
    },
  },
  streak: {
    id: 'streak',
    title: 'Trading Streak',
    desc: 'Кто торгует больше дней подряд',
    shortDesc: 'Серия торговых дней подряд — тест дисциплины.',
    icon: 'flame',
    circle: 'warning',
    typeIcon: 'streak',
    metric: 'Дней подряд',
    scoring: {
      formula: 'Score = max длина непрерывной серии торговых дней',
      rules: [
        'Торговый день = хотя бы одна качественная сделка за сутки (UTC)',
        'Качественная сделка: объём ≥ 0.1 лот, удержание ≥ 5 мин',
        'Пропуск дня обнуляет текущую серию, но не стирает лучший результат',
        'Финальный Score — максимальная серия за период контеста',
      ],
      tiebreak: 'При равной серии — выше тот, у кого больше сделок суммарно',
    },
  },
  top: {
    id: 'top',
    title: 'Top Trader',
    desc: 'Комбинация объёма и частоты',
    shortDesc: 'Комбинация объёма и стабильности торговли.',
    icon: 'trophy',
    circle: 'positive',
    typeIcon: 'top',
    metric: 'Score (0–100)',
    scoring: {
      formula: 'Score = (Volume_norm × 0.6) + (ActiveDays_norm × 0.4)',
      rules: [
        'Volume_norm — объём участника / объём лидера (0..1)',
        'ActiveDays_norm — активных дней участника / длительность контеста (0..1)',
        'Объём учитывается по правилам Volume Race',
        'Активный день = хотя бы одна качественная сделка',
        'Итоговый Score нормализуется в шкалу 0–100',
      ],
      tiebreak: 'При равном Score приоритет у участника с большим Volume_norm',
    },
  },
  grow: {
    id: 'grow',
    title: 'Grow your account',
    desc: 'Кто больше нарастит баланс в процентах',
    shortDesc: 'Ранжирование по относительному росту баланса.',
    icon: 'trending-up',
    circle: 'grow',
    typeIcon: 'grow',
    metric: 'Прирост, %',
    scoring: {
      formula: 'Score = (EndBalance_adj − StartBalance) / StartBalance × 100 %',
      rules: [
        'StartBalance — баланс счёта в момент старта контеста',
        'EndBalance_adj = финальный баланс − (пополнения − выводы за период)',
        'Пополнения и выводы исключаются из прироста, чтобы оценивать только результат торговли',
        'Открытые позиции на момент фиксации оцениваются по рыночной цене',
        'Минимальный стартовый баланс для участия задаётся IB (по умолчанию $100)',
      ],
      tiebreak: 'При равном %: выше тот, у кого меньше максимальная просадка за период',
    },
  },
};

export const CONTEST_TYPE_LIST = Object.values(CONTEST_TYPES);

export const JURISDICTION_TRUSTED = new Set(['cysec', 'fca', 'asic', 'dfsa']);
export const JURISDICTION_LABELS = { cysec: 'CySEC', fca: 'FCA', asic: 'ASIC', dfsa: 'DFSA', offshore: 'Offshore' };

/**
 * Initial SEED snapshot. Dates stored as ISO strings — rehydrated to Date в store.list().
 */
export const SEED = {
  meta: { demo_date: '2026-04-23', brand: 'octa-ib', seeded: true, current_ib: 'ib-a', current_client: 'client-a' },

  ib_partners: [
    { id: 'ib-a', name: 'Partner_A', country: 'Cyprus',     volume_tier: 'mid',  regulatory: 'cysec' },
    { id: 'ib-b', name: 'Partner_B', country: 'Vietnam',    volume_tier: 'high', regulatory: 'offshore' },
    { id: 'ib-c', name: 'Partner_C', country: 'Mexico',     volume_tier: 'low',  regulatory: 'offshore' },
    { id: 'ib-x', name: 'Partner_X', country: 'Seychelles', volume_tier: 'high', regulatory: 'offshore' },
  ],

  clients: [
    { id: 'client-a', masked_name: 'Client_A****', country: 'Germany',     account_type: 'pro',      total_volume: 12400 },
    { id: 'client-b', masked_name: 'Client_B****', country: 'France',      account_type: 'standard', total_volume:  9800 },
    { id: 'client-c', masked_name: 'Client_C****', country: 'Vietnam',     account_type: 'standard', total_volume:  7600 },
    { id: 'client-d', masked_name: 'Client_D****', country: 'Mexico',      account_type: 'micro',    total_volume:  4500 },
    { id: 'client-e', masked_name: 'Client_E****', country: 'Spain',       account_type: 'standard', total_volume:  3200 },
    { id: 'client-f', masked_name: 'Client_F****', country: 'Indonesia',   account_type: 'pro',      total_volume:  8100 },
    { id: 'client-g', masked_name: 'Client_G****', country: 'Italy',       account_type: 'standard', total_volume:  2700 },
    { id: 'client-h', masked_name: 'Client_H****', country: 'Poland',      account_type: 'micro',    total_volume:  1800 },
    { id: 'client-i', masked_name: 'Client_I****', country: 'Colombia',    account_type: 'standard', total_volume:  5400 },
    { id: 'client-j', masked_name: 'Client_J****', country: 'Thailand',    account_type: 'pro',      total_volume:  6200 },
    { id: 'client-k', masked_name: 'Client_K****', country: 'Brazil',      account_type: 'standard', total_volume:  3900 },
    { id: 'client-l', masked_name: 'Client_L****', country: 'Philippines', account_type: 'micro',    total_volume:  1500 },
    { id: 'client-m', masked_name: 'Client_M****', country: 'Portugal',    account_type: 'standard', total_volume:  2400 },
    { id: 'client-n', masked_name: 'Client_N****', country: 'Greece',      account_type: 'standard', total_volume:  2100 },
    { id: 'client-z', masked_name: 'Client_Z****', country: 'Russia',      account_type: 'pro',      total_volume: 18600, flagged: true },
  ],

  contests: [
    { id: 'c-001', name: 'Весенний Volume Race',  typeId: 'volume', status: 'Active',    ib: 'ib-a', start: '2026-04-01', end: '2026-04-30', prize_pool: 900,  progress: 33, days_left: 20 },
    { id: 'c-002', name: 'Streak Challenge May',  typeId: 'streak', status: 'Draft',     ib: 'ib-a', start: null,         end: null,         prize_pool: 600,  progress: 0,  days_left: null },
    { id: 'c-003', name: 'Grow Challenge Q2',     typeId: 'grow',   status: 'Active',    ib: 'ib-b', start: '2026-04-01', end: '2026-04-30', prize_pool: 900,  progress: 45, days_left: 20 },
    { id: 'c-004', name: 'Турнир февраля',        typeId: 'top',    status: 'Completed', ib: 'ib-a', start: '2026-02-01', end: '2026-02-28', prize_pool: 900,  progress: 100 },
    { id: 'c-005', name: 'Mega Contest',          typeId: 'volume', status: 'Flagged',   ib: 'ib-x', start: '2026-04-01', end: '2026-04-30', prize_pool: 1700, progress: 60, flagged: true },
    { id: 'c-006', name: 'Spring Challenge',      typeId: 'volume', status: 'Active',    ib: 'ib-c', start: '2026-04-15', end: '2026-05-15', prize_pool: 450,  progress: 20, days_left: 23 },
  ],

  participations: {
    'c-001': [
      { client: 'client-a', volume: 245.3, rank: 1, prize: 500, delta:  0 },
      { client: 'client-b', volume: 198.7, rank: 2, prize: 300, delta:  1 },
      { client: 'client-c', volume: 156.2, rank: 3, prize: 100, delta: -1 },
      { client: 'client-d', volume: 134.0, rank: 4, delta:  2 },
      { client: 'client-e', volume: 112.8, rank: 5, delta:  0 },
      { client: 'client-f', volume:  98.4, rank: 6, delta: -2 },
      { client: 'client-g', volume:  87.1, rank: 7, delta:  1 },
      { client: 'client-h', volume:  74.2, rank: 10, delta:  3 },
      { client: 'client-i', volume:  67.4, rank: 12, self: true, delta:  4 },
      { client: 'client-j', volume:  61.0, rank: 13, delta: -1 },
      { client: 'client-k', volume:  55.3, rank: 14, delta:  0 },
    ],
    'c-005': [
      { client: 'client-z', volume: 312.5, rank: 1, trades: 89, avg_hold: '2 мин', flagged: true },
      { client: 'client-a', volume: 187.3, rank: 2, trades: 42, avg_hold: '47 мин' },
      { client: 'client-b', volume: 145.8, rank: 3, trades: 35, avg_hold: '1.2 ч' },
      { client: 'client-c', volume: 112.0, rank: 4, trades: 28, avg_hold: '35 мин' },
      { client: 'client-d', volume:  98.4, rank: 5, trades: 24, avg_hold: '52 мин' },
    ],
  },

  alerts: [
    {
      id: 'alert-001', severity: 'high', contest_id: 'c-005', ib_id: 'ib-x', client_id: 'client-z',
      type: 'wash_trading_suspected',
      desc: 'Client_Z: 200 лотов за 1 час, средняя позиция 2 мин — возможный wash trading',
      auto_detected: true,
      created_at: '2026-04-18T11:45:00Z', status: 'open',
    },
  ],

  audit_log: {
    'c-005': [
      { time: '18 апр 11:45', text: 'Алерт: Client_Z помечен — паттерн wash trading', alert: true },
      { time: '15 апр 09:00', text: 'Контест запущен' },
      { time: '10 апр 14:33', text: 'Авто-одобрен (стандартные правила)' },
      { time: '10 апр 14:32', text: 'Контест создан партнёром Partner_X' },
    ],
  },
};
