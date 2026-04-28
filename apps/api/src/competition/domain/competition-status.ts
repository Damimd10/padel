export const competitionStatuses = ["draft", "open", "closed"] as const;

export type CompetitionStatus = (typeof competitionStatuses)[number];

export const draftCompetitionStatus = "draft" as const;
