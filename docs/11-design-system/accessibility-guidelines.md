# Accessibility Guidelines

## Purpose

Define accessibility expectations for the abstract design system of the competition workflow product.

## Accessibility posture

Accessibility is part of operational reliability.

This system is used in dense, state-sensitive workflows where:

- missing focus,
- weak contrast,
- inaccessible forms,
- or ambiguous feedback

can directly produce invalid registrations, wrong results, or blocked competition closure.

## Core accessibility principles

## 1. Keyboard-first administration

- All interactive elements must be reachable and operable with keyboard alone.
- Tab order must follow workflow order, not incidental DOM order.
- Dense admin screens must remain usable without a mouse.

## 2. Semantics before styling

- Use real semantic controls by default.
- Tables must remain tables.
- Buttons must remain buttons.
- Form labels must stay explicit and programmatically associated.
- Headings must preserve hierarchy for fast screen-reader navigation.

## 3. State must not depend on color alone

- Critical states must include text labels.
- Status color is a reinforcement layer, not the only carrier of meaning.
- Badges, pills, banners, and row states must remain understandable without color perception.

## 4. Focus is a trust signal

- Focus indicators must be clearly visible on every supported surface.
- Dialogs, drawers, menus, and popovers must manage focus intentionally.
- Focus must return predictably when overlays close.

## 5. Errors must be actionable

- Errors must be specific, field-linked, and written in operational language.
- High-impact failures must not appear only in transient toasts.
- Use inline errors for local correction and summary errors for blocking failures.

## Keyboard guidance

- Support keyboard operation for all data-entry, review, approval, and result-recording workflows.
- Composite widgets such as tabs, accordions, menus, listboxes, comboboxes, and data grids must document arrow-key behavior explicitly.
- Modal dialogs and drawers must trap focus and restore it to the initiating control on close.

## Focus management rules

Focus should move intentionally after meaningful system changes, especially:

- after creating a competition,
- after approving or rejecting a registration,
- after saving a result,
- after opening or closing a dialog,
- after triggering validation errors.

When the interface changes substantially, focus should land on:

- the updated region,
- the first actionable next step,
- or a confirmation/error summary.

## Form accessibility

- Labels must remain visible.
- Required versus optional must be explicit.
- Grouped controls should use appropriate semantic grouping.
- Validation messages must be associated with the correct input.
- Disabled fields should be used sparingly; read-only with explanation is often more usable.

## Table and dense data accessibility

- Column headers and row relationships must be programmatically clear.
- Sort and filter controls must be operable by keyboard and announced meaningfully.
- Sticky headers or dense layouts must not break zoom, reflow, or focus visibility.
- Row-level actions must be identifiable in context.

## Status and feedback accessibility

- Status chips and badges must always include text meaning.
- Critical warning and blocked states need stronger contrast and visual weight than passive informational states.
- Progress indicators must distinguish current, completed, blocked, and pending states clearly.

## Required component accessibility documentation

Every reusable component should eventually document:

- semantic expectations,
- keyboard behavior,
- focus behavior,
- ARIA requirements if any,
- state communication rules,
- misuse patterns to avoid.

## Story coverage expectations

Storybook should include accessibility-relevant states for components and patterns, including:

- keyboard navigation,
- long labels,
- error states,
- empty states,
- dense table usage,
- high-contrast edge cases,
- blocked and warning conditions.

## Critical warning

The biggest accessibility risk here is not missing ARIA on one control. It is designing dense operational screens that work only for experienced mouse users and break down for keyboard users, zoom users, low-vision users, and assistive-technology users under pressure.
