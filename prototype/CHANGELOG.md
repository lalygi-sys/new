# Changelog прототипа

Все значимые изменения прототипа фиксируются здесь. Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/). Записи в обратном хронологическом порядке — сверху самые свежие.

> Новый комит → новая запись сверху. См. гайд в [`README.md`](./README.md#как-поддерживать-changelogmd).

---

## 2026-06-01 — мобильная адаптация (<640px) для трёх персон · [`9780653`](https://github.com/tkapkaeva-create/disko/commit/9780653)

### Что изменилось

#### Foundation
- **CSS-токены и утилиты:** `--ds-bp-mobile` (640px), `--ds-bp-tablet` (1024px), `--ds-mobile-header-h` (56px), `--ds-mobile-tabbar-h` (64px). Утилитарные классы `.is-mobile-only` / `.is-desktop-only`.
- **Глобальные правила:** `overflow-x: hidden` на `html/body`, `-webkit-tap-highlight-color: transparent`, `font-size: 16px` для инпутов (iOS zoom guard), `min-height: 44px` для CTA.
- **JS:** добавлены хуки `useMediaQuery(query)` и `useIsMobile()` на `window.matchMedia` (без npm-пакетов, под Babel-standalone).
- **`@media (prefers-reduced-motion: reduce)`** отключает slide/transition для `.ds-modal`, `.toast`, `.mobile-drawer`.

#### Навигация
- **Mobile header 56px:** logo + avatar + burger; меню `HEADER_MENUS` переезжает в slide-down `MobileDrawer` (поверх backdrop, открывается по burger).
- **`MobileTabBar` 64px + safe-area:** для каждой персоны свои табы (Client: Главная / Контесты / Бонусы / Профиль; IB: Дашборд / Контесты / Кошелёк / Профиль; Admin: Дашборд / Контесты / Юзеры / Аудит).
- **Persona-switcher:** компактная pill «Demo: вы — X» открывает `MobilePersonaSheet` (bottom-sheet выбора роли).

#### Modal → bottom-sheet
- На mobile `.ds-modal` принимает форму bottom-sheet: `border-radius: 24px 24px 0 0`, `width: 100%`, прижат снизу, slide-up анимация (`@keyframes bottom-sheet-in`), pull-bar handle, `max-height: 92vh`.

#### Списки контестов
- **`IBMyContests`:** stats 4-col → 2×2; таблица заменена на `row-card-list` с card-визуалом (название + статус + тип + период + участники + призовой фонд) и actions (Статистика / Поделиться).
- **`ClientContestList`:** премиальный card stack для активных контестов; «Завершённые» — также card list вместо таблицы на mobile.

#### Wizard (`IBCreateContest`)
- **Компактный stepper** на mobile: точки `1·2·3·4` + лейбл текущего шага (`WizardStepperMobile`) вместо полного `WizardStepper`.
- **Single-column body:** `wizard-period-grid`, `wizard-review-grid` коллапсируются в одну колонку.
- **Sticky bottom action bar** `WizardFooterMobile` — `[Назад] [Далее]` поверх tab bar.
- **Preview-сайдбар** скрывается; вместо него кнопка `«Посмотреть глазами клиента»` открывает превью в bottom-sheet (`Modal` на mobile = sheet).
- **Prize rows** компактные: 32px / 1fr / 32px; `prize-pool-toolbar` стек вертикально.

#### Detail (IB / Client / Admin)
- **`IBContestDetail`:** description без `whiteSpace: nowrap`, action-bar пилюль на flex-wrap.
- **`ClientContestTerms`:** sticky `client-terms-cta` снизу с CTA «Участвовать» + микро-summary; `client-terms-spacer` оставляет место в скролле.
- **`AdminContestDetail`:** `admin-detail-grid` коллапсируется в 1 колонку, leaderboard оборачивается в `admin-table-scroll`.

#### Leaderboard
- **`ClientLeaderboard`:** sticky-чип позиции пользователя + vertical card list (`lb-card`), top-3 highlighted, кнопка «Загрузить ещё» вместо длинного скролла.
- **`IBContestDetail` (вкладка лидерборд):** табличный layout заменён на тот же `lb-card-list` на mobile.

#### Admin degradation
- **`AdminDashboard`:** добавлен `admin-mobile-banner` («Полное управление и фильтры — на компьютере»); таблица обёрнута в `admin-table-scroll` для горизонтального скролла на узких экранах.

#### Polish
- Тосты на mobile поднимаются над tab bar: `bottom: calc(var(--ds-mobile-tabbar-h) + env(safe-area-inset-bottom, 0px) + var(--ds-dim-2xl))`.
- Все CTA `min-height: 44px`, `--ds-btn--l: 48px`; `td-actions { opacity: 1 }` (нет hover на touch).
- Скриншоты в `artifacts/audit-screenshots/mobile/` (3 персоны × ключевые экраны на 390×844).

### Зачем

Прототип контестов использовался почти исключительно на десктопе. Для встреч с клиентами IB-партнёрам нужен быстрый mobile-просмотр (quick check-in между разговорами), а для клиента контесты — это маркетинговая витрина в основном приложении (mobile-first). Admin сохраняет full-control только на десктопе, на mobile получает graceful read-only с явным баннером.

### Как проверить

1. Запустить `python3 -m http.server 9130` из `prototype/`, открыть `index.html`.
2. В DevTools включить device toolbar → iPhone 12 (390×844).
3. **Client:** persona-pill → Client → tap карточки → leaderboard со sticky-чипом «Вы — N место»; на не-присоединённом контесте видеть sticky CTA «Участвовать».
4. **IB:** persona-pill → IB Partner → tap «Создать контест» → wizard-stepper компактный, sticky `[Далее]`, кнопка «Посмотреть глазами клиента» открывает bottom-sheet превью.
5. **Admin:** persona-pill → Admin → видеть 2×2 stats, alert-секцию, банер «Полное управление и фильтры — на компьютере», таблицу в горизонтальном скролле.
6. Burger в header → drawer slide-down с меню. Tab bar внизу персонозависим.

---

## 2026-04-10 — буллеты в списках: иконка `ic-dot-24` из DS · [`e59469e`](https://github.com/tkapkaeva-create/disko/commit/e59469e)

### Что изменилось
- **Дизайн-система:** из Figma-файла **Icons [1 brand]** (node `16084:966`) добавлен символ `ic-dot-24` в SVG-спрайт, `fill="currentColor"`. Удалён прежний кастомный `ic-bullet-triangle-24` (треугольник был не из DS).
- **`BulletList`:** дефолтная иконка буллета `bullet-triangle` → `dot`. Контейнер буллета увеличен с `16×20` до `20×20`, сама иконка — полноразмерная `20×20`.
- Затронуты все списки, использующие `BulletList`: модалка «Как считается Score» (`ContestTypeInfo`), карточка «Правила» на странице участия клиента (`ClientContestTerms`).

### Зачем
В прототипе использовалась кастомная треугольная иконка, которой нет в DS. Для соответствия дизайн-системе и визуальной консистентности заменили на официальную точку из «Icons [1 brand]».

---

## 2026-04-10 — участие клиента, фиксированные условия, визард 2.0 · [`0e54cb9`](https://github.com/tkapkaeva-create/disko/commit/0e54cb9)

### Визард создания контеста (IB-партнёр)
- **Удалён шаг «Правила»** — тип контеста → период → призы → превью (стало 4 шага вместо 5).
- **Фиксированные условия платформы** вместо настраиваемых полей: минимальный баланс `$100`, минимальный объём сделки `0.01 лота`, участвует 1 торговый аккаунт клиента. Отображаются на финальной странице визарда read-only.
- Убраны поля «Учитываемые инструменты», «Дополнительные условия», «Минимальное время удержания», «Торговые аккаунты клиента».
- **AM/PM-переключатель** для времени начала/окончания — на компоненте `Chips` из DS, отдельно для каждого инпута.
- **Иконка календаря** в инпутах дат — справа.
- **Степпер визарда** теперь использует иконки цифр в круге из DS (`ic-digit-1-24` … `ic-digit-4-24`) вместо текстовых кружков.

### Клиент: участие в контесте
- Новая модалка **`JoinContestModal`** по клику «Участвую» на странице деталей контеста:
  - Верхний блок с ключевыми условиями: **$100** мин. баланс · **0.01 лота** мин. объём · **1** аккаунт.
  - Hover-тултип у «мин. объём сделки» с правилом валидного лота (удержание ≥ 3 мин, движение ≥ 3 пипса).
  - Список торговых аккаунтов (MT4/MT5) radio-cards. Для аккаунтов с балансом `< $100` — тег «Недостаточно средств» и предупредительный цвет.
  - Inline-блок пополнения: показывает точный дефицит, поле ввода суммы, кнопка «Пополнить» локально увеличивает баланс.
  - Карточка-кнопка «**+ Создать торговый аккаунт**» открывает форму выбора платформы MT4/MT5 и мгновенно добавляет новый аккаунт в список с балансом $0.
  - Positive-confirmation, когда аккаунт готов (`≥ $100`). Кнопка «Участвую» в футере активируется только при выполненных условиях.
- Страница деталей контеста (`ClientContestTerms`) обновлена: в блоке «Правила» отражены новые фиксированные условия.

### Дизайн-система и иконки
- Интегрированы SVG-иконки из файла **Icons [1 brand]** (Figma) в единый SVG-спрайт в `index.html` с `fill="currentColor"` для корректного наследования цвета.
- Добавлен маппинг `DS_ICON_ALIAS` — семантические имена (`close`, `chart`, `trophy`, …) → канонические id из DS.
- Добавлены иконки `ic-digit-{1..4}-24` для степпера и `ic-plus-24` для кнопки создания аккаунта.

### Визуальные правки
- `StatCard` — содержимое выровнено по центру.
- Тултипы (`InfoTip`) — hover/focus с позицией top/bottom, максимальная ширина 280px.

### Деплой для команды
- Создан `prototype/README.md` с инструкцией запуска (`python3 -m http.server 9130` в `prototype/`).
- Создан этот `prototype/CHANGELOG.md`.

---

## Формат записей

Шаблон для новой записи — копируйте блок и заполняйте:

```markdown
## YYYY-MM-DD — короткое название · [`хэш`](https://github.com/tkapkaeva-create/disko/commit/хэш)

### Что изменилось
- **Область (визард / клиент / админ / DS / ...):** краткое описание.

### Зачем
Гипотеза / задача, которую решает изменение.

### Как проверить
1. Шаги ручного теста (персона → экран → действие → ожидаемый результат).
```

---

## Более ранняя история

До начала ведения этого changelog история изменений зафиксирована в git-логе:

```bash
git log --oneline prototype/index.html
```

Ключевые вехи:
- `b8f7012` — новый тип контеста «Grow your account» + tooltip-модалки со Score-механикой
- `b7859e3` — улучшение UI прототипа: лидерборд, степпер, типографика
- `1be1e25` — полный Quadruple Diamond discovery + интерактивный прототип
- `ab1433f` — инициализация проекта
