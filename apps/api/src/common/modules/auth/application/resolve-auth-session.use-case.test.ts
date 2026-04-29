import type { IncomingHttpHeaders } from "node:http";

import { describe, expect, it, vi } from "vitest";

import type { AuthGateway } from "./ports/auth-gateway.port.js";
import { ResolveAuthSessionUseCase } from "./resolve-auth-session.use-case.js";

describe("ResolveAuthSessionUseCase", () => {
  it("delegates session lookup to the auth gateway", async () => {
    const session = {
      session: { id: "session-1" },
      user: { id: "user-1" },
    };
    const getSession = vi
      .fn<AuthGateway["getSession"]>()
      .mockResolvedValue(session);
    const authGateway: AuthGateway = {
      getSession,
      handleRequest: vi.fn(),
    };
    const headers: IncomingHttpHeaders = {
      cookie: "better-auth.session_token=test",
    };

    const useCase = new ResolveAuthSessionUseCase(authGateway);

    await expect(useCase.execute(headers)).resolves.toEqual(session);
    expect(getSession).toHaveBeenCalledWith(headers);
  });
});
