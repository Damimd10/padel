import type {
  IncomingHttpHeaders,
  IncomingMessage,
  ServerResponse,
} from "node:http";

import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";

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
      basePath: "/auth",
      emailAndPassword: {
        enabled: true,
      },
    });
  }

  async getSession(headers: IncomingHttpHeaders): Promise<AuthSession | null> {
    return (await this.auth.api.getSession({
      headers: fromNodeHeaders(headers),
    })) as AuthSession | null;
  }

  async handleRequest(request: IncomingMessage, response: ServerResponse) {
    return toNodeHandler(this.auth)(request, response);
  }
}
