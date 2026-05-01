import { competitionOverviewPath } from "@padel/api-client";
import { competitionOverviewFixture } from "./features/competition-operations/competition-overview-fixtures.js";

const fixtureLatencyMs = 120;

function delay(durationMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

export function createScaffoldApiFetch(): typeof globalThis.fetch {
  return async (input, init) => {
    const request = new Request(input, init);
    const requestUrl = new URL(request.url, "https://padel.local");

    if (requestUrl.pathname.endsWith(competitionOverviewPath)) {
      await delay(fixtureLatencyMs);

      return new Response(JSON.stringify(competitionOverviewFixture), {
        headers: {
          "content-type": "application/json",
        },
        status: 200,
      });
    }

    return globalThis.fetch(request);
  };
}
