import type { PadelApiClient } from "@padel/api-client";
import { type QueryClient, queryOptions } from "@tanstack/react-query";

export function competitionCategoriesQueryOptions(
  apiClient: PadelApiClient,
  competitionId: string,
) {
  return queryOptions({
    queryKey: ["competitions", competitionId, "categories"],
    queryFn: ({ signal }) =>
      apiClient.listCategories(competitionId, { signal }),
  });
}

export async function ensureCompetitionCategories(
  queryClient: QueryClient,
  apiClient: PadelApiClient,
  competitionId: string,
) {
  return queryClient.ensureQueryData(
    competitionCategoriesQueryOptions(apiClient, competitionId),
  );
}
