# Project Board Workflow

## Default status flow

Recommended `Status` progression:

1. `Inbox`
2. `Ready`
3. `Planned`
4. `In Sprint`
5. `In Progress`
6. `In Review`
7. `QA / Validation`
8. `Done`
9. `Blocked`

## Rules

- only approved backlog items move to `Ready`
- only sprint-committed tickets move to `In Sprint`
- implementation starts from `In Sprint` or `In Progress`
- blocked items must include a blocker note and next action
- done items must satisfy `docs/09-agile/definition-of-done.md`
- lane-specific views should exist for `frontend`, `backend` and `infrastructure`
- tickets should not move across lanes silently; split them if scope crosses architecture boundaries
- affected apps/packages should be visible in table views before sprint commitment
