/**
 * store.js — Data access abstraction. One interface, two backends.
 *
 * Demo mode (VITE_MODE=demo): localStorage-backed. Hydrates from SEED on first boot.
 *   Writes persist через `persist()` на каждую мутацию.
 * Prod mode (VITE_MODE=prod): REST fetch против `${config.apiBase}/*` endpoints.
 *
 * API shape mirrors screen usage — изменения store require никакого screen refactor.
 * В prototype SEED читался напрямую; тут каждый screen должен вызывать store.*.
 */

import { config, isDemoMode } from './config.js';
import { SEED, CONTEST_TYPES } from './seed.js';

const KEY = 'disko:state:v3';

/* ── ISO ↔ Date rehydration ───────────────────────────────
   SEED stores dates as ISO strings для JSON-safety. Контесты с non-null
   start/end rehydrate обратно в Date objects при чтении — screens
   работают с Date напрямую (formatPeriod, CalendarInput etc.).
   ─────────────────────────────────────────────────── */

const rehydrateContest = c => ({
  ...c,
  start: c.start ? (c.start instanceof Date ? c.start : new Date(c.start)) : null,
  end:   c.end   ? (c.end   instanceof Date ? c.end   : new Date(c.end))   : null,
});

const serializeContest = c => ({
  ...c,
  start: c.start instanceof Date ? c.start.toISOString() : c.start,
  end:   c.end   instanceof Date ? c.end.toISOString()   : c.end,
});

/* ── localStorage backend ────────────────────────────────*/

function hydrate() {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    if (console) console.warn('[store] hydrate parse failed, reseeding', e);
  }
  // Clone SEED (иначе module-level mutation).
  const fresh = JSON.parse(JSON.stringify(SEED));
  localStorage.setItem(KEY, JSON.stringify(fresh));
  return fresh;
}

function persist(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    if (console) console.warn('[store] persist failed', e);
  }
}

/* ── Simulated network latency для demo mode ─────────────
   Real backend — skeleton pattern окупается. В demo localStorage мгновенный,
   искусственная задержка показывает loading UX + approximates real API RTT.
   Short (80-140ms) чтобы не раздражать stakeholder preview. */
const simulateLatency = () => {
  if (!isDemoMode()) return Promise.resolve();
  const ms = 80 + Math.floor(Math.random() * 60);
  return new Promise(r => setTimeout(r, ms));
};

/* ── Read helpers (operate on rehydrated state) ──────────*/

function readState() {
  const raw = hydrate();
  return {
    ...raw,
    contests: (raw.contests || []).map(rehydrateContest),
  };
}

/* ── Public API ──────────────────────────────────────────*/

