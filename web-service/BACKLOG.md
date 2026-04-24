# Disko Web Service — Backlog

Задачи, findings и roadmap для продолжения работы. Закрытое не удаляем — переносим в `## Done`.

Формат: `- [ ] [priority] описание → owner / context`

Priorities:
- **P0** — блокирует shippable demo / ломает product / compliance-critical
- **P1** — ухудшает UX но не блокирует
- **P2** — polish, design choices, refactoring
- **P3** — ideas, long-term

---

## Active

### P0 — compliance blockers (require legal sign-off pre-prod)

- [ ] [P0] **"Бонус" как prize type на CFD retail** — потенциальный ESMA RULE-043 violation. Wizard Step 4 text showing "Бонус на торговый счёт" как prize option. Decision: (a) cash-only prize type, (b) pro-clients-only gate, (c) legal memo подтверждающий что конкретная форма разрешена. → ai-review-compliance + legal team
- [ ] [P0] **Volume-tied prize как ESMA inducement** — prize pool размер зависит от traded volume. Grey zone в ESMA CFD marketing guidelines § 4.2. Legal opinion нужна до prod. → legal
- [ ] [P0] **GDPR DPIA для public leaderboard** — публичная демонстрация volumes других traders (даже masked names). Data Protection Impact Assessment обязательна EU retail. → privacy officer
- [ ] [P0] **KYC gate pre-payout** — сейчас нет проверки KYC перед zачислением приза. AML compliance requirement. → backend team

### P1 — Wizard 2.0 partial port (2026-04-23)

- [ ] [P1] **JoinContestModal** — клиент заходит с витрины, видит "Принять вызов" → открывается modal: balance check → MT4/MT5 account radio → inline deposit → "+ Создать аккаунт". Сейчас Accept ведёт сразу на `/client/contest/:id/board` без modal. Portировано из prototype wizard 2.0. Требует: (a) SEED extension `trading_accounts: [{id, type: 'MT4'|'MT5', balance, currency}]`, (b) `<JoinContestModal />` component, (c) замена Accept button в `ClientContestTerms`. → medium scope.
- [ ] [P1] **WizardPreviewCard → reuse ContestCard pattern** — currently custom layout. Prototype 2.0 использует shared list-card structure для консистентности. Refactor: заменить `.preview-inner__*` classes на `.contest-card__*` с `.contest-card__prize`, `.contest-card__meta`, `.contest-card__progress`. Small scope, visual QA required.
- [ ] [P1] **AM/PM + timezone в backend contest contract** — UI собирает `startTime/endTime/meridiem/timezone`, но `store.createContest` принимает только `start/end` Date. Mapping: build ISO string из date+time+meridiem+tz на persist. → backend API decision.
- [ ] [P1] **DS digit icons для WizardStepper** — prototype использует `ic-digit-1-24..4-24` из DS sprite. Сейчас WizardStepper рендерит числа через CSS counter. Добавить spritesheet entries + swap. Small scope.

### P1 — UX / functional полировка

- [ ] [P1] **Zero-state для empty slots на `/client/contests`** — при N контестов mod 3 ≠ 0 grid показывает empty slot. Placeholder card "Новые контесты скоро" с illustration + CTA «Подписаться на анонсы». Альтернатива: центровать последний row или `minmax(340px, 1fr)` auto-fill. Сейчас при 5 контестах визуально виден gap.
- [ ] [P1] **Admin actions hierarchy** — "Приостановить" показан primary blue, "Отменить контест" — red. Конфликт: pause обычно secondary action, destructive в низ как primary negative. → redesign decision
- [ ] [P1] **Mobile client card meta wrap** — `.contest-card__meta` на 375px разрывает "dates · participants" на 2 row зависимо от длины date. CSS fix: `flex-direction: column` при `@media (max-width: 640px)` → uniform rendering. 5 min.
- [ ] [P1] **Wizard autosave on-blur** (R2 research recommendation) — wizard state сейчас persist только на step transition. Закрытие вкладки посередине = потеря. Fix: debounced localStorage write on input blur. Медиум scope.
- [ ] [P1] **Real backend API integration** — `store.js` prod mode = fetch stub, не wired. Нужно: (a) определить API contract, (b) реализовать REST endpoints `/api/contests`, `/api/participations`, `/api/audit-log`, (c) swap `simulateLatency()` на real fetch, (d) error handling + retry.

### P1 — Visual polish (low-risk)

