import { describe, expect, it } from "vitest";
import {
  ApiClientError,
  competitionOverviewPath,
  createApiClient,
  sampleContractSummary,
} from "../src/index.js";

describe("api-client package", () => {
  it("reads the shared schema package", () => {
    expect(sampleContractSummary()).toBe("ok:0.0.0");
  });

  it("parses the competition overview contract through the typed client", async () => {
    const client = createApiClient({
      apiBaseUrl: "https://padel.test/api",
      fetch: async (input) => {
        expect(input).toBe(`https://padel.test/api${competitionOverviewPath}`);

        return new Response(
          JSON.stringify([
            {
              id: "fa222204-b855-4fb0-b507-e169249e588e",
              title: "North Circuit Masters",
              format: "round-robin",
              status: "open",
              startsAt: "2026-05-03T12:00:00.000Z",
              endsAt: "2026-05-05T21:00:00.000Z",
              owner: {
                id: "44e7eb17-a42b-4de8-bf34-2f8d78680d39",
                name: "Lucia Perez",
                email: "lucia@example.com",
              },
            },
          ]),
          {
            headers: {
              "content-type": "application/json",
            },
            status: 200,
          },
        );
      },
    });

    await expect(client.getCompetitionOverview()).resolves.toMatchObject([
      {
        title: "North Circuit Masters",
        status: "open",
      },
    ]);
  });

  it("throws a typed transport error for non-success responses", async () => {
    const client = createApiClient({
      fetch: async () =>
        new Response(JSON.stringify({ message: "Backend unavailable" }), {
          headers: {
            "content-type": "application/json",
          },
          status: 503,
        }),
    });

    await expect(client.getCompetitionOverview()).rejects.toEqual(
      new ApiClientError(
        "API request failed with status 503.",
        503,
        '{"message":"Backend unavailable"}',
      ),
    );
  });
});
