# UX Guidelines

## Purpose

Define the user-experience guidance for the abstract design system of the competition workflow product.

This guidance is intended to shape:

- workflow clarity,
- information hierarchy,
- trust-building UI behavior,
- risk visibility,
- and operational usability under pressure.

## Product UX posture

This is not a lifestyle or engagement-first product. It is an operational system for:

- club competition managers,
- tournament organizers,
- competition support staff,
- and competitive amateur players.

The primary UX goal is not delight through novelty. The primary UX goal is confident execution of competition workflows with low ambiguity and low operational error.

## Core UX principles

## 1. Make the current state unmistakable

Users must be able to tell, immediately:

- what competition they are looking at,
- what stage it is in,
- what is complete,
- what is pending,
- and what is blocked.

Implications:

- status should be explicit, not implied,
- lifecycle steps should be visually legible,
- unresolved items should never look equivalent to healthy items.

## 2. Put operational risk above secondary detail

This system is used in conditions where mistakes matter:

- invalid registrations,
- wrong category assignment,
- missing results,
- incomplete progression,
- incorrect closure.

Implications:

- error-prone or time-sensitive states should dominate the hierarchy,
- the UI should surface risk before auxiliary metadata,
- dashboards should prioritize what needs action now.

## 3. Prefer administrative clarity over visual minimalism

Dense admin interfaces are acceptable when they improve decision quality.

Implications:

- avoid decorative whitespace that hides operational meaning,
- tables, summaries, and status chips are valid primary tools,
- reduction should not erase distinction between states.

## 4. Make fairness legible

Trust is a product requirement. Users must understand:

- why a participant is approved or rejected,
- which category or division applies,
- how a match progressed,
- whether a result is provisional or validated,
- and why a competition can or cannot be closed.

Implications:

- important rule-driven outcomes need visible rationale,
- the interface should not rely on hidden logic,
- “system says no” without explanation should be treated as poor UX.

## 5. Keep workflows forward-moving

The system should help users continue the workflow, not merely show data.

Implications:

- screens should answer “what is the next action?”,
- actions should be near the information that motivates them,
- review flows should support approve, reject, correct, and continue without context switching.

## 6. Reduce cognitive branching

Competition operations already contain real-world complexity. The interface should not add unnecessary branching.

Implications:

- avoid making users choose among too many equally weighted actions,
- progressive disclosure is preferable to showing every advanced control at once,
- defaults should match the common administrative path.

## Information hierarchy guidance

## Competition-level views

Competition overview screens should emphasize, in order:

1. competition identity and current status,
2. date range and format,
3. category and division structure,
4. operational alerts,
5. registration progress,
6. match/result progress,
7. closure readiness.

What should not dominate:

- decorative branding,
- secondary history,
- peripheral metadata without operational impact.

## Registration views

Registration interfaces should emphasize:

1. participant identity,
2. requested category and division,
3. current review state,
4. rule conflicts or eligibility concerns,
5. recommended action.

Registrations should never require the user to infer whether they are safe to approve.

## Match and result views

Result-oriented interfaces should emphasize:

1. competition and category context,
2. current match state,
3. entered score or missing result state,
4. validation status,
5. progression impact.

Users should not need to navigate away to understand whether a result is final enough to affect the bracket or standings.

## Closure views

Closing a competition is a trust-sensitive action. Closure screens should emphasize:

1. what is complete,
2. what is unresolved,
3. what will become final,
4. what prevents closure.

The system should make closure prerequisites explicit instead of passive.

## Workflow-specific UX guidance

## Create competition

- creation should feel structured, not open-ended,
- step grouping should reflect real organizer decisions,
- category and division setup should be understandable before the competition is saved,
- required fields should be obvious before validation fails.

## Register participant

- registration should be short and deterministic,
- category/division intent should be visible before submission,
- the user should leave knowing whether the registration is pending, accepted, or still under review.