- [ ] [P1] **Info-icon orphan на AdminContestDetail** — `<ContestTypeInfo />` в h1 row рендерится изолированно после Flagged/Cancelled/Paused tags. Visually orphan. → reorder или group с type meta.
- [ ] [P1] **h1 "Admin Panel — Contests" — "Contests" EN** — остальной UI RU. Change to "Админ-панель — контесты" или "Админ — все контесты". 1 line.
- [ ] [P1] **Admin breadcrumb "Dashboard"** — частично EN. Change to "Панель". 1 line.

### P2 — refactor / extract

- [ ] [P2] **ContestIcon3D → rename к ContestIcon** — legacy name kept для backward compat, но component теперь flat. Rename requires imports update в 6 мест.
- [ ] [P2] **Wizard steps extract in separate files** — IBCreateContest.jsx сейчас 350+ lines с 5 inline sub-components (WizardStepType, Period, Rules, Prizes, Confirm). Extract в `src/screens/wizard/Step{1-5}.jsx`. Testability + maintainability.
- [ ] [P2] **Bundle optimization** — React.lazy + Suspense per route для code splitting. Target JS gzip < 75 KB (currently 97 KB). ~30 min CC.
- [ ] [P2] **Sparkline на LeaderboardPrizeHero** (R1 research medium-confidence) — показать rank trend over time. Requires SEED data extension (`deltaHistory` per participant). Pro: traders видят direction. Con: clutter на 375.
- [ ] [P2] **Multi-brand theme swap** — draft в `memory/drafts/disko-multibrand-theme-2026-04-23.md`. Requires real Elev8/UAE tokens от Brand team. Placeholder implementation достаточен для demo architecture validation.
- [ ] [P2] **Prize zone threshold line на leaderboard** (R1 Draft A Duolingo zones) — visual separation "призовая зона / неиграющая зона". В ClientLeaderboard hero уже показан "43% до призовой зоны" — можно добавить visible line в table.

### P3 — long-term / research

- [ ] [P3] **Dark mode** — CSS `[data-theme="dark"]` selector с override на `--ds-*` tokens. 30-45 min. Value для night trading UX.
- [ ] [P3] **Animation polish** — stagger entrance animations на list items (CSS `animation-delay: calc(var(--i) * 50ms)`).
- [ ] [P3] **Screen reader manual pass** — NVDA / VoiceOver semantics verification. Automated a11y checks PASS, но manual SR walkthrough не делался.
- [ ] [P3] **Progressive Web App manifest** — offline leaderboard view для traders в транзите.
- [ ] [P3] **Dashboard density research** — R3 patterns уже applied на stat cards. Next: dense data views (large contests с 200+ участниками) — virtual scrolling, sticky header.

---

## Deferred (research saved, requires decision)

Research artifacts живут в `../../memory/research/` (relative to workspace root). Cannot be actioned без Арtур / PO decision:

- **R1** `leaderboard-ux-patterns-2026-04-23.md` — 7 patterns, 4 applied. Остальные deferred: prize zone threshold, sparkline, promotion/demotion zones (Duolingo).
- **R2** `wizard-ux-patterns-2026-04-23.md` — 7 patterns, 2 applied (edit-jump + active-next). Остальные: autosave, progress indicator alternative, conversational vs linear.
- **R3** `financial-dashboard-density-2026-04-23.md` — 7 patterns, 2 applied (trend lines только на real deltas, consistent cards format). Остальные: sparkline, time window toggle, mini-chart hero.
- **R4** `regulatory-chip-ux-2026-04-23.md` — 7 patterns, 1 applied (ESMA warning formula). Остальные compliance-adjacent — routing через ai-review-compliance.

---

## Done (post-evolution, 2026-04-23 → 2026-04-24)

### Wizard 2.0 partial port (2026-04-23, from prototype 0e54cb9)
- [x] **4 шага вместо 5** — WIZARD_TOTAL_STEPS=4, Rules step удалён, условия стали фиксированными (FIXED_CONDITIONS)
- [x] **Бонус как prize type убран** — ESMA RULE-043 compliance. Остались cash + gift. Default prize type = 'cash'
- [x] **Dropdown + InfoTip components** — portированы из prototype (DS-styled select + focus-visible tooltip)
- [x] **Confirm 2-col grid k/v** с pencil-jump editable rows + InfoTip на «валидный лот»
- [x] **AM/PM chips + time input + timezone** — explicit AM/PM понятнее US/UK клиентам чем 24hr. 8 timezones (CySEC Cyprus, Dubai UAE, London, Moscow и т.д.)
- [x] **CalendarInput icon-right option** — `iconPlacement="right"` prop, используется в wizard step 2

