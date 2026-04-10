# Diamond 3: Designing the Thing Right

## Octant 5 — Ideation & Prototyping

```
[■■■■■□□□] 5/8 — Ideation
```

### SOLUTION OPTIONS

---

### Must I1: Contest Wizard

**Вариант A — Quick Win: Linear Form**
- Описание: Пошаговая форма (5 шагов) без ветвлений
- Как работает: Тип → Длительность → Правила → Призы → Подтверждение
- Аналоги: Google Forms, Typeform wizard
- Feasibility: 2/5 | Effort: 1 неделя | Risk: Низкий
- Минус: Не масштабируется при усложнении правил

**Вариант B — Balanced: Step-by-step Wizard с preview** ★
- Описание: Wizard с live preview контеста справа. 5 шагов + возможность вернуться
- Как работает: Каждый шаг показывает как контест будет выглядеть для клиента
- Аналоги: Mailchimp campaign builder, Shopify product creator
- Feasibility: 3/5 | Effort: 2 недели | Risk: Средний
- Плюс: Партнёр видит результат ДО публикации

**Вариант C — Ambitious: Visual Contest Builder**
- Описание: Drag-and-drop конструктор с условными правилами
- Как работает: Как Figma для контестов — блоки правил, визуальная логика
- Feasibility: 5/5 | Effort: 6 недель | Risk: Высокий
- Минус: Overkill для MVP, сложный UX

**Рекомендация:** Вариант B. Wizard с preview — оптимальный баланс простоты и наглядности.

---

### Must I2: Real-time Leaderboard

**Вариант A — Quick Win: Static Table**
- Описание: Таблица с позицией, обновляется каждые 15 мин
- Feasibility: 1/5 | Effort: 3 дня | Risk: Низкий

**Вариант B — Balanced: Interactive Leaderboard** ★
- Описание: Таблица с анимацией перемещений, подсветкой "своей" позиции, progress bar до следующего приза
- Аналоги: OctaFX Champion leaderboard, Duolingo leagues
- Feasibility: 3/5 | Effort: 1.5 недели | Risk: Средний
- Паттерны: "You are here" маркер, relative position (3 выше + 3 ниже), обновление ~5 мин

**Вариант C — Ambitious: Gamified Dashboard**
- Описание: Full-screen dashboard с анимациями, графиком прогресса, achievements
- Feasibility: 4/5 | Effort: 3 недели | Risk: Средний

**Рекомендация:** Вариант B. Интерактивный лидерборд с "You are here" — стандарт индустрии.

---

### Must I3: Terms Accept/Decline

**Вариант A — Quick Win: Simple Modal** ★
- Описание: Модалка с условиями + кнопки "Участвую" / "Не сейчас"
- Как работает: Клиент видит карточку контеста → нажимает → видит условия → accept/decline
- Feasibility: 1/5 | Effort: 3 дня | Risk: Низкий

**Вариант B — Balanced: Contest Landing Page**
- Описание: Отдельная страница с подробностями, FAQ, таймером обратного отсчёта
- Feasibility: 2/5 | Effort: 1 неделя | Risk: Низкий

**Рекомендация:** Вариант A для MVP, миграция на B в NEXT фазе.

---

### Must I4: Admin Panel

**Вариант A — Quick Win: List + Actions**
- Описание: Таблица всех контестов + inline actions (approve, pause, cancel)
- Feasibility: 2/5 | Effort: 1 неделя | Risk: Низкий

**Вариант B — Balanced: Dashboard + Drill-down** ★
- Описание: Overview dashboard (active contests, flags) + drill-down в детали контеста
- Как работает: Карточки активных контестов → клик → полная информация + actions
- Feasibility: 3/5 | Effort: 2 недели | Risk: Средний

**Рекомендация:** Вариант B. Админу нужен quick overview, чтобы видеть что требует внимания.

---

## Octant 6 — Concept Validation

```
[■■■■■■□□] 6/8 — Validation
```

### SCORING MATRIX

|                        | Вариант A (Quick) | Вариант B (Balanced) | Вариант C (Ambitious) |
|------------------------|:-----------------:|:--------------------:|:---------------------:|
| **I1: Wizard**         |                   |                      |                       |
| Бенчмарк (<5 мин)     | ✓                 | ✓                    | ✗ (learning curve)    |
| Root Cause fit         | 3                 | 5                    | 4                     |
| North Star align       | 3                 | 5                    | 4                     |
| Feasibility            | 5                 | 4                    | 2                     |
| **Итого I1**           | **11**            | **14** ★             | **10**                |
| **I2: Leaderboard**    |                   |                      |                       |
| Бенчмарк (доверие >95%)| ✗ (задержка)     | ✓                    | ✓                     |
| Root Cause fit         | 2                 | 5                    | 5                     |
| North Star align       | 3                 | 5                    | 5                     |
| Feasibility            | 5                 | 4                    | 3                     |
| **Итого I2**           | **10**            | **14** ★             | **13**                |
| **I3: Terms**          |                   |                      |                       |
| **Итого I3**           | **14** ★          | **13**               | —                     |
| **I4: Admin**          |                   |                      |                       |
| **Итого I4**           | **11**            | **14** ★             | —                     |

---

### РЕШЕНИЕ

| Must | Выбранный вариант | Обоснование |
|------|-------------------|-------------|
| I1: Wizard | B — Step-by-step с preview | Наглядность без сложности |
| I2: Leaderboard | B — Interactive | Стандарт индустрии, решает проблему доверия |
| I3: Terms | A — Simple Modal | Минимальный effort, полностью покрывает потребность |
| I4: Admin | B — Dashboard + Drill-down | Админу нужен overview для быстрой реакции |

---

### ФИНАЛЬНАЯ ГИПОТЕЗА

Мы верим, что **self-serve wizard с live preview + interactive leaderboard + формальный accept** приведёт к тому, что IB-партнёры будут запускать 50+ контестов в месяц, с participation rate >15% и ростом торгового объёма >20%.

Метрика: завершённые контесты/мес | Baseline: 0 | Target: 50 | Срок: 6 мес после запуска

**GO / NO-GO: GO** ✅
