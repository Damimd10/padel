# Functional Requirements

## Purpose

Define the functional behavior required for the MVP described in `docs/02-product/`.

## Scope statement

These requirements apply only to the MVP wedge:

- competition creation,
- category and sex-based administration,
- participant registration and approval,
- match structure and progression,
- result capture,
- standings and competition closure visibility.

Anything outside that wedge should be treated as out of scope unless explicitly approved later.

## FR-01 User and Role Management

### FR-01.1 Role support

The system must support, at minimum, these user roles:

- club competition manager,
- tournament organizer,
- competition support staff,
- player.

### FR-01.2 Role-based permissions

The system must allow different actions based on role, including:

- competition creation and administration,
- category configuration,
- participant approval,
- result entry,
- progression control,
- and competition closure.

### FR-01.3 Multi-role support

The system must allow one person to hold different roles in different operational contexts when required.

## FR-02 Competition Management

### FR-02.1 Competition creation

The system must allow an authorized user to create a tournament or amateur competition.

### FR-02.2 Competition configuration

The system must allow the organizer to define at least:

- title or identifier,
- date range,
- competition format,
- operational owner,
- registration rules,
- and competition status.

### FR-02.3 Competition lifecycle states

The system must track competition lifecycle states including:

- draft,
- open for registration,
- registration closed,
- in progress,
- completed,
- cancelled.

### FR-02.4 Competition visibility

The system must present current competition state clearly to authorized users.

## FR-03 Category and Division Administration

### FR-03.1 Category management

The system must allow creation and management of competition categories.

### FR-03.2 Sex-based division support

The system must support sex-based segmentation for competition administration where required by the organizer.

### FR-03.3 Category assignment

The system must associate participants with the relevant category and division for the competition.

### FR-03.4 Category separation

The system must keep categories and divisions operationally distinct for registration, progression, and closure.

## FR-04 Registration and Participant Administration

### FR-04.1 Participant registration

The system must allow players or authorized staff to create competition registrations.

### FR-04.2 Registration review

The system must allow authorized users to review and approve, reject, or adjust registrations.

### FR-04.3 Registration status tracking

The system must track and display participant registration state clearly, including:

- registered,
- pending review,
- approved,
- rejected,
- withdrawn.

### FR-04.4 Eligibility support

The system must allow competition rules to influence whether a registration is valid for a category or division.

## FR-05 Match Structure and Progression

### FR-05.1 Competition structure support

The system must support a lightweight bracket, draw, fixture, or match structure for the MVP competition formats.

### FR-05.2 Match generation or administration

The system must allow authorized users to generate or manage match structure for approved participants.

### FR-05.3 Match status tracking

The system must track and display match states clearly, including:

- not started,
- pending result,
- completed,
- validated.

### FR-05.4 Progression updates

The system must update competition progression when authorized results are recorded.

## FR-06 Result Handling

### FR-06.1 Result entry

The system must allow authorized users to record match results.

### FR-06.2 Result validation

The system must support a lightweight result validation rule defined by the competition workflow.

### FR-06.3 Result corrections

The system must allow authorized operational users to correct or resolve invalid result records when necessary.

### FR-06.4 Standings and outcome visibility

The system must provide visibility into standings, winners, or progression outcomes as relevant to the competition format.

## FR-07 Operational Views

### FR-07.1 Competition overview

The system must provide authorized operational users with a view of competitions and their current administrative state.

### FR-07.2 Risk visibility

The system must highlight:

- pending registration approvals,
- invalid or unresolved participant records,
- missing results,
- and unresolved competition-administration gaps.

### FR-07.3 Practical actionability

Operational views must support quick action rather than passive reporting only.

This includes the ability to:

- inspect participant state,
- review categories,
- record results,
- and close competitions.

## FR-08 Competition Closure and History

### FR-08.1 Competition closure

The system must allow an authorized user to finalize and close a competition.

### FR-08.2 Closure prerequisites

The system must only allow closure when required competition data is sufficiently complete for the chosen format.

### FR-08.3 History retention

The system must store basic competition, participant, and result history for completed competitions.

## FR-09 Usability and Adoption Support

### FR-09.1 Low-friction registration

The system must keep player registration and status visibility simple enough to avoid more friction than current manual workflows.

### FR-09.2 Minimal organizer overhead

The system must reduce, not increase, the number of manual administrative steps required to run competitions.

### FR-09.3 Progressive usage

The system must support useful adoption without requiring full replacement of the club's reservation or payment systems.

## Explicit exclusions from functional scope

The following are not functional requirements for the MVP:

- full booking and court inventory management,
- payment and invoicing workflows,
- full club CRM,
- rich chat replacement,
- advanced cross-club rating systems,
- coach and academy management.
