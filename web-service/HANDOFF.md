# Disko — Team Handoff

Документ для команды, которая продолжит работу автономно. Прочитать **до первого commit**.

---

## TL;DR

- **Что получили**: production-grade Vite + React Disko web service, 9 screens, 23 components, Octa DS-aligned, CFD-compliant (baseline), mobile-first, WCAG 2.2 AA.
- **Что работает**: E2E flows 3/3 (IB wizard create, client participate, admin audit), 0 console errors, 0 horizontal overflow 320px, все DS tokens bound.
- **Что надо сделать**: см. [`BACKLOG.md`](BACKLOG.md). P0 — compliance legal sign-off перед prod. P1 — polish + real backend wiring.
- **Contact points**: владелец код — IB team. Владелец DS — Octa Foundations (Figma fileKey `qF8eUWRGaTaLI0JizOIrnY`). Владелец compliance decisions — legal.

---

## Первые 30 минут

### 1. Прогнать локально

```bash
cd web-service
node --version       # ≥ 20
npm install
npm run dev          # http://localhost:5173
```

Должно открыться без console errors. Если есть — stop, проверить Node.js версию, почистить `node_modules` + `package-lock.json`, `npm install` заново.

### 2. Прокликать 3 flow

- `/ib/contests/new` → wizard 5 steps → «Запустить контест» → появляется в списке
- `/client/contests` → card → «Принять вызов» → leaderboard
- `/admin/contests/c-005` → «Дисквалифицировать» → audit trail получает новую запись

Если что-то из этого ломается — это P0 regression, см. [`BACKLOG.md`](BACKLOG.md) и откат через git.

### 3. Прочитать 3 ключевых файла

1. [`README.md`](README.md) — overview, stack, структура, routes, deploy
2. [`BACKLOG.md`](BACKLOG.md) — task queue с приоритетами
3. [`CHANGELOG.md`](CHANGELOG.md) — история изменений

---

## Архитектура — ключевые решения

### Data layer (store.js)

**Всё через `store`. Никаких прямых SEED imports в screens/components.**

```js
import { store } from '../lib/store.js';

// Read
const contest = await store.getContest(id);
const parts = await store.listParticipations(contestId);

// Write
await store.createContest({ name, typeId, start, end, prize_pool });
await store.appendAudit(contestId, { text: 'Admin paused', alert: true });
```

Demo mode = localStorage (`disko:state:v3`). Prod mode = REST fetch (stub — требует wiring, см. BACKLOG P1).

**Когда меняете SEED** — bump state version: `const KEY = 'disko:state:v4'` (иначе старый localStorage перехватит). Version uz v2 → v3 было в audit fix 2026-04-24.

### Routing

`src/lib/routes.jsx` — `createBrowserRouter`. 10 routes, 3 namespaces (IB / Client / Admin). `*` → NotFound.

### DS Tokens — single source of truth

`src/index.css` top (lines 1-200) — все `--ds-*` и `--brand4-*` tokens. Foundations из Figma `qF8eUWRGaTaLI0JizOIrnY`.

**Правило**: никаких hardcoded hex/px/rem **вне** top section. Все компоненты используют `var(--ds-*)`.

Exception — `--ds-medal-gold-bg` / `-silver-bg` / `-bronze-bg` для prize tiers (LeaderboardPrizeHero). Legally conventional colors.

### Components

- **Button** — variants: primary / secondary / tertiary / outline / positive / negative / text. Sizes m / s.
- **Tag** — variants: positive / negative / warning / info / neutral / brand / inactive. Always `getStatusLabelRu()` для backend status strings.
- **Modal** — **must** be via `createPortal(document.body)` + `z-index: 9999`. Иначе topnav перекрывает на mobile.
- **ContestIcon3D** — legacy name (теперь flat). Tinted bg per type + sprite icon.
- **LeaderboardPrizeHero** — используется на `/client/.../board` и `/ib/.../:id`. Client + IB visual parity.
- **RankDelta** — ↑N green / ↓N red / — grey flat. Одна реализация везде.
- **ResponsiveTable** — dual-mode. `mobileCard` prop для 375 rendering.

### A11y invariants (не ломать!)

