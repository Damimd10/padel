import type { PadelApiClient } from "@padel/api-client";
import { type QueryClient, queryOptions } from "@tanstack/react-query";

export function competitionDivisionsQueryOptions(
  apiClient: PadelApiClient,
  competitionId: string,
) {
  return queryOptions({
    queryKey: ["competitions", competitionId, "divisions"],
    queryFn: ({ signal }) => apiClient.listDivisions(competitionId, { signal }),
  });
}

export async function ensureCompetitionDivisions(
  queryClient: QueryClient,
  apiClient: PadelApiClient,
  competitionId: string,
) {
  return queryClient.ensureQueryData(
    competitionDivisionsQueryOptions(apiClient, competitionId),
  );
}
