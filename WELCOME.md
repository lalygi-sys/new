# Добро пожаловать в Disko

**Disko** — рабочее пространство продуктового дискавери команды IB.

## Что здесь происходит

Мы используем методологию **Quadruple Diamond** (4 алмаза × 8 октантов) для системного поиска и валидации продуктовых инициатив. AI-агент выступает фасилитатором процесса — задаёт структурированные вопросы, исследует рынок, синтезирует инсайты и заполняет артефакты каждого этапа.

## Как начать

### Для менеджера (PM)

При подключении к проекту AI-агент автоматически запустит сессию дискавери по Quadruple Diamond. Он проведёт вас через 8 этапов:

```
  🔷 Diamond 1: Framing the Universe     — контекст, North Star, roadmap
  🔷 Diamond 2: Designing the Right Thing — deep dive, MVP backlog
  🔷 Diamond 3: Designing the Thing Right — идеация, валидация
  🔷 Diamond 4: Delivering the Right Thing — delivery plan, метрики
```

Что от вас потребуется:
- Ответы на вопросы о продукте, целях, проблемах и ограничениях
- Загрузка существующих артефактов (стратегия, OKR, аналитика, CJM)
- Принятие решений по приоритизации и скоупу

Что агент сделает сам:
- Исследование конкурентов и рынка
- Синтез данных в структурированные артефакты
- Генерация вариантов решений с оценкой feasibility

### Структура проекта

```
disko/
├── WELCOME.md           ← вы здесь
├── BACKLOG.md           ← бэклог инициатив (Quadruple Diamond)
├── CLAUDE.md            ← контекст для AI-агента
├── .cursor/
│   ├── rules/
│   │   └── pm-onboarding.mdc  ← автозапуск опросника для PM
│   └── skills/
│       └── quadruple-diamond/  ← навык продуктового дискавери
└── artifacts/           ← артефакты каждого этапа (создаются по мере прохождения)
```

## Методология Quadruple Diamond

Расширение классического Double Diamond до 4 алмазов. Каждый алмаз — пара этапов: дивергенция (расширяем пространство) → конвергенция (фокусируемся).

| Diamond | Дивергенция | Конвергенция | Результат |
|---------|------------|--------------|-----------|
| 1 | O1: Exploration | O2: North Star | Landscape Map + Roadmap |
| 2 | O3: Targeted Expansion | O4: Setting the Course | Problem Deep Dive + MVP Backlog |
| 3 | O5: Ideation | O6: Validation | Solution Options + Validation Report |
| 4 | O7: Development | O8: Value Realisation | Delivery Plan + Success Metrics |

## Контакты

Вопросы по процессу — обращайтесь к владельцу репозитория.
