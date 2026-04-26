# Lefthook Strategy

## Decision

Use `Lefthook` for local Git hooks.

## Purpose

Keep local validation fast, predictable and aligned with CI.

## Hook philosophy

- `pre-commit` should run the fastest reliable checks
- `pre-push` can run a broader affected validation set
- hooks should prefer Nx affected tasks where possible

## Rules

- do not put slow full-repo validation in the default fast hook path without strong reason
- hooks should fail fast on formatting, linting or missing test updates when detectable
