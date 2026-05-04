export const matchStatuses = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type MatchStatus = (typeof matchStatuses)[number];

export const scheduledMatchStatus = "scheduled" as const;
export const inProgressMatchStatus = "in_progress" as const;
export const completedMatchStatus = "completed" as const;
export const cancelledMatchStatus = "cancelled" as const;
