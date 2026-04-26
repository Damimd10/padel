# GitHub Projects Setup

## Purpose

Define the GitHub Project configuration required to run delivery from approved docs and agile artifacts.

## Recommended project model

Use one GitHub Project for delivery, with filtered views instead of creating separate Projects for frontend, backend and infrastructure.

This keeps:

- one shared backlog
- one shared sprint cadence
- one consistent status model
- lane-specific execution views without duplicating tickets

## How to create it from 0 in GitHub

### 1. Create the Project

1. Open GitHub.
2. Go to your organization or personal account.
3. Open the `Projects` tab.
4. Click `New project`.
5. Choose a blank project.
6. Name it something like:
   - `Product Delivery`
   - `Engineering Delivery`
   - `<product-name> Delivery`

### 2. Keep the base fields

At minimum, keep:

- `Title`
- `Assignees`
- `Status`

### 3. Add custom fields

Create these fields inside the Project.

#### Required fields

- `Lane`
  - type: single select
  - options:
    - `frontend`
    - `backend`
    - `infrastructure`

- `Type`
  - type: single select
  - options:
    - `epic`
    - `story`
    - `task`
    - `bug`
    - `chore`
    - `spike`

- `Area`
  - type: single select
  - options:
    - `ui`
    - `web-app`
    - `api`
    - `database`
    - `platform`
    - `testing`
    - `docs`

- `Priority`
  - type: single select
  - options:
    - `p0`
    - `p1`
    - `p2`
    - `p3`

- `Estimate`
  - type: number

- `Sprint`
  - type: iteration
  - recommendation:
    - 2-week iterations unless your team already works differently

- `Blocked`
  - type: single select
  - options:
    - `no`
    - `yes`

- `Workflow`
  - type: single select
  - options:
    - `frontend`
    - `backend`
    - `infra`
    - `n/a`

- `Epic`
  - type: text

- `Target`
  - type: single select
  - options:
    - `apps/web`
    - `apps/api`
    - `packages/ui`
    - `packages/api-client`
    - `packages/schemas`
    - `packages/config`

#### Optional but recommended fields

- `Architecture`
  - type: single select
  - options:
    - `tanstack`
    - `storybook`
    - `hexagonal`
    - `platform`

- `Risk`
  - type: single select
  - options:
    - `low`
    - `medium`
    - `high`

- `ADR`
  - type: single select
  - options:
    - `required`
    - `linked`
    - `none`

## Recommended `Status`

Configure `Status` with:

1. `Inbox`
2. `Ready`
3. `Planned`
4. `In Sprint`
5. `In Progress`
6. `In Review`
7. `QA / Validation`
8. `Done`
9. `Blocked`

## Recommended views

Create these views in the same Project.

### `Backlog`

- layout: table
- filter: exclude `Done`
- visible fields:
  - `Status`
  - `Lane`
  - `Type`
  - `Target`
  - `Priority`
  - `Estimate`
  - `Epic`

### `Current Sprint`

- layout: board
- column field: `Status`
- filter:
  - `Sprint:@current`

### `Frontend Sprint`

- layout: board or table
- filter:
  - `Sprint:@current`
  - `Lane:frontend`

### `Backend Sprint`

- layout: board or table
- filter:
  - `Sprint:@current`
  - `Lane:backend`

### `Infrastructure Sprint`

- layout: board or table
- filter:
  - `Sprint:@current`
  - `Lane:infrastructure`

### `Blocked`

- layout: table
- filter:
  - `Blocked:yes`

### `Roadmap`

- layout: roadmap
- field:
  - `Sprint`

## Labels to create in the repository

In the repository's `Issues` settings, create labels that mirror the Project model.

Minimum label set:

- `lane:frontend`
- `lane:backend`
- `lane:infrastructure`
- `type:epic`
- `type:story`
- `type:task`
- `type:bug`
- `type:chore`
- `type:spike`
- `priority:p0`
- `priority:p1`
- `priority:p2`
- `priority:p3`

## Milestones vs Sprint field

Choose one primary time-planning model:

- use `Sprint` iteration as the main sprint field, or
- use GitHub milestones as release buckets

Recommendation:

- use `Sprint` for sprint planning
- use milestones for release targets only

## Recommended setup summary

- one GitHub Project for product delivery
- one backlog view
- one active sprint board
- one view per lane
- one blocked-work view
- one roadmap view
- milestones for releases when needed

## Source alignment

- docs under `/docs` define scope and acceptance
- `docs/09-agile/*.md` define approved backlog and sprint commitments
- GitHub Issues/Projects track active execution state
- `Lane` and filtered views separate frontend, backend and infrastructure execution

## First working sequence

After creating the Project:

1. create labels in the repository
2. create the custom fields above
3. create the views above
4. create 3 to 5 sample issues
5. assign `Lane`, `Type`, `Priority`, `Sprint` and `Status`
6. verify they appear correctly in `Current Sprint` and lane-specific views
