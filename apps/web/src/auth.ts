import type { PadelApiClient } from "@padel/api-client";
import type { QueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";

export const authFlashMessageQueryKey = ["auth", "flash-message"] as const;
export const authSessionQueryKey = ["auth", "session"] as const;

export function buildFieldErrorMap<TValues extends Record<string, unknown>>(
  issues: Array<{
    message: string;
    path: PropertyKey[];
  }>,
) {
  const errors = {} as Partial<Record<Extract<keyof TValues, string>, string>>;

  for (const issue of issues) {
    const [segment] = issue.path;

    if (typeof segment !== "string" || segment in errors) {
      continue;
    }

    errors[segment as Extract<keyof TValues, string>] = issue.message;
  }

  return errors;
}

export function clearFieldError<TValues extends Record<string, unknown>>(
  errors: Partial<Record<Extract<keyof TValues, string>, string>>,
  name: Extract<keyof TValues, string>,
) {
  if (!(name in errors)) {
    return errors;
  }

  const nextErrors = { ...errors };
  delete nextErrors[name];
  return nextErrors;
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return fallback;
}

export function getSessionQueryOptions(apiClient: PadelApiClient) {
  return queryOptions({
    queryFn: () => apiClient.getCurrentSession(),
    queryKey: authSessionQueryKey,
    staleTime: 30_000,
  });
}

export function refreshSession(
  queryClient: QueryClient,
  apiClient: PadelApiClient,
) {
  void queryClient.invalidateQueries({
    exact: true,
    queryKey: authSessionQueryKey,
  });

  return queryClient.fetchQuery({
    ...getSessionQueryOptions(apiClient),
    staleTime: 0,
  });
}