- Modal: focus trap + Escape + focus restore. Через `useRef` + `useEffect` cleanup.
- Skip-link: `<a class="skip-link" href="#main-content">` — первый focusable.
- ResponsiveTable: mobile card role="list" с identical aria-label как desktop row.
- `contrast ≥ 4.5:1` для text — проверить через `getStatusLabelRu` + `--ds-negative-text-on-bg` при negative notification.

---

## Что делать / не делать

### DO

- ✅ **Commit incrementally** — 1 commit = 1 logical change. Сложнее откатить 20-строчный diff чем 200-строчный.
- ✅ **Rebuild + smoke test** после каждой правки. `npm run build && npx vite preview`.
- ✅ **Mobile first verify** — всегда тестируй на 375px viewport. `resize browser` + проверить 3 ключевых screens.
- ✅ **Sequential reviews** — design-lead → WCAG → compliance → UX → synth (5 lenses). Не ship с одной проверкой.
- ✅ **RU UI везде** — `getStatusLabelRu()` для backend EN status strings. Исключение: regulator codes (CySEC / FCA / DFSA) — legal conventions.
- ✅ **DS tokens only** — никаких hardcoded hex/px. Добавляешь новый паттерн — сначала token.
- ✅ **State версия bump** при SEED changes — иначе user'ы застрянут в старом localStorage.

### DON'T

- ❌ **Не инлайнить стили** в JSX для layout. Только для one-off positioning. Всё остальное — CSS class.
- ❌ **Не использовать emoji icons** в UI (📅 👥). Всегда sprite `<Icon name="calendar" />`.
- ❌ **Не писать uppercase labels** (`text-transform: uppercase`). Sentence case везде по Octa DS.
- ❌ **Не называть primary action как "Приостановить"** — primary = main intent. Pause = secondary. Cancel = destructive primary (красный).
- ❌ **Не разбирать "system работает" по одному screen** — всегда cross-screen consistency check (L13 lesson). Особенно для patterns типа leaderboard, stat cards, contest card.
- ❌ **Не забывать persist в audit_log** для admin actions. Toast без store.appendAudit = compliance gap.
- ❌ **Не ship без rebuild** — иногда cached dist не отражает latest src. Particularly после CSS changes.

---

## Development workflow

### 1. Взять задачу из BACKLOG

Приоритизация: P0 → P1 → P2 → P3. Внутри приоритета — domain (compliance → UX → visual → refactor).

### 2. Check branch

```bash
git status
git pull origin main  # если work shared
git checkout -b feat/zero-state-client-list
```

### 3. Implement

- Read relevant screen/component files
- Design: если scope > 50 LoC — написать draft перед кодом (см. `.claude/skills/`)
- Apply change
- Rebuild + smoke test
- Screenshot если visual — attach в PR

### 4. Verify

**Local checks**:
```bash
npm run build         # no errors
npm run preview       # starts
# Open localhost:4173
# Check: 1440 + 375 viewport, wizard flow, console errors (should be 0)
```

**Cross-screen check (if visual change)**:
- Если трогал pattern (card / leaderboard / stat) — проверь все 8 screens где он появляется (см. L13 lesson: система — это не один экран)

### 5. Commit

```bash
git add -A src/ memory/ 2>&1  # не добавляй node_modules, dist (если не configured)
git commit -m "feat: zero-state для client empty slot

Addresses BACKLOG P1 item.

Implementation:
- <what changed>

Verified:
- Rebuild: ✅
- E2E smoke: ✅
- Console errors: 0
- Mobile 375: verified

Co-Authored-By: <agent-tool> <email>"
```

### 6. PR

- Title: `[P1] <short description>`
- Body: Copy commit message + BACKLOG item ID + screenshots (before/after)
- Reviewers: кто-то из team, который не делал эту задачу

---

## E2E smoke tests

Not automated framework yet. Manual via Playwright MCP или npm script TBD.

**Minimum smoke (~5 min)**:

```js
// IB wizard create
1. Navigate /ib/contests/new
2. Click data-testid="wizard-step-1-next"
3. Click "Далее" → step 2
4. Click "Далее" → step 3
5. Click "К запуску" → step 5
6. Click "Запустить контест"
7. Assert URL === /ib/contests
8. Assert localStorage contestCount = N+1

// Client participate
1. Navigate /client/contests
2. Click first .contest-card
3. Assert URL matches /client/contests/:id
4. Click button "Принять вызов"
5. Assert URL matches /client/contests/:id/board

// Admin audit persist
1. Navigate /admin/contests/c-005
2. Read state.audit_log['c-005'].length (N)
3. Click [data-testid="s31-disqualify"]
4. Wait 300ms
5. Assert state.audit_log['c-005'].length === N + 1
6. Assert last entry text включает "дисквалифицирован"
```

