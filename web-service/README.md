# Disko — IB Contest Platform

Production-grade web service для IB (Introducing Broker) Contest Platform. Brand 4 (Octa) под брендом **Octa Markets Cyprus Ltd** (CySEC 372/18). Mobile-first, CFD-compliant, demo-ready для stakeholder preview и iteration.

- **Версия**: 0.9.1 (wizard 2.0 partial port from team MR, 2026-04-23)
- **Stack**: Vite 5.4 + React 18 + react-router-dom 6.26
- **DS**: Octa Foundations (primary #1945ff, Title 02/03, Body 02, Utility 01)
- **Compliance footprint**: ESMA-aligned warning, CySEC entity, offshore IB conditional warning

**Для команды, которая продолжит работу** — начинайте с [`HANDOFF.md`](HANDOFF.md). Текущий list задач — [`BACKLOG.md`](BACKLOG.md). История всех изменений — [`CHANGELOG.md`](CHANGELOG.md).

---

## Quick start

```bash
cd web-service
npm install
npm run dev        # dev server http://localhost:5173, HMR
npm run build      # production dist/ → 311 KB JS / 53 KB CSS / 97 KB gzip
npm run preview    # test prod build локально http://localhost:4173
```

Prerequisites: **Node.js ≥ 20, npm ≥ 10**.

## Deploy

Configs готовы для обеих платформ. Cache-busting headers + SPA redirects included:

```bash
# Netlify
npx netlify deploy --prod --dir=dist

# Vercel
npx vercel --prod
```

`netlify.toml` + `vercel.json` настроены:
- `/assets/*` — immutable 1 year (hashed)
- `/index.html` + `/` — no-cache must-revalidate (fresh build всегда)
- Security headers: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin
- SPA fallback: all paths → `/index.html`

## Environment

```bash
# .env.local (demo mode)
VITE_MODE=demo
VITE_BRAND=octa

# .env.production (wire up real backend)
VITE_MODE=prod
VITE_API_BASE=https://api.disko.octa.com
VITE_BRAND=octa
```

`src/lib/config.js` читает эти переменные. `src/lib/store.js` switches backend через `isDemoMode()`:
- **Demo**: localStorage, SEED hydration, simulated 80-140ms latency
- **Prod**: fetch к `VITE_API_BASE` (stub — требует wiring)

## Структура

```
src/
├── main.jsx              — React 18 root + ErrorBoundary + ToastProvider + RouterProvider
├── App.jsx               — shell: TopNav + skip-link + <main> + <Outlet />
├── index.css             — DS tokens (Octa) + Brand 4 namespace + utilities (1200+ lines)
├── assets/sprite.svg     — SVG icon sprite (inlined в App через ?raw)
├── lib/
│   ├── config.js         — VITE_* env reader
│   ├── helpers.js        — formatters, getStatusLabelRu, onKeyActivate
│   ├── seed.js           — SEED demo data + CONTEST_TYPES (4 types)
│   ├── store.js          — localStorage-backed data abstraction + simulateLatency
│   └── routes.jsx        — createBrowserRouter map (10 routes)
├── components/           — 23 DS components, 1 файл на компонент
│   ├── Button, Tag, Modal (с createPortal), Input, Checkbox, Toggle, ...
│   ├── ContestIcon3D     — flat DS icon wrapper (tinted bg + sprite icon)
│   ├── LeaderboardPrizeHero — prize tier breakdown (gold/silver/bronze)
│   ├── RankDelta         — ↑N / ↓N / — indicator
│   ├── Skeleton          — shimmer loading placeholder
│   ├── RegulatoryFooter  — CySEC compliance footer
│   └── ResponsiveTable   — dual-mode desktop/mobile card-list
└── screens/              — 9 screens
    ├── IBMyContests + IBCreateContest (5-step wizard) + IBContestDetail
    ├── ClientContestList + ClientContestTerms + ClientLeaderboard
    ├── AdminDashboard + AdminContestDetail
    └── NotFound
```

## Routes

| Path | Screen | Role |
|------|--------|------|
| `/` | redirect → `/ib/contests` | — |
| `/ib/contests` | IBMyContests | IB Partner |
| `/ib/contests/new` | IBCreateContest (5-step wizard) | IB Partner |
| `/ib/contests/:id` | IBContestDetail | IB Partner |
| `/client/contests` | ClientContestList | Client / Trader |
| `/client/contests/:id` | ClientContestTerms | Client |
| `/client/contests/:id/board` | ClientLeaderboard | Client |
| `/admin` | AdminDashboard | Admin |
| `/admin/contests/:id` | AdminContestDetail | Admin |
| `*` | NotFound | — |

## End-to-end flows (demo)

1. **IB создаёт контест**: `/ib/contests` → «Создать контест» → wizard 5 шагов (type → period → rules → prizes → confirm) → `store.createContest` → redirect `/ib/contests` → новый контест persisted.
   - Step 5 поддерживает edit-jump: pencil icon per summary row → возврат к нужному шагу.
   - Wizard валидирует Next через toast + scrollIntoView на невалидном (не блокирует).
2. **Client участвует**: `/client/contests` → card → terms → «Принять вызов» → `store.createParticipation` → leaderboard с RankDelta.
3. **Admin рассматривает алерт**: `/admin` → flagged контест → detail → «Дисквалифицировать» / «Передать compliance» / «Ложное срабатывание». Все actions append в `audit_log`, persist.

Smoke tests автоматизированы через Playwright (см. `HANDOFF.md § E2E`). Last run: 3/3 PASSED.

## Data flow

Экраны читают/пишут **только через `store`**. Никаких прямых SEED imports в компоненты.

```js
import { store } from '../lib/store.js';
const contest = await store.getContest(id);
await store.appendAudit(id, { text: '...', alert: false });
```

Demo mode behavior:
- Первая загрузка → SEED clone записан в localStorage (`disko:state:v3`)
- Каждая мутация → persist
- Reload → state восстанавливается
- `localStorage.clear()` → re-seed при next read

Reset к SEED programmatically:
```js
await store.resetToSeed();
```

## Accessibility (WCAG 2.2 AA)

- **Contrast**: 4.5:1 minimum для text (verified 7.07 на notification title, 5.02+ везде)
- **Reflow 1.4.10**: 320 CSS px minimum, 0 horizontal scroll (verified)
- **Keyboard**: Tab-reachable all interactive, Enter/Space activation, Escape closes modal
- **Focus-visible**: 2px outline primary color + offset 2px
- **Landmarks**: `<main id="main-content">` + skip-link, `<nav>` topnav, `<footer role="contentinfo">` RegulatoryFooter
- **Modal**: `createPortal(document.body)` + focus trap + focus restoration, z-index 9999
- **Form inputs**: aria-labelledby или `<label for>`, required + aria-invalid
- **Touch targets**: 48px min height на primary actions

## CFD Compliance footprint

Не полный legal sign-off — см. `BACKLOG.md § Compliance blockers`.

**Applied**:
- `RegulatoryFooter` — "Octa Markets Cyprus Ltd · CySEC 372/18" + ESMA verbatim loss-rate warning ("71.36% розничных счетов теряют деньги...") на всех client screens
- Inducement copy scrubbed — нет "Выигрывайте", "гарантирован"; нет "бонус" в призах
- `JurisdictionChip` component — trusted (CySEC/FCA/ASIC/DFSA) vs offshore visual
- Offshore IB conditional warning (InfoBox на ClientContestTerms когда `ib.regulatory === 'offshore'`)

**NOT applied (pre-prod legal required)** — см. `BACKLOG.md`:
- Prize type "бонус на торговый счёт" в wizard Step 4 — потенциальный ESMA RULE-043 violation на retail
- Volume-tied prize = ESMA inducement grey zone (needs legal opinion)
- GDPR DPIA для public leaderboard
- KYC gate pre-payout

## Documentation

- [`HANDOFF.md`](HANDOFF.md) — как команда может продолжить автономно
- [`BACKLOG.md`](BACKLOG.md) — task queue + deferred + roadmap
- [`CHANGELOG.md`](CHANGELOG.md) — история изменений
- `../CLAUDE.md` — methodology (Quadruple Diamond discovery framework)
- `../prototype/index-octa.html` — оригинальный single-file discovery prototype (source of truth для UX decisions)

## Known bundle

- JS: **311 KB** / 97 KB gzip
- CSS: **53 KB** / 9.4 KB gzip
- HTML: 0.7 KB / 0.55 KB gzip
- Build: 430-480ms stable
- Bundle target для next iteration: JS < 250 KB (React.lazy per route)
