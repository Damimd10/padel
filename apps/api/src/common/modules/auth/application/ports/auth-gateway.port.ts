import type { IncomingHttpHeaders } from "node:http";

export interface AuthSession {
  session: AuthSessionDetails;
  user: AuthenticatedUser;
}

export interface AuthSessionDetails {
  id: string;
  userId: string;
  expiresAt: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
}

export interface AuthResponseHeaders {
  location?: string;
  setCookie: string[];
}

export interface AuthResponse<T> {
  data: T;
  headers: AuthResponseHeaders;
}

export interface SignInWithEmailInput {
  email: string;
  password: string;
}

export interface SignUpWithEmailInput {
  email: string;
  name: string;
  password: string;
}

export interface AuthGateway {
  getSession(headers: IncomingHttpHeaders): Promise<AuthSession | null>;
  getSessionWithHeaders(
    headers: IncomingHttpHeaders,
  ): Promise<AuthResponse<AuthSession | null>>;
  signInWithEmail(
    headers: IncomingHttpHeaders,
    input: SignInWithEmailInput,
  ): Promise<AuthResponse<{ user: AuthenticatedUser }>>;
  signOut(
    headers: IncomingHttpHeaders,
  ): Promise<AuthResponse<{ success: true }>>;
  signUpWithEmail(
    headers: IncomingHttpHeaders,
    input: SignUpWithEmailInput,
  ): Promise<AuthResponse<{ user: AuthenticatedUser }>>;
}

export const AuthGatewayToken = Symbol("AuthGateway");
