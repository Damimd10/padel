export type AuthGatewayErrorCode =
  | "auth_unavailable"
  | "duplicate_email"
  | "invalid_credentials";

export class AuthGatewayError extends Error {
  constructor(
    readonly code: AuthGatewayErrorCode,
    readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AuthGatewayError";
  }
}
