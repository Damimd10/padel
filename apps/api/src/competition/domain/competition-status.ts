export const competitionStatuses = [
  "draft",
  "open",
  "closed",
  "cancelled",
] as const;

export type CompetitionStatus = (typeof competitionStatuses)[number];

export const draftCompetitionStatus = "draft" as const;
export const openCompetitionStatus = "open" as const;
export const closedCompetitionStatus = "closed" as const;
export const cancelledCompetitionStatus = "cancelled" as const;
