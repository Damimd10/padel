# Domain Model

## Purpose

Define the core domain model for the MVP competition workflow product based on `docs/04-use-cases/use-cases.md`.

This document focuses on business concepts and consistency rules, not on implementation details.

## Modeling approach

The product is modeled around one central business capability:

- creating, administering, progressing, and closing amateur competitions.

The domain model should therefore optimize for:

- clear competition ownership,
- explicit category and division administration,
- trustworthy participant registration state,
- reliable match progression,
- and valid competition outcomes.

## Core Domain Entities

## 1. Competition

Represents a tournament or amateur competition managed by the product.

Why it is an entity:

- It has identity over time.
- It moves through lifecycle states.
- It owns categories, registrations, match structure, and closure state.

Key business attributes:

- competition identifier,
- title,
- format,
- lifecycle status,
- date range,
- operational owner,
- closure state.

## 2. Category

Represents a competition category inside a competition.

Why it is an entity:

- It has identity within a competition.
- It can carry rules and participant segmentation.
- It affects registrations, match structure, and progression.

Key business attributes:

- category identifier,
- display name,
- category type or level label,
- division context,
- status inside competition.

## 3. Division

Represents a sex-based or equivalent participant segmentation within a competition context.

Why it is an entity:

- It affects participant eligibility and grouping.
- It separates operational competition flows.

Key business attributes:

- division identifier,
- division name,
- segmentation type,
- active status.

Note:

- In some implementations, `Division` could be modeled as part of `Category`.
- For this MVP, it is worth naming explicitly because the business requirement calls out category and sex-based administration as first-class concerns.

## 4. CompetitionRegistration

Represents a participant's request or administrative entry into a competition.

Why it is an entity:

- It has an explicit lifecycle.
- It may be approved, rejected, withdrawn, or corrected.
- It is the operational record that determines whether participation is valid.

Key business attributes:

- registration identifier,
- participant reference,
- requested category,
- requested division,
- registration status,
- approval outcome,
- administrative notes or reason context.

## 5. Participant

Represents a person participating in competitions.

Why it is an entity:

- The same participant can appear across many competitions.
- History and identity must persist over time.

Key business attributes:

- participant identifier,
- display identity,
- sex classification where required for competition,
- club or organization affiliation when relevant.

## 6. Match

Represents a competitive unit inside a competition structure.

Why it is an entity:

- It has identity and lifecycle.
- It belongs to a competition structure.
- It accepts results and drives progression.

Key business attributes:

- match identifier,
- competition reference,
- category reference,
- participating sides,
- match status,
- progression position,
- recorded result reference.

## 7. MatchResult

Represents the official result recorded for a match.

Why it is an entity:

- It can be created, corrected, validated, or invalidated.
- It drives progression and standings.

Key business attributes:

- result identifier,
- match reference,
- result data,
- validation state,
- recorded by,
- recorded at.

## 8. CompetitionOutcome

Represents the final outcome of a completed competition or category flow.

Why it is an entity:

- It expresses final winners, standings, or concluded progression.
- It should only exist when the competition reaches closure conditions.

Key business attributes:

- outcome identifier,
- competition reference,
- category or division context,
- final ranking or winner set,
- finalized status.

## Value Objects

## 1. CompetitionFormat

Describes the structure type of the competition.

Examples:

- elimination,
- round robin,
- league,
- hybrid limited format.

Why value object:

- Defined by meaning, not identity.

## 2. CompetitionStatus

Represents lifecycle state.

Examples:

- draft,
- open for registration,
- registration closed,
- in progress,
- completed,
- cancelled.

## 3. RegistrationStatus

Represents the administrative state of a competition registration.

Examples:

- registered,
- pending review,
- approved,
- rejected,
- withdrawn.

## 4. MatchStatus

Represents the operational state of a match.

Examples:

- not started,
- pending result,
- completed,
- validated.

## 5. CategoryLabel

Represents the business-facing category name or level designation.

Examples:

- `segunda`,
- `tercera`,
- `open`,
- `sub-18`.

## 6. DivisionType

Represents the participant segmentation meaning for a division.

Examples:

- male,
- female,
- mixed

if later supported by competition rules.

## 7. DateRange

Represents the start and end of a competition.

Why value object:

- Purely descriptive and validation-oriented.

## 8. ParticipantIdentity

Represents the business identity of a participant.

Examples:

- full name,
- external identifier,
- club affiliation label.

This should remain distinct from authentication or platform user identity.

## 9. ResultScore

Represents the competition-specific result payload for a match.

Examples:

- set scores,
- winner,
- walkover marker.

Why value object:

- The score itself is descriptive; the `MatchResult` entity owns its lifecycle.

## 10. OutcomeSnapshot

Represents a finalized standings or winner view at the moment of closure.

Why value object:

- It expresses business meaning without requiring separate identity from the `CompetitionOutcome`.

## Relationships

## Competition-centered relationships

- One `Competition` has many `Category` entries.
- One `Competition` has many `Division` entries when explicit divisions are used.
- One `Competition` has many `CompetitionRegistration` records.
- One `Competition` has many `Match` records.
- One `Competition` may produce one or more `CompetitionOutcome` records depending on category structure.

## Registration relationships

- One `CompetitionRegistration` belongs to one `Competition`.
- One `CompetitionRegistration` references one `Participant`.
- One `CompetitionRegistration` targets one `Category`.
- One `CompetitionRegistration` may target one `Division`.

## Match relationships

