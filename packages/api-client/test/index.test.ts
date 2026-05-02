import { describe, expect, it } from "vitest";
import { ApiClientError, createApiClient } from "../src/index.js";

describe("api-client package", () => {
  it("creates a client with default options", () => {
    const client = createApiClient();
    expect(client).toBeDefined();
    expect(client.getCompetitionOverview).toBeDefined();
    expect(client.signInWithEmail).toBeDefined();
    expect(client.signUpWithEmail).toBeDefined();
    expect(client.signOut).toBeDefined();
    expect(client.getSession).toBeDefined();
  });

  it("creates a client with custom base URL", () => {
    const client = createApiClient({ apiBaseUrl: "https://padel.test/api" });
    expect(client).toBeDefined();
  });
});
