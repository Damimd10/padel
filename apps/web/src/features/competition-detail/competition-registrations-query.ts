import type { PadelApiClient } from "@padel/api-client";
import { type QueryClient, queryOptions } from "@tanstack/react-query";

export function competitionRegistrationsQueryOptions(
  apiClient: PadelApiClient,
  competitionId: string,
) {
  return queryOptions({
    queryKey: ["competitions", competitionId, "registrations"],
    queryFn: ({ signal }) =>
      apiClient.listRegistrations(competitionId, { signal }),
  });
}

export async function ensureCompetitionRegistrations(
  queryClient: QueryClient,
  apiClient: PadelApiClient,
  competitionId: string,
) {
  return queryClient.ensureQueryData(
    competitionRegistrationsQueryOptions(apiClient, competitionId),
  );
}
