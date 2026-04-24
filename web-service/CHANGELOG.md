# Changelog

All notable changes к Disko web service.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Версии SemVer.

## [0.9.1] — 2026-04-23 (wizard 2.0 partial port from frontend MR)

Синхронизация с параллельным MR команды (prototype/ 0e54cb9). Portированы улучшения wizard UX без потери compliance fixes из 0.9.0.

### Added
- `Dropdown` component — DS Input trigger + custom options popover (лучше нативного select на Octa design)
- `InfoTip` component — hover/focus-visible tooltip с top/bottom placement
- `MeridiemToggle` inline component в `IBCreateContest` — AM/PM chips для clarity US/UK клиентам
- `FIXED_CONDITIONS` const в `helpers.js` ($100 min balance, 0.01 lot, 1 account, 3 min hold, 3 pips) — замена configurable rules step на фиксированные платформенные условия
- `CalendarInput` prop `iconPlacement='left'|'right'` — icon справа в wizard period step
- `TIMEZONES` const (8 часовых поясов, CySEC Cyprus default UTC+02)

### Changed
- **Wizard 5 → 4 шага** — Rules step удалён, условия стали фиксированными (см. FIXED_CONDITIONS). Упрощение UX: IB не конфигурирует balance/lot/accounts вручную.
- **Prize type dropdown** — убрана опция "Бонус на торговый счёт" (ESMA RULE-043 prohibition на CFD retail). Default = 'cash'.
- **Wizard Confirm step** — 2-col grid k/v layout, editable rows с pencil-jump, fixed conditions rows read-only с `InfoTip` на «Правиле валидного лота» (3 мин + 3 пипса).
- **Wizard Period step** — AM/PM chips + time input + timezone Dropdown. Grid `1fr 260px` для date+time pair.

### Compliance
- ESMA RULE-043 bonus prohibition — "Бонус на торговый счёт" option удалён из wizard prize type select (был 1 из 3)
- Inducement safeguard — валидный лот rule (3 мин hold, 3 pips movement) displayed read-only в Confirm с InfoTip

### Metrics
- Bundle: **314 KB JS / 98 KB gzip**, **56 KB CSS / 10 KB gzip**
- Build time: **450-470ms**
- Console errors: **0**

### Deferred (→ BACKLOG § P1 Wizard 2.0 partial port)
- JoinContestModal (balance check + MT4/MT5 radio + deposit inline)
- WizardPreviewCard → shared ContestCard pattern
- AM/PM + timezone в backend contest contract (ISO mapping)
- DS digit icons для WizardStepper

---

## [0.9.0] — 2026-04-24 (post-evolution baseline)

Full product polish + system-wide consistency audit. Ready for stakeholder demo.

### Added
- `getStatusLabelRu()` helper в `helpers.js` для RU localization of backend EN statuses
- `.contest-card__prize` / `.contest-card__meta` / `.contest-card__progress` CSS classes для 3-group card structure
- `.contest-icon` CSS class (flat DS icon wrapper, replacing gradient 3D)
- `BACKLOG.md` + `HANDOFF.md` + `CHANGELOG.md` для team autonomy

### Changed
- **Contest card restructure** — 3 logical groups (prize highlighted / temporal / progress) вместо 5 muted rows
- **ContestIcon3D** — flat sprite icons (chart/flame/trophy/trending-up) с token-backed tinted bg. Удалены custom SVG + linearGradient + feDropShadow.
- **Status tag labels** — все RU через `getStatusLabelRu()`: Активен / Черновик / С флагом / Ожидает / Завершён
- **SEED audit_log** entries переписаны RU: "Алерт: Client_Z помечен — паттерн wash trading", "Контест запущен", "Авто-одобрен (стандартные правила)", "Контест создан партнёром Partner_X"
- **State version** v2 → v3 (force re-seed для audit_log RU)
- **handleDisqualify** template literal — "Client_Z****" с underscore (было "Client Z****" space)
- **Wizard active state** unified — quick-start + mechanics один visual pattern (blue border + tonal bg, no inner shadow glow)
- **Stat cards format** — все screens `stats--cards`, trend только на real deltas
- **IB detail leaderboard** aligned с client board — prize hero + RankDelta column added
- **Mobile stat card `min-height: 96px`** — equal heights даже если trend отсутствует
- **Prize hero "20 дней" dedupe** — daysLeft prop не passed из screens (единственный display в page header right)

