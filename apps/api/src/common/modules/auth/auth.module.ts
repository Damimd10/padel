import { Global, Module } from "@nestjs/common";
import { PrismaModule } from "../../../prisma/prisma.module.js";
import { HandleAuthRequestUseCase } from "./application/handle-auth-request.use-case.js";
import { AuthGatewayToken } from "./application/ports/auth-gateway.port.js";
import { ResolveAuthSessionUseCase } from "./application/resolve-auth-session.use-case.js";
import { AuthenticatedGuard } from "./inbound/http/authenticated.guard.js";
import { BetterAuthGateway } from "./outbound/better-auth.gateway.js";

@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    BetterAuthGateway,
    HandleAuthRequestUseCase,
    ResolveAuthSessionUseCase,
    AuthenticatedGuard,
    {
      provide: AuthGatewayToken,
      useExisting: BetterAuthGateway,
    },
  ],
  exports: [
    AuthGatewayToken,
    HandleAuthRequestUseCase,
    ResolveAuthSessionUseCase,
    AuthenticatedGuard,
  ],
})
export class AuthModule {}
