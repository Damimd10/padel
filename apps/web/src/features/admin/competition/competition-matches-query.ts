import type { PadelApiClient } from "@padel/api-client";
import { type QueryClient, queryOptions } from "@tanstack/react-query";

export function competitionMatchesQueryOptions(
  apiClient: PadelApiClient,
  competitionId: string,
) {
  return queryOptions({
    queryKey: ["competitions", competitionId, "matches"],
    queryFn: ({ signal }) => apiClient.listMatches(competitionId, { signal }),
  });
}

export async function ensureCompetitionMatches(
  queryClient: QueryClient,
  apiClient: PadelApiClient,
  competitionId: string,
) {
  return queryClient.ensureQueryData(
    competitionMatchesQueryOptions(apiClient, competitionId),
  );
}
