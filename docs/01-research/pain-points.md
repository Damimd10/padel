# Pain Points

## Core observation

The problem is not “clubs need more features.” The problem is that key workflows are fragmented, exception-heavy, and trust-sensitive.

## Pain points by workflow

### 1. Fragmented operations

- Reservations may live in one system, communication in WhatsApp, rankings in spreadsheets, and member data somewhere else.
- Staff lose time re-entering information and reconciling conflicts across tools.
- No single source of truth exists for who is playing, who paid, who cancelled, or what changed.

### 2. High coordination overhead

- Filling a missing fourth player is often manual.
- Last-minute cancellations trigger message storms and repeated follow-up.
- Organizers spend time confirming attendance instead of running the event itself.

### 3. Poor support for padel-specific booking behavior

- Many generic booking tools handle court reservation but not social match formation well.
- Padel often requires foursomes, substitutions, partner changes, level matching, open matches, and recurring social formats.
- A pure “reserve a court” workflow is insufficient for many clubs.

### 4. Communication chaos

- WhatsApp is fast but not structured.
- Important updates disappear in long threads.
- Admins cannot reliably target the right subgroup with traceability.
- New or occasional players struggle to understand what is still available and what was already filled.

### 5. Trust problems in rankings and stats

- Self-reported scores are easy to dispute.
- Ranking systems become political if the rules are opaque.
- Different clubs and apps use different level scales, which breaks portability for travelling players.
- If players do not trust the ranking, they stop entering results or ignore the system entirely.

### 6. Exception-heavy real operations

- No-shows.
- Weather changes.
- Court maintenance.
- Late arrivals.
- Unpaid bookings.
- Guest players.
- Mixed roles for the same person.

Products that only support the happy path will fail quickly in this environment.

### 7. Weak visibility for management

- Many operators know demand patterns informally, not systematically.
- They lack reliable insight into peak-hour pressure, no-show rates, recurring cancellations, match fill rates, and community engagement.
- This makes policy decisions reactive instead of evidence-based.

### 8. Role ambiguity

- A person may act as player, coach, organizer, captain, and admin depending on the context.
- Rigid role models create permission friction and operational workarounds.

## Evidence signals from the market

Official product positioning from current vendors repeatedly emphasizes the same issues:

- [CourtReserve](https://courtreserve.com/) positions around reservations, memberships, billing, leagues, ladders, and operational simplification for racquet and paddle clubs.
- [MATCHi](https://www.matchi.se/home/?lang=en_US) positions around booking, player matching, venue administration, and accessibility.
- [SportyHQ](https://www.sportyhq.com/features/facility-bookings) positions around court bookings, leagues, ladders, rankings, membership management, and communication.
- [Playtomic Third Party API](https://third-party.playtomic.io/) exposes domain concepts such as open matches, league matches, tournaments, recurring bookings, players, and venues, which suggests the operational model is broader than simple court rental.

Community discussion also points to persistent real-world friction:

- Players report coordination chaos in large WhatsApp groups for open games and last-minute replacements.
- Players report inconsistent rankings across clubs and apps, which makes travelling or joining new communities harder.
- Players report frustration when club-specific or app-specific ranking systems block access to balanced matches.

These signals are useful, but still anecdotal. Interviews are required before converting them into requirements.

## Most likely acute pain zones

The strongest discovery candidates are:

- Replacing manual coordination for scheduling and substitutions.
- Making club and tournament communication structured without losing immediacy.
- Creating ranking and result workflows that are trusted enough to be maintained.
