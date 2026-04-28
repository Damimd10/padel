# Business Rules

## Purpose

Define the operational rules that govern MVP behavior independently from implementation details.

## BR-01 Scope Guardrail

- The MVP is a competition workflow product, not a full club management platform.
- Any rule or feature that assumes ownership of reservations, payments, or broad club operations is out of scope unless later approved.

## BR-02 Authorized Competition Ownership

- Every competition must have a responsible operational owner.
- Only authorized roles may create, manage, progress, or close a competition.

## BR-03 Category and Division Must Be Explicit

- A competition that uses categories or sex-based divisions must represent them explicitly.
- Participants must not be operationally ambiguous across categories or divisions within the same competition.

## BR-04 Registration State Must Be Explicit

- Every participant registration must have a visible administrative state.
- A participant must not appear simultaneously in conflicting registration states within the same competition.

## BR-05 Eligibility Rules Govern Participation

- A participant should not be treated as approved for competition until eligibility and category assignment satisfy the competition rules.
- Pending registration and approved participation must remain distinguishable.

## BR-06 Competition Structure Must Reflect Approved Participants

- Match structure should be generated or managed from approved participants, not from incomplete or invalid registrations.

## BR-07 Result Recording Must Preserve Trust

- A match result must remain unresolved until it satisfies the minimum validation rule for the competition.
- Results must not advance competition structure silently or opaquely.

## BR-08 Authorized Staff May Act on Behalf of Participants

- Authorized staff may update registration, category placement, or results on behalf of participants when operationally necessary.
- Such changes must remain traceable.

## BR-09 Competition Status Must Reflect Real Administrative State

- Competition lifecycle status must reflect administrative reality, not only planned dates.
- A competition with unresolved registrations, missing results, or incomplete progression must not appear equivalent to a complete competition.

## BR-10 Communication Must Follow Competition Workflow

- Notifications must be triggered by meaningful competition events, not arbitrary broadcast behavior.
- Communication should be relevant to the recipient's role and competition state.

## BR-11 Standings and Outcomes Depend on Validated Results

- Standings, winners, or progression outcomes should only derive from valid competition results.
- The MVP must avoid presenting untrusted competition outcomes as final.

## BR-12 Competition Closure Requires Operational Completeness

- A competition should not be considered complete until the minimum required result and progression state is finalized for its format.

## BR-13 Player and Competition History Must Follow Closed Competitions

- Participation and result history should be updated from finalized competitions, not from incomplete or unresolved competition states.

## BR-14 Role Visibility Must Follow Operational Need

- Users should only see or act on information required for their operational role.
- The MVP should not expose full internal administrative visibility to all players by default.

## BR-15 MVP Business Value Rule

- A workflow should only remain in MVP scope if it contributes directly to at least one of these outcomes:
  - lower competition administration time,
  - clearer category and participant control,
  - more trustworthy progression and results,
  - cleaner operational visibility,
  - stronger repeat usage by organizers.

## BR-16 Out-of-Scope Protection

- The following must not be treated as required business behavior for MVP:
  - membership billing,
  - full reservation control,
  - general social session coordination,
  - rich messaging replacement,
  - deep analytics,
  - coach or academy administration.