### Fixed
- **ESMA RULE-043 "бонус"** copy убран из prize list ($495 бонус → $495)
- **Inducement language** scrubbed: "Выигрывайте реальные призы" → "Ранжирование…", "гарантирован" → "зарезервирован"
- **Notification title contrast** 3.91 → 7.07 (WCAG AA) через `--ds-negative-text-on-bg`
- **Modal stacking context** — `createPortal(document.body)` + z:9999 гарантирует top-level (было overlapped by topnav на mobile)
- **Self-row leaderboard highlight** — outer CSS class вместо двойной обёртки с inline styles

### Deferred
- Autosave on-blur для wizard (R2 medium scope)
- Bundle React.lazy route splits (target <75 KB JS gzip)
- Multi-brand real tokens (Elev8 / UAE pending Brand team)
- Prize zone threshold line (R1 Draft A Duolingo zones)

### Compliance
- ESMA verbatim warning applied: "71.36% розничных счетов теряют деньги при торговле CFD..."
- Entity correct: "Octa Markets Cyprus Ltd · CySEC 372/18"
- Offshore IB conditional warning (InfoBox) на ClientContestTerms для `ib.regulatory === 'offshore'`

### A11y
- WCAG 2.2 AA contrast audit passed
- WCAG 1.4.10 reflow verified @ 320px (0 horizontal scroll)
- Modal focus trap + Escape + focus restore verified
- RegulatoryFooter `role="contentinfo"`

### Metrics
- Bundle: **311 KB JS / 97 KB gzip**, **53 KB CSS / 9.4 KB gzip**
- Build time: **430-480ms**
- Console errors (8 screens × 2 viewports): **0**
- E2E flows: **3/3 PASSED**
- Consistency matrix average: **8.1 / 10** (было 5.8 в первом audit)

---

## [0.8.0] — 2026-04-23 (compliance + WCAG + review rounds)

### Added
- **Skeleton + SkeletonCard** components с shimmer animation
- **simulateLatency** (80-140ms) в demo mode store getters
- **RegulatoryFooter** component — CySEC entity + ESMA warning
- **LeaderboardPrizeHero** component — 3 medal-colored prize tier cards
- **RankDelta** component — ↑N green / ↓N red / — neutral
- **handleDisqualify + handleAlertDismiss** actions с `store.appendAudit` persist

### Changed
- **TopNav active state** — solid primary pill → tonal rgba(22,22,22,0.08) (Figma Dashboard 2.0 pattern)
- **All-caps labels убраны** — Sentence case, `text-transform: none` везде
- **Admin stat cards EN → RU** — Активные / Черновики / С флагом / Завершённые
- **Wizard Step 5 edit-jumps** — pencil icon per summary row → setStep callback
- **ErrorBoundary fallback** — characterful, SVG illustration, tech details toggle
- **NotFound** — 3D trophy + dual CTA (вместо generic "страница не найдена")

### Fixed
- WCAG-C-01: notification title color → `--ds-negative-text-on-bg`
- Reflow 320px: 0 horizontal overflow
- Wizard active-Next pattern — toast + scrollIntoView вместо disabled
- AdminDashboard chip labels EN → RU (chipLabel map + hanging border fix)

### Research applied
- R1 leaderboard UX (Fortnite + CS2 patterns)
- R2 wizard UX (Stripe Connect edit-jumps, active Next)
- R3 financial dashboard (trend convention)
- R4 regulatory UX (ESMA verbatim)

### Compliance
- Inducement copy rewritten in LeaderboardPrizeHero footnote, IBCreateContest Step 5
- Entity factual error fixed: "Octa Markets Limited" → "Octa Markets Cyprus Ltd"
- Loss rate: "72%" (rounded) → "71.36%" (verbatim ESMA)

---

## [0.5.0] — 2026-04-23 (initial port from HTML prototype)

### Added
- Vite + React 18 project scaffolding
- 23 DS components (Button, Tag, Input, Modal, Toggle, Chips, Breadcrumb, ProgressBar, Medal, ResponsiveTable, Skeleton, etc.)
- 9 screens (IBMyContests, IBCreateContest wizard, IBContestDetail, ClientContestList, ClientContestTerms, ClientLeaderboard, AdminDashboard, AdminContestDetail, NotFound)
- 10 routes через `createBrowserRouter`
- `store.js` — localStorage-backed demo backend
- Octa DS tokens + Brand 4 namespace
- Netlify + Vercel deploy configs

### Migrated from
`../prototype/index-octa.html` — single-file 3780-line HTML prototype (discovery artifact).

---

## [Unreleased]

См. `BACKLOG.md § Active` для next-up items.

Next major version target: **0.10.0** — real backend API integration + zero-state card + mobile meta wrap fix.
