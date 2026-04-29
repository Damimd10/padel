import type {
  IncomingHttpHeaders,
  IncomingMessage,
  ServerResponse,
} from "node:http";

import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { toNodeHandler } from "better-auth/node";

import { PrismaService } from "../../../../prisma/prisma.service.js";
import type {
  AuthGateway,
  AuthSession,
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
      emailAndPassword: {
        enabled: true,
      },
    });
  }

  async getSession(headers: IncomingHttpHeaders): Promise<AuthSession | null> {
    const requestHeaders = new Headers();

    for (const [key, value] of Object.entries(headers)) {
      if (Array.isArray(value)) {
        for (const headerValue of value) {
          requestHeaders.append(key, headerValue);
        }

        continue;
      }

      if (typeof value === "string") {
        requestHeaders.set(key, value);
      }
    }

    return (await this.auth.api.getSession({
      headers: requestHeaders,
    })) as AuthSession | null;
  }

  async handleRequest(request: IncomingMessage, response: ServerResponse) {
    return toNodeHandler(this.auth)(request, response);
  }
}
