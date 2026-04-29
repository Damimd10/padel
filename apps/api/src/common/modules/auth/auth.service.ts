import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaService } from "../../../prisma/prisma.service.js";

@Injectable()
export class AuthService {
  public readonly auth;

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    if (!this.configService) {
      throw new Error("ConfigService is not injected");
    }
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
}