После любой нетривиальной правки — прогнать все 3. Либо extract в `e2e/smoke.spec.js` (P2 item).

---

## Review lenses (рекомендованные перед ship)

См. `.claude/skills/` в parent workspace. Для external team — простой checklist:

1. **Design-lead lens** — визуальная consistency с DS tokens, hierarchy, spacing. Screenshots cross-screen.
2. **WCAG lens** — contrast 4.5:1, reflow 320px, keyboard nav, aria names.
3. **Compliance lens** — inducement copy, jurisdictional accuracy, disclosure placement. Legal sign-off для prod.
4. **UX lens** — cognitive load, scenario completeness, dead-ends (все actions persist?).
5. **Synth panel** — 3 personas (client trader / IB partner / compliance admin) прогнать end-to-end scenario.

Single lens = false confidence (L12 lesson). Если design-lead ACCEPT, но synth panel находит critical — synth > design-lead.

---

## Known pitfalls

### Modal behind topnav on mobile

**Fixed** через `createPortal(document.body)`. Не меняй на inline render.

### localStorage state version conflicts

Когда меняешь SEED shape — **bump version**: `disko:state:vN` → `vN+1`. Иначе old state breaks schema.

### EN status labels в production build

Всегда use `getStatusLabelRu(status)` при передаче в `<Tag label={...} />`. Backend status strings EN (Active/Draft/etc).

### Mobile card meta overflow

`.contest-card__meta` на 375 с длинными датами разрывается asymmetrically. Fix в BACKLOG P1 (flex-direction column при @media < 640).

### "бонус" как prize type

Если добавляете new prize type copy — **не используйте слово "бонус"**. ESMA RULE-043. Alternatives: "премия", "денежный приз", "денежная награда".

### SEED audit_log timestamps

Формат "DD мес HH:MM" (e.g., "18 апр 11:45"). Не ISO. Это мок, реальный backend будет возвращать ISO → нужно парсить в formatter.

---

## Когда спрашивать

### У себя в команде

- Unclear scope из BACKLOG item — уточнить у PO
- Conflict в DS tokens — Octa Foundations team
- Performance issue — backend / frontend lead

### У legal / compliance

- Prize type decisions (bonus на retail, volume-tied prize)
- Jurisdictional copy (offshore warning wording)
- GDPR / KYC / AML gates

### У Design team

- Multi-brand tokens (Elev8 / UAE) — нужны real
- New patterns (sparkline, zone thresholds) — design direction

---

## Rollback

Если что-то критично сломалось:

```bash
# Last good commit
git log --oneline -10

# Checkout specific commit (temporary)
git checkout <hash>

# Create rollback branch
git checkout -b rollback/broken-feature
git revert <problematic-commit>
git push
```

Nuclear option — baseline snapshots в `memory/artifacts/disko-baseline-pre-evolution-2026-04-23/` и `disko-evolution-final-2026-04-23/` (в parent workspace). Содержат full src/ + dist/ + configs на моменты pre-loop и post-Tier1.

---

## Metric gates перед ship

| Metric | Target | Current |
|--------|--------|---------|
| Console errors (все screens) | 0 | 0 ✅ |
| E2E flows | 3/3 | 3/3 ✅ |
| Bundle JS (gzip) | <100 KB | 97 KB ✅ |
| Bundle CSS (gzip) | <15 KB | 9.4 KB ✅ |
| Build time | <1s | 430-480ms ✅ |
| Contrast (WCAG AA) | 4.5:1+ | 7.07 ✅ |
| Reflow 320px | 0 overflow | 0 ✅ |
| Consistency matrix avg | ≥7/10 | 8.1 ✅ |

---

## Contacts

- **Product owner**: Артур (internal)
- **Frontend lead**: TBD
- **Backend (API wiring)**: TBD
- **Design (Octa DS)**: Octa Foundations team
- **Compliance / Legal**: TBD
- **QA**: TBD

---

**Successful handoff smell**: через 1 день новая команда смогла сделать commit с новой feature без помощи. Через 1 неделю — sustainably работает без внешнего input. Если не — этот документ недостаточен; open issue + request supplement.
