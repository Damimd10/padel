import { describe, expect, it } from "vitest";
import {
  ApiClientError,
  competitionCategoriesPath,
  competitionCategoryPath,
  createApiClient,
} from "../src/index.js";

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

  it("exposes category CRUD methods", () => {
    const client = createApiClient();
    expect(client.listCategories).toBeDefined();
    expect(client.createCategory).toBeDefined();
    expect(client.updateCategory).toBeDefined();
    expect(client.deleteCategory).toBeDefined();
  });
});

describe("category path helpers", () => {
  it("builds list/create path for competition categories", () => {
    expect(competitionCategoriesPath("comp-1")).toBe(
      "/competitions/comp-1/categories",
    );
  });

  it("builds update/delete path for a specific category", () => {
    expect(competitionCategoryPath("comp-1", "cat-2")).toBe(
      "/competitions/comp-1/categories/cat-2",
    );
  });
});