## Review and approve registration

- the reviewer needs side-by-side clarity:
  - who the participant is,
  - what they requested,
  - what rule may be violated,
  - what action is available.

- correction should feel like an administrative resolution flow, not an error punishment flow.

## Generate competition structure

- the transition from approved participants to competition structure should feel deliberate,
- the UI should show whether the participant set is valid enough to proceed,
- generation actions should communicate consequences clearly.

## Record result

- result entry should minimize ambiguity and mis-entry,
- match identity must be unmistakable,
- validation state should be obvious before and after save,
- users should understand whether progression updated successfully.

## Close competition

- closure should feel final,
- unresolved dependencies must be visible before the action is offered,
- the UI should avoid presenting closure as just another routine button.

## Trust-building guidelines

## Explain state transitions

Whenever the system changes a meaningful administrative state, the UI should make clear:

- what changed,
- why it changed,
- whether it is reversible,
- and what it affects downstream.

## Make validations visible before failure when possible

Users should encounter rules early:

- category mismatch,
- missing required fields,
- closure blockers,
- invalid result format.

The best UX is not a better error message after failure. It is reducing preventable failure before submission.

## Preserve administrative confidence

The UI should behave like a reliable operations console:

- stable layout,
- predictable controls,
- consistent terminology,
- explicit statuses,
- conservative feedback for destructive actions.

## Risk visibility patterns

High-risk or unresolved states should be visibly distinct from normal informational states.

Examples of high-risk states:

- pending review,
- invalid registration,
- missing result,
- unresolved progression,
- closure blocked.

Recommended treatment:

- persistent visibility,
- strong but not alarmist contrast,
- action-oriented messaging,
- local context plus summary visibility.

## Dense admin UI guidance

Because this is an operations product, density is acceptable when it improves comprehension.

Rules:

- favor scanability over visual emptiness,
- support comparison between rows and statuses,
- keep labels short but explicit,
- reserve large visual emphasis for real state changes and blockers.

Dense should not mean cluttered. It should mean information-rich and readable.

## Content and language guidance

Use language that is:

- operational,
- direct,
- unambiguous,
- and role-appropriate.

Avoid:

- playful microcopy,
- vague status labels,
- marketing-style language inside workflows.

Preferred wording characteristics:

- “Pending review” over “Waiting”
- “Result not validated” over “Incomplete”
- “Competition cannot be closed” plus reason over “Action unavailable”

## Feedback patterns

The system should provide feedback at three levels:

### Immediate

- field validation,
- action acknowledgment,
- save success/failure.

### Contextual

- updated status chips,
- changed counts,
- progression impact,
- closure blockers.

### Historical

- who changed what,
- when it changed,
- and whether the competition state is now final.

## Navigation guidance

- navigation should follow the competition mental model, not generic app sections,
- users should be able to move from overview to registrations to structure to results to closure with low friction,
- the current competition context must remain visible while navigating operational subviews.

## Mobile and responsive guidance

This is primarily a workflow-heavy system, so desktop should be the primary optimization target.

However:

- critical actions must remain available on mobile,
- operational summaries should collapse intelligently,
- dense tables should degrade into readable stacked structures rather than unusable horizontal compression.

Responsive behavior should preserve meaning, not just layout.

## Anti-patterns to avoid

- dashboard-first design that hides real task flows,
- generic card-heavy SaaS layouts with weak state distinction,
- color-only communication of critical states,
- modal-heavy workflows for routine review actions,
- burying validation logic behind secondary screens,
- making “final” actions look visually identical to low-risk actions.

## UX success criteria for the design system

The design system should be considered UX-aligned if it helps the final product achieve these qualities:

- organizers can identify the current competition state quickly,
- support staff can see unresolved issues without searching,
- players understand their registration and progression status,
- administrative mistakes become easier to detect before they propagate,
- trust in competition flow is reinforced by the interface itself.
