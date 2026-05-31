# Mobile audit screenshots — 390×844 (iPhone 12-like)

Скриншоты сняты на полном продакшн-прототипе [`prototype/index.html`](../../../prototype/index.html), отрендеренном внутри iframe размером 390×844 (iPhone 12-like). Это даёт точное срабатывание media query `@media (max-width: 639px)` без зависимости от внешнего эмулятора.

## Coverage matrix

| Persona     | Screen                                  | File                       |
|-------------|-----------------------------------------|----------------------------|
| IB Partner  | Список контестов (cards + 2×2 stats)    | `ib-list.png`              |
| IB Partner  | Drawer / меню (burger)                  | `ib-drawer.png`            |
| IB Partner  | Wizard, шаг 1 (Тип контеста)            | `ib-wizard-step1.png`      |
| Client      | Список контестов (premium card stack)   | `client-list.png`          |
| Client      | Detail (user-progress hero + лидерборд) | `client-leaderboard.png`   |
| Admin       | Dashboard (stats + банner + filters)    | `admin-dashboard.png`      |
| Admin       | Таблица (с банером и горизонт. скроллом)| `admin-table.png`          |

## Что подтверждается визуально

- **Foundation:** мобильный header 56px, persona-pill, нижний tab bar 64px со специфичными для роли табами.
- **Lists:** IB-таблица превращена в card list; Client получает премиальный card stack с прогрессом и CTA «Статистика».
- **Wizard:** компактный stepper (точки 1·2·3·4 + лейбл шага), single-column body, sticky bottom action bar `[Далее]`, `Посмотреть глазами клиента` как отдельный CTA.
- **Drawer:** open-state с overlay-backdrop, header «IB Partner» + close X, текущий пункт меню выделен.
- **Leaderboard:** sticky-чип позиции пользователя поверх vertical card list (top-3 highlight через ranking-badge).
- **Admin degradation:** баннер «Полное управление и фильтры — на компьютере» поверх `admin-table-scroll` с горизонтальным скроллом.

## Полишь, который не требует отдельного скриншота

- Тосты на mobile поднимаются над tab bar (`bottom: calc(var(--ds-mobile-tabbar-h) + env(safe-area-inset-bottom, 0px) + var(--ds-dim-2xl))`).
- `@media (prefers-reduced-motion: reduce)` отключает анимации модалки и drawer.
- Все CTA имеют `min-height: 44px`, инпуты — `font-size: 16px` (iOS zoom guard).

## Как воспроизвести

1. `python3 -m http.server 9131` из корня репо.
2. Открыть [`prototype/index.html`](../../../prototype/index.html) внутри iframe 390×844 либо в DevTools device toolbar (iPhone 12).
3. Переключаться по persona-bar (top), пройти flow для каждой роли.
