import type { PadelApiClient } from "@padel/api-client";
import { queryOptions } from "@tanstack/react-query";

export function competitionOverviewQueryOptions(apiClient: PadelApiClient) {
  return queryOptions({
    queryKey: ["competitions", "overview"],
    queryFn: ({ signal }) => apiClient.getCompetitionOverview({ signal }),
  });
}
