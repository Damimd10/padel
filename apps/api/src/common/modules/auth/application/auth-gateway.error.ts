export type AuthGatewayErrorCode =
  | "auth_unavailable"
  | "duplicate_email"
  | "expired_token"
  | "invalid_credentials"
  | "invalid_token";

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
