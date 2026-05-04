import type { MatchCollection, MatchResponse } from "@padel/schemas";
import type { TableRowState } from "@padel/ui";

export interface MatchRowViewModel {
  id: string;
  registrationAId: string;
  registrationBId: string;
  status: string;
  scheduledAt: string | null;
  scoreA: number | null;
  scoreB: number | null;
  rowState: TableRowState;
}

export interface MatchManagementViewModel {
  competitionId: string;
  matches: MatchRowViewModel[];
  hasMatches: boolean;
  hasScheduledMatches: boolean;
  hasInProgressMatches: boolean;
  hasCompletedMatches: boolean;
}

export function mapMatchesToRowViewModel(
  matches: MatchCollection,
): MatchRowViewModel[] {
  return matches.map((match: MatchResponse) => ({
    id: match.id,
    registrationAId: match.registrationAId,
    registrationBId: match.registrationBId,
    status: match.status,
    scheduledAt: match.scheduledAt,
    scoreA: match.scoreA,
    scoreB: match.scoreB,
    rowState: "default",
  }));
}

export function mapToMatchManagementViewModel(
  competitionId: string,
  matches: MatchCollection,
): MatchManagementViewModel {
  const matchRows = mapMatchesToRowViewModel(matches);

  return {
    competitionId,
    matches: matchRows,
    hasMatches: matches.length > 0,
    hasScheduledMatches: matches.some((m) => m.status === "scheduled"),
    hasInProgressMatches: matches.some((m) => m.status === "in_progress"),
    hasCompletedMatches: matches.some((m) => m.status === "completed"),
  };
}
