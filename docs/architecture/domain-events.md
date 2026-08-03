# Domain Events

**Версия:** 0.1 (Draft)

**Статус:** В разработке

---

# Назначение документа

Данный документ определяет доменные события платформы AIDA.

Domain Events являются единственным способом сообщить системе о значимом изменении состояния.

Все подсистемы AIDA взаимодействуют через события.

---

# Философия

AIDA рассматривает разработку программного обеспечения как непрерывный поток инженерных событий.

Любое действие в системе приводит к появлению одного или нескольких Domain Events.

События являются частью истории проекта.

Они не могут быть изменены после публикации.

---

# Основные принципы

## Event First

Любое значимое действие должно завершаться публикацией одного или нескольких событий.

---

## Immutable History

Событие является неизменяемым.

После публикации событие никогда не изменяется.

---

## Loose Coupling

Компоненты не вызывают друг друга напрямую.

Они реагируют на события.

---

## Replayability

История событий должна позволять воспроизвести жизненный цикл любой Mission.

---

## Observability

Каждое событие должно содержать достаточно информации для анализа и аудита.

---

# Категории событий

## Mission Events

Отражают жизненный цикл Mission.

Например:

* MissionCreated
* MissionPlanned
* MissionStarted
* MissionPaused
* MissionCompleted
* MissionCancelled

---

## Goal Events

* GoalCreated
* GoalApproved
* GoalStarted
* GoalCompleted

---

## Objective Events

* ObjectiveCreated
* ObjectiveStarted
* ObjectiveCompleted

---

## Task Events

* TaskCreated
* TaskAssigned
* TaskStarted
* TaskBlocked
* TaskResumed
* TaskCompleted
* TaskRejected

---

## Workflow Events

* WorkflowStarted
* WorkflowStageChanged
* WorkflowCompleted

---

## Context Events

* ContextRequested
* ContextBuilt
* ContextValidated
* ContextExpired

---

## Artifact Events

* ArtifactCreated
* ArtifactUpdated
* ArtifactReviewed
* ArtifactApproved
* ArtifactArchived

---

## Project Intelligence Events

* KnowledgeCaptured
* KnowledgeUpdated
* InsightGenerated
* RelationshipCreated
* RelationshipUpdated

---

## Organization Events

* RoleAssigned
* ResponsibilityChanged
* CapabilityAdded
* CapabilityRemoved

---

## Provider Events

* ProviderRegistered
* ProviderUnavailable
* ProviderRecovered
* ModelSelected
* ModelSwitched

---

# Структура Domain Event

Каждое событие должно содержать:

* Event Id
* Event Type
* Timestamp
* Project Id
* Mission Id
* Aggregate Id
* Aggregate Type
* Version
* Producer
* Payload
* Metadata

---

# Поток выполнения

Типичный жизненный цикл выглядит следующим образом.

MissionCreated

↓

MissionPlanned

↓

GoalCreated

↓

ObjectiveCreated

↓

TaskCreated

↓

TaskAssigned

↓

ContextRequested

↓

ContextBuilt

↓

TaskStarted

↓

ArtifactCreated

↓

ArtifactReviewed

↓

KnowledgeCaptured

↓

MissionCompleted

---

# Подписчики событий

Любой компонент может подписываться на события.

Например:

Project Intelligence подписывается на:

* ArtifactCreated
* ArtifactApproved
* KnowledgeCaptured

Context Engine подписывается на:

* TaskAssigned
* ContextRequested

Workflow Engine подписывается на:

* MissionCreated
* GoalCreated
* TaskCompleted

Organization Intelligence подписывается на:

* RoleAssigned
* CapabilityAdded

---

# Принцип расширяемости

Добавление новой функциональности не должно требовать изменения существующих компонентов.

Новый компонент подписывается на существующие события или публикует собственные.

---

# События как источник истории

Domain Events являются журналом инженерной деятельности проекта.

История событий позволяет:

* анализировать выполнение Mission;
* строить метрики;
* выполнять аудит;
* исследовать причины ошибок;
* воспроизводить жизненный цикл проекта;
* обучать будущие версии AIDA на реальных инженерных процессах.

---

# Архитектурный вывод

В AIDA события являются основным механизмом взаимодействия между подсистемами.

Компоненты не должны зависеть друг от друга напрямую.

Они взаимодействуют исключительно через поток доменных событий.

Именно это обеспечивает расширяемость, наблюдаемость и эволюционное развитие платформы.
