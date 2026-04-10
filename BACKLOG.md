# Disko — Product Discovery Backlog

> Бэклог ведётся по методологии Quadruple Diamond.
> Статус каждой инициативы отражает текущий октант прохождения.

## Прогресс дискавери

```
[■■■■■■■■] 8/8 — Discovery Complete ✅
```

---

## 🔷 Diamond 1: Framing the Universe

### Octant 1 — Exploration (дивергенция)
> Статус: ✅ Завершён

**Цель:** собрать максимум контекста о продукте, бизнесе и пользователях.

- [x] Бизнес-контекст (IB-модель, комиссия от объёма лотов)
- [x] Стратегические цели (self-serve инструмент для IB, рост объёма)
- [x] Известные боли клиентов (ручной подсчёт, нет доверия, нет прозрачности)
- [x] Ресурсы и ограничения (регуляторика, интеграция с торговыми данными)
- [x] Исследование рынка и конкурентов (XM, OctaFX, FXTM, Exness, IC Markets)
- [x] SWOT-анализ
- [x] Landscape Map

### Octant 2 — North Star (конвергенция)
> Статус: ✅ Завершён

**Цель:** выбрать главный приоритет, сформулировать North Star.

- [x] Аффинити-группировка проблем (4 кластера)
- [x] HMW-вопросы (5 ранжированных)
- [x] North Star Statement: «Каждый IB-партнёр может запустить прозрачный контест за 5 минут»
- [x] North Star Metric: завершённые контесты/мес (0 → 50)
- [x] Roadmap (Now / Next / Later / Won't)

---

## 🔷 Diamond 2: Designing the Right Thing

### Octant 3 — Targeted Expansion (дивергенция)
> Статус: ✅ Завершён

- [x] Customer Journey (as-is) — IB и Client
- [x] Данные и метрики (время на контест: 15-20 ч, participation ~5%)
- [x] Конкурентный анализ (Competitive Matrix: 6 конкурентов + 4 косвенных)
- [x] Root Cause Analysis (4 root causes)
- [x] Бенчмарки (время создания, participation, рост объёма)

### Octant 4 — Setting the Course (конвергенция)
> Статус: ✅ Завершён

- [x] Список инициатив (10 инициатив)
- [x] RICE-скоринг
- [x] MoSCoW приоритизация (4 Must, 2 Should, 2 Could, 2 Won't)
- [x] MVP Backlog с гипотезами (H1-H4)

---

## 🔷 Diamond 3: Designing the Thing Right

### Octant 5 — Ideation & Prototyping (дивергенция)
> Статус: ✅ Завершён

- [x] Варианты A/B/C для каждого Must
- [x] Исследование паттернов решений (Mailchimp wizard, Duolingo leagues)
- [x] Feasibility scoring
- [x] Рекомендации: Wizard с preview (B), Interactive leaderboard (B), Modal accept (A), Dashboard+drill-down (B)

### Octant 6 — Concept Validation (конвергенция)
> Статус: ✅ Завершён

- [x] Scoring Matrix
- [x] Валидация через аналоги
- [x] Финальное решение
- [x] GO / NO-GO: **GO** ✅

---

## 🔷 Diamond 4: Delivering the Right Thing

### Octant 7 — Development & Deployment (дивергенция)
> Статус: ✅ Завершён

- [x] User Stories с Acceptance Criteria (9 stories)
- [x] T-shirt estimation
- [x] Порядок и зависимости
- [x] Release Plan (MVP: 4 недели, Enhancement: 2 недели)

### Octant 8 — Value Realisation (конвергенция)
> Статус: ✅ Завершён

- [x] Primary Metrics + Guard Rails
- [x] Measurement Plan
- [x] Experiment Design (feature flag rollout, 20-30 early adopters)
- [x] Decision Framework (scale / iterate / stop)

---

## Артефакты

| Этап | Артефакт | Файл | Статус |
|------|----------|------|--------|
| O1+O2 | Landscape Map + North Star + Roadmap | `artifacts/d1-framing.md` | ✅ |
| O3+O4 | Problem Deep Dive + MVP Backlog | `artifacts/d2-designing-right-thing.md` | ✅ |
| O5+O6 | Solution Options + Validation Report | `artifacts/d3-designing-thing-right.md` | ✅ |
| O7+O8 | Delivery Plan + Success Metrics | `artifacts/d4-delivering.md` | ✅ |
| Итог | Product Initiative Summary | `artifacts/initiative-summary.md` | ✅ |
| Прототип | Screen Specs для кликабельного прототипа | `artifacts/prototype-screens.md` | ✅ |

---

## Инициативы

### [I1] Contest Wizard — Self-serve конструктор контестов
- **North Star связь:** Core — без wizard нет self-serve
- **RICE Score:** R: 500 × I: 3 × C: 0.8 / E: 6 = 200
- **MoSCoW:** Must
- **Гипотеза:** Мы верим что wizard увеличит кол-во контестов с 0 до 50/мес → успех если > 30
- **Статус:** Discovery ✅ → Ready for Prototype

### [I2] Real-time Leaderboard
- **North Star связь:** Решает проблему доверия, повышает engagement
- **RICE Score:** R: 5000 × I: 3 × C: 1.0 / E: 4 = 3750
- **MoSCoW:** Must
- **Гипотеза:** Мы верим что leaderboard повысит participation с ~5% до 15%+ → успех если > 12%
- **Статус:** Discovery ✅ → Ready for Prototype

### [I3] Terms Accept/Decline
- **North Star связь:** Формализация участия, снижение споров
- **RICE Score:** R: 5000 × I: 2 × C: 1.0 / E: 2 = 5000
- **MoSCoW:** Must
- **Гипотеза:** Мы верим что formal accept повысит completion rate до 80%+ → успех если > 70%
- **Статус:** Discovery ✅ → Ready for Prototype

### [I4] Admin Moderation Panel
- **North Star связь:** Безопасность платформы, compliance
- **RICE Score:** R: 20 × I: 2 × C: 0.8 / E: 4 = 8 (low reach, but mandatory)
- **MoSCoW:** Must
- **Гипотеза:** Мы верим что admin panel снизит фрод-инциденты до < 2%
- **Статус:** Discovery ✅ → Ready for Prototype
