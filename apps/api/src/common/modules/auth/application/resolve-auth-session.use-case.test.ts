import type { IncomingHttpHeaders } from "node:http";

import { describe, expect, it, vi } from "vitest";

import type { AuthGateway } from "./ports/auth-gateway.port.js";
import { ResolveAuthSessionUseCase } from "./resolve-auth-session.use-case.js";

describe("ResolveAuthSessionUseCase", () => {
  it("delegates session lookup to the auth gateway", async () => {
    const session = {
      session: {
        id: "session-1",
        userId: "user-1",
        expiresAt: "2026-05-10T10:00:00.000Z",
      },
      user: {
        id: "user-1",
        email: "user@example.com",
        name: "Auth User",
        emailVerified: false,
        image: null,
      },
    };
    const getSession = vi
      .fn<AuthGateway["getSession"]>()
      .mockResolvedValue(session);
    const authGateway: AuthGateway = {
      getSession,
      getSessionWithHeaders: vi.fn(),
      signInWithEmail: vi.fn(),
      signOut: vi.fn(),
      signUpWithEmail: vi.fn(),
    };
    const headers: IncomingHttpHeaders = {
      cookie: "better-auth.session_token=test",
    };

    const useCase = new ResolveAuthSessionUseCase(authGateway);

    await expect(useCase.execute(headers)).resolves.toEqual(session);
    expect(getSession).toHaveBeenCalledWith(headers);
  });
});
