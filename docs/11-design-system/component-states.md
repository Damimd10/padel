# Component States

## Context

This product is state-heavy. Component state design is not optional because trust depends on users understanding what is actionable, pending, valid, or blocked.

## Assumptions

- Happy-path-only component specs will fail in this product.
- State documentation must be explicit before implementation.

## Decisions

### Universal component states

Every reusable interactive component should define, when relevant:

- default
- hover
- focus-visible
- active
- disabled
- loading
- error
- success

### Data and workflow states

Workflow-facing components should also define, when relevant:

- empty
- pending
- approved
- rejected
- in-progress
- blocked
- completed
- invalid

### Table and row states

Data-heavy components should define:

- default row
- selected row
- expanded row
- row with warning
- row with invalid state
- row with completed state

### Form states

Form elements should define:

- untouched
- dirty
- validating
- valid
- invalid
- locked

### Competition-specific states

Competition-oriented UI should make these especially explicit:

- registration pending review
- registration approved
- registration rejected
- result recorded but not validated
- result validated
- competition ready for closure
- competition blocked from closure

## Trade-offs

- More documented states increase design effort up front.
- Fewer documented states create inconsistency and hidden behavior later.

## Risks

- Teams may style only default and error states, leaving operational ambiguity elsewhere.
- Inconsistent blocked or pending states can directly reduce user trust.

## Next Actions

- Require state matrices for every reusable component before implementation.
- Prioritize states for forms, tables, badges, dialogs, and result-entry surfaces first.
