# Component Inventory

## Context

The component inventory should reflect actual workflow needs from the competition product, not generic dashboard boilerplate.

## Assumptions

- Shared components belong in `packages/ui`.
- Feature composition stays in application space.

## Decisions

### Foundations

- App shell
- Page header
- Section header
- Panel / card
- Divider
- Tabs
- Drawer
- Modal / dialog
- Popover
- Tooltip

### Actions and form inputs

- Button
- Icon button
- Button group
- Text input
- Numeric input
- Select
- Combobox / searchable select
- Checkbox
- Radio group
- Toggle
- Date input
- Date range input
- Textarea
- Form field wrapper
- Validation message

### Data display

- Data table
- Data row
- Badge / status chip
- Empty state
- Skeleton
- Inline metadata list
- Key-value summary block
- Progress indicator
- Timeline or progression strip

### Workflow components

- Competition status banner
- Registration review row
- Category assignment control
- Division tag
- Match card
- Result entry panel
- Outcome summary panel
- Filter bar
- Bulk actions bar

### Navigation and feedback

- Breadcrumb
- Pagination
- Toast / inline alert
- Confirmation dialog

## Trade-offs

- A workflow-first inventory reduces genericity but requires stronger product discipline.
- Some domain-shaped components may later need decomposition into primitives plus compositions.

## Risks

- Turning every feature concept into a reusable shared component too early.
- Polluting `packages/ui` with application-specific orchestration.

## Next Actions

- Classify each item as foundation, reusable primitive, reusable composite, or app composition before implementation.
- Document which components are true shared UI and which stay feature-owned.
