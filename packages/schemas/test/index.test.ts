import { describe, expect, it } from "vitest";

import {
  authErrorSchema,
  authSessionResponseSchema,
  authMutationResponseSchema,
  competitionOverviewCollectionSchema,
  createCompetitionRequestSchema,
  createCompetitionResponseSchema,
  signInWithEmailRequestSchema,
  signOutResponseSchema,
  signUpWithEmailRequestSchema,
} from "../src/index.js";

describe("auth schemas", () => {
  it("parses a valid sign-up request", () => {
    expect(
      signUpWithEmailRequestSchema.parse({
        name: "Operations User",
        email: "ops@example.com",
        password: "password-1234",
      }),
    ).toMatchObject({
      email: "ops@example.com",
      name: "Operations User",
    });
  });

  it("rejects a sign-in request with a short password", () => {
    expect(() =>
      signInWithEmailRequestSchema.parse({
        email: "ops@example.com",
        password: "short",
      }),
    ).toThrow();
  });

  it("parses an authenticated auth response", () => {
    expect(
      authMutationResponseSchema.parse({
        user: {
          id: "user-1",
          email: "ops@example.com",
          name: "Operations User",
          emailVerified: false,
          image: null,
        },
      }),
    ).toMatchObject({
      user: {
        id: "user-1",
      },
    });
  });

  it("parses an anonymous session response", () => {
    expect(
      authSessionResponseSchema.parse({
        authenticated: false,
      }),
    ).toEqual({
      authenticated: false,
    });
  });

  it("parses an auth error payload", () => {
    expect(
      authErrorSchema.parse({
        code: "invalid_credentials",
        message: "Email or password is incorrect.",
      }),
    ).toMatchObject({
      code: "invalid_credentials",
    });
  });

  it("rejects a sign-out response that is not successful", () => {
    expect(() =>
      signOutResponseSchema.parse({
        success: false,
      }),
    ).toThrow();
  });
});

describe("competition schemas", () => {
  it("parses a valid create-competition request", () => {
    expect(
      createCompetitionRequestSchema.parse({
        title: "Regional Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
      }),
    ).toMatchObject({
      title: "Regional Open",
      format: "elimination",
    });
  });

  it("rejects a create-competition request that includes ownerId", () => {
    expect(() =>
      createCompetitionRequestSchema.parse({
        title: "Regional Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
      }),
    ).toThrow();
  });

  it("rejects a response with a non-draft status", () => {
    expect(() =>
      createCompetitionResponseSchema.parse({
        id: crypto.randomUUID(),
        title: "Regional Open",
        format: "elimination",
        startsAt: "2026-05-10T10:00:00.000Z",
        endsAt: "2026-05-12T18:00:00.000Z",
        ownerId: "owner-1",
        status: "open",
      }),
    ).toThrow();
  });

  it("parses a valid competition overview collection", () => {
    expect(
      competitionOverviewCollectionSchema.parse([
        {
          id: crypto.randomUUID(),
          title: "Regional Open",
          format: "round-robin",
          status: "open",
          startsAt: "2026-05-10T10:00:00.000Z",
          endsAt: "2026-05-12T18:00:00.000Z",
          owner: {
            id: "owner-1",
            name: "Operations User",
            email: "ops@example.com",
          },
        },
      ]),
    ).toHaveLength(1);
  });

  it("rejects a competition overview item without owner context", () => {
    expect(() =>
      competitionOverviewCollectionSchema.parse([
        {
          id: crypto.randomUUID(),
          title: "Regional Open",
          format: "round-robin",
          status: "open",
          startsAt: "2026-05-10T10:00:00.000Z",
          endsAt: "2026-05-12T18:00:00.000Z",
        },
      ]),
    ).toThrow();
  });
});
