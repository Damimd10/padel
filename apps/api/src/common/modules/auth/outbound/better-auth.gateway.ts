import type { IncomingHttpHeaders } from "node:http";

import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { isAPIError } from "better-auth/api";
import { fromNodeHeaders } from "better-auth/node";

import { PrismaService } from "../../../../prisma/prisma.service.js";
import { AuthGatewayError } from "../application/auth-gateway.error.js";
import type {
  AuthGateway,
  AuthResponse,
  AuthSession,
  AuthenticatedUser,
  SignInWithEmailInput,
  SignUpWithEmailInput,
} from "../application/ports/auth-gateway.port.js";

@Injectable()
export class BetterAuthGateway implements AuthGateway {
  private readonly auth;

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.auth = betterAuth({
      database: prismaAdapter(this.prisma, {
        provider: "postgresql",
      }),
      secret: this.configService.getOrThrow<string>("BETTER_AUTH_SECRET"),
      baseURL: this.configService.getOrThrow<string>("BETTER_AUTH_URL"),
      basePath: "/auth",
      emailAndPassword: {
        enabled: true,
      },
    });
  }

  async getSession(headers: IncomingHttpHeaders): Promise<AuthSession | null> {
    return this.mapSession(
      await this.auth.api.getSession({
        headers: fromNodeHeaders(headers),
      }),
    );
  }

  async getSessionWithHeaders(
    headers: IncomingHttpHeaders,
  ): Promise<AuthResponse<AuthSession | null>> {
    const result = await this.auth.api.getSession({
      headers: fromNodeHeaders(headers),
      returnHeaders: true,
    });

    return {
      data: this.mapSession(result.response),
      headers: this.mapHeaders(result.headers),
    };
  }

  async signInWithEmail(
    headers: IncomingHttpHeaders,
    input: SignInWithEmailInput,
  ): Promise<AuthResponse<{ user: AuthenticatedUser }>> {
    try {
      const result = await this.auth.api.signInEmail({
        headers: fromNodeHeaders(headers),
        body: input,
        returnHeaders: true,
      });

      return {
        data: {
          user: this.mapUser(result.response.user),
        },
        headers: this.mapHeaders(result.headers),
      };
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async signOut(
    headers: IncomingHttpHeaders,
  ): Promise<AuthResponse<{ success: true }>> {
    const result = await this.auth.api.signOut({
      headers: fromNodeHeaders(headers),
      returnHeaders: true,
    });

    return {
      data: {
        success: result.response.success as true,
      },
      headers: this.mapHeaders(result.headers),
    };
  }

  async signUpWithEmail(
    headers: IncomingHttpHeaders,
    input: SignUpWithEmailInput,
  ): Promise<AuthResponse<{ user: AuthenticatedUser }>> {
    try {
      const result = await this.auth.api.signUpEmail({
        headers: fromNodeHeaders(headers),
        body: input,
        returnHeaders: true,
      });

      return {
        data: {
          user: this.mapUser(result.response.user),
        },
        headers: this.mapHeaders(result.headers),
      };
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private mapError(error: unknown) {
    if (isAPIError(error)) {
      const code = error.body?.code;

      if (code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
        return new AuthGatewayError(
          "duplicate_email",
          409,
          "An account with that email already exists.",
        );
      }

      if (code === "INVALID_EMAIL_OR_PASSWORD") {
        return new AuthGatewayError(
          "invalid_credentials",
          401,
          "Email or password is incorrect.",
        );
      }
    }

    return error;
  }

  private mapHeaders(headers: Headers) {
    return {
      location: headers.get("location") ?? undefined,
      setCookie:
        typeof headers.getSetCookie === "function"
          ? headers.getSetCookie()
          : [],
    };
  }

  private mapSession(session: unknown): AuthSession | null {
    if (!session) {
      return null;
    }

    const typedSession = session as {
      session: {
        id: string;
        userId: string;
        expiresAt: Date;
      };
      user: {
        id: string;
        email: string;
        name: string;
        emailVerified: boolean;
        image?: string | null;
      };
    };

    return {
      session: {
        id: typedSession.session.id,
        userId: typedSession.session.userId,
        expiresAt: typedSession.session.expiresAt.toISOString(),
      },
      user: this.mapUser(typedSession.user),
    };
  }

  private mapUser(user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image?: string | null;
  }): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      image: user.image ?? null,
    };
  }
}
