# Use Cases

## Purpose

Define the primary system use cases for the MVP competition workflow.

## UC-01 Create Competition

### Goal

Allow an authorized organizer or competition manager to create a tournament or amateur competition.

### Primary actors

- Tournament organizer
- Club competition manager

### Preconditions

- The acting user has permission to create competitions.

### Main flow

1. The actor starts competition creation.
2. The actor defines competition details, dates, format, and ownership.
3. The actor configures categories and sex divisions when applicable.
4. The system stores the competition and marks it as draft or open for registration.

### Postconditions

- A competition exists and is visible to authorized users.

### Exceptions

- The actor lacks permission.
- Required competition information is incomplete.

## UC-02 Register Participant

### Goal

Allow a player or authorized staff member to register a participant in a competition.

### Primary actors

- Player
- Tournament organizer
- Competition support staff

### Preconditions

- A valid competition exists.
- Registration is open.

### Main flow

1. The actor selects a competition.
2. The actor submits the registration.
3. The system associates the registration with the relevant category or division.
4. The system records the registration with an administrative status.

### Postconditions

- A competition registration exists and is visible to authorized users.

### Exceptions

- Registration is closed.
- Required participant information is incomplete.

## UC-03 Review and Approve Registration

### Goal

Allow authorized users to validate whether a registration belongs in the competition and in the correct category or division.

### Primary actors

- Tournament organizer
- Club competition manager

### Preconditions

- A registration exists in pending or reviewable state.

### Main flow

1. The actor reviews the registration.
2. The actor checks the intended category and division.
3. The actor approves, rejects, or adjusts the registration.
4. The system updates registration status.

### Postconditions

- The registration has an explicit reviewed state.

### Exceptions

- The actor lacks permission.
- The registration fails the competition rules and cannot be approved.

## UC-04 Generate or Manage Competition Structure

### Goal

Allow the organizer to move from approved registrations to an executable match structure.

### Primary actors

- Tournament organizer
- Club competition manager

### Preconditions

- The competition exists.
- Approved participants are available.

### Main flow

1. The actor selects the competition.
2. The actor reviews approved entries by category and division.
3. The actor generates or configures the match structure.
4. The system stores the resulting competition structure.

### Postconditions

- The competition has a defined progression structure.

### Exceptions

- The participant set is incomplete or invalid for the selected format.

## UC-05 Record Match Result

### Goal

Allow authorized users to capture results and keep competition progression current.

### Primary actors

- Competition support staff
- Tournament organizer

### Preconditions

- A valid match exists in the competition structure.

### Main flow

1. The actor selects the relevant match.
2. The actor enters the result.
3. The system stores the result with the appropriate status.
4. If the result satisfies validation rules, the system updates progression and standings.

### Postconditions

- The match result is recorded and competition state is updated appropriately.

### Exceptions

- The result is incomplete or invalid.
- The actor lacks permission.

## UC-06 Review Competition Operations

### Goal

Allow organizers and staff to understand what requires action across active competitions.

### Primary actors

- Club competition manager
- Tournament organizer
- Competition support staff

### Preconditions

- One or more competitions exist.

### Main flow

1. The actor opens the competition operations view.
2. The system presents registration state, pending approvals, active matches, and pending results.
3. The actor identifies unresolved operational issues.
4. The actor drills into a competition and takes action where needed.

### Postconditions

- The actor understands where intervention is required.

### Exceptions

- The actor lacks permission to access the operational view.

## UC-07 Correct Administrative or Result Data

### Goal

Allow authorized staff to resolve mistakes without losing operational trust.

### Primary actors

- Tournament organizer
- Competition support staff

### Preconditions

- The actor has permission to manage the competition.
- A registration, category assignment, or result record exists.

### Main flow

1. The actor identifies an incorrect administrative or result record.
2. The actor updates the relevant data.
3. The system preserves the corrected competition state.
4. The system recalculates progression where required.

### Postconditions

- The competition reflects the latest trusted operational state.

### Exceptions

- The correction would create an invalid competition state.

## UC-08 Close Competition

### Goal

Allow an authorized user to finalize a competition and complete the workflow cleanly.

### Primary actors

- Tournament organizer
- Club competition manager

### Preconditions

- The competition is ready for closure.

### Main flow

1. The actor reviews competition completion state.
2. The actor verifies that required results and outcomes are complete.
3. The system presents final standings, winners, or progression outcomes.
4. The actor marks the competition closed.

### Postconditions

- The competition is complete.
- Competition history is updated.

### Exceptions

- The competition still has unresolved registrations, missing results, or incomplete progression.

## UC-09 Review Participant Competition History

### Goal

Allow authorized users to understand prior competition participation without relying on memory or external notes.

### Primary actors

- Tournament organizer
- Club competition manager

### Preconditions

- The participant has at least one finalized competition record.

### Main flow

1. The actor selects a participant.
2. The system displays basic competition history from closed competitions.
3. The actor uses that information for operational context.

### Postconditions

- The actor has usable competition history for future administrative decisions.

### Exceptions

- No prior finalized history exists.
