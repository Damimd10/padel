import {
  competitionOverviewCollectionSchema,
  type CompetitionOverviewCollection,
  sharedPingContract,
} from "@padel/schemas";

export const competitionOverviewPath = "/competitions";

export function sampleContractSummary() {
  const parsed = sharedPingContract.parse({ status: "ok", version: "0.0.0" });

  return `${parsed.status}:${parsed.version}`;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly responseBody: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export interface CompetitionOverviewRequestOptions {
  signal?: AbortSignal;
}

export interface CreateApiClientOptions {
  apiBaseUrl?: string;
  fetch?: typeof globalThis.fetch;
}

export interface PadelApiClient {
  getCompetitionOverview(
    options?: CompetitionOverviewRequestOptions,
  ): Promise<CompetitionOverviewCollection>;
}

function buildApiUrl(apiBaseUrl: string, path: string) {
  const normalizedBaseUrl = apiBaseUrl.endsWith("/")
    ? apiBaseUrl.slice(0, -1)
    : apiBaseUrl;

  return `${normalizedBaseUrl}${path}`;
}

async function parseJsonWithSchema<T>(
  response: Response,
  schema: { parse(input: unknown): T },
): Promise<T> {
  const rawBody = await response.text();

  if (!response.ok) {
    throw new ApiClientError(
      `API request failed with status ${response.status}.`,
      response.status,
      rawBody,
    );
  }

  return schema.parse(JSON.parse(rawBody) as unknown);
}

export function createApiClient({
  apiBaseUrl = "/api",
  fetch = globalThis.fetch,
}: CreateApiClientOptions = {}): PadelApiClient {
  if (!fetch) {
    throw new Error(
      "A fetch implementation is required to create the API client.",
    );
  }

  return {
    async getCompetitionOverview(options = {}) {
      const response = await fetch(
        buildApiUrl(apiBaseUrl, competitionOverviewPath),
        {
          credentials: "include",
          headers: {
            accept: "application/json",
          },
          method: "GET",
          signal: options.signal,
        },
      );

      return parseJsonWithSchema(response, competitionOverviewCollectionSchema);
    },
  };
}