- One `Match` belongs to one `Competition`.
- One `Match` belongs to one `Category`.
- One `Match` may belong to one `Division` if the competition structure requires explicit division tracking.
- One `Match` may have one `MatchResult`.

## Result and outcome relationships

- One `MatchResult` belongs to one `Match`.
- One `CompetitionOutcome` belongs to one `Competition`.
- One `CompetitionOutcome` may be scoped to one `Category` or `Division` context.

## Participant relationships

- One `Participant` can have many `CompetitionRegistration` records across competitions.
- One `Participant` can appear in many `Match` records through approved registrations and competition structure.

## Business Rules and Invariants

## Competition invariants

- A competition must have exactly one responsible operational owner.
- A competition cannot move into active progression without a valid format and defined administrative scope.
- A completed competition cannot remain with unresolved critical results.

## Category and division invariants

- A registration cannot be approved without explicit category assignment when the competition requires categories.
- A registration cannot be approved without explicit division assignment when the competition requires divisions.
- A participant cannot be operationally assigned to conflicting categories or divisions within the same competition context.

## Registration invariants

- A registration must always have exactly one current registration status.
- An approved registration must satisfy the relevant eligibility rules.
- A withdrawn or rejected registration must not drive active match generation.

## Match and progression invariants

- A match must belong to one competition context only.
- A match result cannot be treated as final until it satisfies the competition's validation rule.
- Competition progression must only advance from approved participant structure and valid results.

## Closure invariants

- Competition closure requires operational completeness for the selected competition format.
- Final standings or winners must derive from validated competition state, not from provisional records.
- Historical participation and outcome records should only be derived from closed competitions.

## Aggregates

## Aggregate 1: Competition

Recommended aggregate root:

- `Competition`

Why:

- It owns the top-level competition lifecycle.
- It governs setup, administrative scope, category configuration, division configuration, and closure policy.
- It should protect invariants about whether the competition is valid, open, in progress, or closable.

Likely contained entities:

- `Category`
- `Division`

Likely contained value objects:

- `CompetitionFormat`
- `CompetitionStatus`
- `DateRange`

Important note:

- `Competition` should not become a giant aggregate that directly owns every registration, match, and result mutation.

## Aggregate 2: CompetitionRegistration

Recommended aggregate root:

- `CompetitionRegistration`

Why:

- Registration has its own lifecycle and approval invariants.
- Registration correctness should not require loading the entire competition structure.
- It protects invariants around participant/category/division assignment and administrative status.

References:

- one `Competition`
- one `Participant`
- one `Category`
- optional `Division`

## Aggregate 3: Match

Recommended aggregate root:

- `Match`

Why:

- Match progression and result recording form their own consistency unit.
- A result correction should not require mutation of the entire competition object graph.
- It protects invariants around match state, result state, and progression eligibility.

Likely contained entities:

- `MatchResult`

References:

- one `Competition`
- one `Category`
- optional `Division`

## Aggregate 4: Participant

Recommended aggregate root:

- `Participant`

Why:

- Participant identity and cross-competition history need their own continuity.
- The participant should not be owned by a single competition.

Likely contained value objects:

- `ParticipantIdentity`

Important note:

- `CompetitionRegistration` should reference `Participant` rather than embed participant identity fully as mutable competition-owned state.

## Derived read models, not source-of-truth aggregates

These concepts are important but should be treated as derived views unless later complexity proves otherwise:

- `CompetitionOutcome`
- standings
- operational dashboards

Why:

- They can be derived from validated registrations, matches, and results.
- Treating them as source-of-truth too early would increase consistency complexity unnecessarily.

## Aggregate guidance

For the MVP:

- keep `Competition`, `CompetitionRegistration`, `Match`, and `Participant` as the main aggregate candidates,
- keep `Category` and `Division` inside `Competition`,
- keep `MatchResult` inside `Match`,
- and treat standings/outcomes primarily as derived projections.

## Domain Boundaries

## 1. Competition Administration Domain

Core domain boundary.

Contains:

- competition setup,
- categories,
- divisions,
- registrations,
- match structure,
- results,
- progression,
- closure.

Why core:

- This is the primary business capability the product is selling.

## 2. Participant Domain

Supporting domain boundary.

Contains:

- participant identity,
- participant references across competitions,
- basic historical continuity.

Why supporting:

- Important for consistency, but not the main reason the product exists.

## 3. Authorization and Staff Role Boundary

Supporting boundary.

Contains:

- role assignment,
- permission context,
- operational ownership.

Why supporting:

- Necessary for enforcement, but not the main domain value proposition.

## 4. Communication and Notification Boundary

Supporting boundary.

Contains:

- notification triggers,
- event-driven communication relevance,
- operational messaging state.

Why supporting:

- Important for workflow execution, but not the core domain model.

## 5. Out-of-scope boundaries for MVP

These should remain outside the core domain boundary for now:

- booking and court inventory,
- payments and invoicing,
- academy management,
- CRM and marketing,
- advanced analytics,
- generic social coordination.

## Modeling cautions

- Do not let `Competition` absorb unrelated club-management responsibilities.
- Do not model rankings as a first-class core aggregate unless the MVP truly requires them beyond standings or outcomes.
- Do not collapse `Category` and `Division` into vague labels if the business requires explicit operational control over both.
- Do not let notification or reporting concerns dominate the core domain language.

## Initial domain language

The current ubiquitous language should emphasize:

- competition,
- category,
- division,
- participant,
- registration,
- approval,
- match,
- result,
- progression,
- outcome,
- closure.

These terms should be preferred consistently in later architecture, ADRs, backlog items, and API discussions.
