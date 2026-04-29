import type {
  IncomingHttpHeaders,
  IncomingMessage,
  ServerResponse,
} from "node:http";

export interface AuthSession {
  session: Record<string, unknown>;
  user: AuthenticatedUser;
}

export interface AuthenticatedUser extends Record<string, unknown> {
  id: string;
}

export interface AuthGateway {
  getSession(headers: IncomingHttpHeaders): Promise<AuthSession | null>;
  handleRequest(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<unknown>;
}

export const AuthGatewayToken = Symbol("AuthGateway");