export const store = {
  /**
   * @async listContests
   * @param {{ib?:string,status?:string,role?:string}} [filter]
   * @returns {Promise<Array>}
   */
  async listContests(filter = {}) {
    await simulateLatency();
    const state = readState();
    let list = state.contests;
    if (filter.ib)     list = list.filter(c => c.ib === filter.ib);
    if (filter.status) list = list.filter(c => c.status === filter.status);
    if (filter.role === 'client') {
      // Client только Active + Draft, и не видит flagged IB-x.
      list = list.filter(c => (c.status === 'Active' || c.status === 'Draft') && c.ib !== 'ib-x');
    }
    return list;
  },

  async getContest(id) {
    await simulateLatency();
    const state = readState();
    return state.contests.find(c => c.id === id);
  },

  async createContest(data) {
    const state = readState();
    const id = `c-${String(state.contests.length + 1).padStart(3, '0')}-${Date.now().toString(36)}`;
    const contest = rehydrateContest({
      id,
      name: data.name || 'Новый контест',
      typeId: data.typeId || 'volume',
      status: data.status || 'Active',
      ib: data.ib || state.meta.current_ib,
      start: data.start || null,
      end: data.end || null,
      prize_pool: data.prize_pool || 0,
      progress: 0,
      days_left: data.days_left ?? null,
    });
    state.contests = [...state.contests, serializeContest(contest)];
    persist(state);
    await this.appendAudit(id, { text: `Контест создан (${CONTEST_TYPES[contest.typeId]?.title || contest.typeId})`, alert: false });
    return contest;
  },

  async updateContest(id, patch) {
    const state = readState();
    const idx = state.contests.findIndex(c => c.id === id);
    if (idx < 0) return null;
    const next = { ...state.contests[idx], ...patch };
    state.contests[idx] = serializeContest(rehydrateContest(next));
    persist(state);
    return rehydrateContest(state.contests[idx]);
  },

  async listParticipations(contestId) {
    await simulateLatency();
    const state = readState();
    const list = state.participations[contestId] || [];
    return list
      .map(p => {
        const client = (state.clients || []).find(cl => cl.id === p.client);
        return { ...p, name: client ? client.masked_name : p.client };
      })
      .sort((a, b) => a.rank - b.rank);
  },

  async createParticipation(contestId, clientId) {
    const state = readState();
    state.participations[contestId] = state.participations[contestId] || [];
    const already = state.participations[contestId].find(p => p.client === clientId);
    if (already) return already;
    const nextRank = state.participations[contestId].length + 1;
    const entry = { client: clientId, volume: 0, rank: nextRank, self: clientId === state.meta.current_client };
    state.participations[contestId].push(entry);
    persist(state);
    await this.appendAudit(contestId, { text: `Новый участник: ${clientId}`, alert: false });
    return entry;
  },

  async listAlerts(filter = {}) {
    const state = readState();
    return (state.alerts || []).filter(a => {
      if (filter.severity && a.severity !== filter.severity) return false;
      if (filter.status && a.status !== filter.status) return false;
      if (filter.contest_id && a.contest_id !== filter.contest_id) return false;
      return true;
    });
  },

  async listIBPartners() {
    const state = readState();
    return state.ib_partners || [];
  },

  async getIBPartner(id) {
    const state = readState();
    return (state.ib_partners || []).find(p => p.id === id);
  },

  async listClients() {
    const state = readState();
    return state.clients || [];
  },

  async getAuditLog(contestId) {
    const state = readState();
    return (state.audit_log && state.audit_log[contestId]) || [];
  },

  async appendAudit(contestId, entry) {
    const state = readState();
    state.audit_log = state.audit_log || {};
    state.audit_log[contestId] = state.audit_log[contestId] || [];
    const now = new Date();
    const time = entry.time || `${String(now.getDate()).padStart(2,'0')}.${String(now.getMonth()+1).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    state.audit_log[contestId].unshift({ time, ...entry });
    persist(state);
    return state.audit_log[contestId];
  },

  async getMeta() {
    return readState().meta;
  },

  /** Демо-утилита: сбросить состояние к SEED. */
  async resetToSeed() {
    localStorage.removeItem(KEY);
    return hydrate();
  },

  /* ── Aggregates ─────────────────────────────────────── */

  async getIBStats(ibId) {
    const state = readState();
    const contests = state.contests.filter(c => c.ib === ibId);
    const active = contests.filter(c => c.status === 'Active');
    const participants = contests.reduce((sum, c) => sum + (state.participations[c.id] || []).length, 0);
    const prize_pool = active.reduce((sum, c) => sum + (c.prize_pool || 0), 0);
    return { total: contests.length, active: active.length, participants, prize_pool };
  },

  async getAdminStats() {
    const state = readState();
    const byStatus = s => state.contests.filter(c => c.status.toLowerCase() === s).length;
    return {
      active:    byStatus('active'),
      pending:   byStatus('pending') + byStatus('draft'),
      flagged:   byStatus('flagged'),
      completed: byStatus('completed') + byStatus('done'),
    };
  },
};

/* ── Prod-mode stub ───────────────────────────────────────
   Когда VITE_MODE=prod переключаем на fetch. Интерфейс тот же.
   Stub пока не реализован — переключение через isDemoMode() (тут всё
   через localStorage). В prod подключается отдельный модуль.
   ─────────────────────────────────────────────────────── */

if (!isDemoMode() && config.isDev) {
  console.warn('[store] prod mode set but REST backend not wired — falling back to localStorage');
}