### Compliance
- [x] **RegulatoryFooter** с CySEC entity + 71.36% ESMA verbatim warning на 3 client screens
- [x] **Inducement copy** rewritten: "Выигрывайте реальные призы" → "Ранжирование…", "гарантирован" → "зарезервирован", "заберите приз" → "премия по итогам"
- [x] **"Бонус" слово убрано** из prize list на ClientContestTerms (ESMA RULE-043)
- [x] **Offshore IB warning** — conditional render когда `ib.regulatory === 'offshore'` на ClientContestTerms

### Consistency (visual system)
- [x] **Leaderboard unified** — client board + IB detail share pattern (prize hero + RankDelta column + prize tags); admin legitimate variant с trades/hold cols
- [x] **Stat cards format** — все 3 screens `stats--cards`, trend только на real deltas (убраны fake "идут сейчас" / "активные контесты" / "без изменений")
- [x] **Wizard active state** unified — один visual pattern для quick-start и mechanics cards
- [x] **Contest card restructure** — 3 logical groups: prize dedicated row (tonal highlight) + temporal (dates + participants) + progress (bar + days). Prize вынесен из description narrative.
- [x] **Flat DS icons** — ContestIcon3D swap gradient+shadow к sprite stroke icons (chart/flame/trophy/trending-up)
- [x] **TopNav tonal active** — rgba(22,22,22,0.08) вместо solid primary pill
- [x] **Self-row leaderboard highlight** — outer CSS class `.card-list__item.highlight`, не inner inline styles

### Localization
- [x] **Status tag labels RU** — getStatusLabelRu() helper applied: Active→Активен, Draft→Черновик, Completed→Завершён, Flagged→С флагом, Pending→Ожидает
- [x] **Audit Trail SEED entries RU** — было "Alert: Client_Z flagged", "Contest started" — теперь "Алерт: Client_Z помечен — паттерн wash trading", "Контест запущен"
- [x] **All-caps labels убраны** — `u-text-12-upper` без uppercase, Sentence case везде

### A11y
- [x] **WCAG 2.2 AA contrast** — notification title 3.91 → 7.07 (color swap к `--ds-negative-text-on-bg`)
- [x] **WCAG 1.4.10 reflow** — 320px viewport 0 horizontal scroll verified
- [x] **Wizard keyboard** — 5 steps Tab-reachable, Enter activates, edit-jump buttons с aria-label
- [x] **Modal portal** — createPortal(document.body) + z:9999 гарантирует top-level over topnav
- [x] **Skip-link** landmark + focus-visible outline везде

### Admin integrity
- [x] **handleDisqualify persist** — было toast-only без audit write → теперь `store.appendAudit` + toast
- [x] **handleAlertDismiss persist** — "Ложное срабатывание" и "Игнорировать" тоже audit entry
- [x] **"Client_Z****" underscore** — handleDisqualify template literal fix (было "Client Z****" space)

### Infrastructure
- [x] **Cache-busting headers** — `/index.html` + `/` no-cache must-revalidate; `/assets/*` immutable 1 year. Applied на Netlify + Vercel configs.
- [x] **Skeleton loader + shimmer** — ClientContestList loading state instead of blank
- [x] **simulateLatency** — 80-140ms demo в store getters (реализм для skeleton UX)
- [x] **Characterful empty state** — NotFound 3D trophy + dual CTA; IBMyContests empty с hero + "Создать контест"
- [x] **ErrorBoundary fallback** — characterful, tech details в `<details>`, reload + back actions

### E2E validated
- [x] IB wizard 5 steps + edit-jump + launch → persist (6→7 contests)
- [x] Client flow list → terms → Accept → board
- [x] Admin disqualify → audit_log +1 entry verified

---

## Notes

- **Источник правды по задачам** — этот BACKLOG.md. Не дублировать в sidebar / chat / issue tracker без sync.
- **Компайл changelog** — `CHANGELOG.md` для user-facing release notes.
- **Компайл решений** — `../memory/decisions/` (в workspace root) для ADR-style records.
- **Compliance queue** — все [P0 compliance] items route через ai-review-compliance lens + legal team перед prod.
