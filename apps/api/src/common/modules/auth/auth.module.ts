import { Global, Module } from "@nestjs/common";
import { PrismaModule } from "../../../prisma/prisma.module.js";
import { GetAuthSessionUseCase } from "./application/get-auth-session.use-case.js";
import { AuthGatewayToken } from "./application/ports/auth-gateway.port.js";
import { ResolveAuthSessionUseCase } from "./application/resolve-auth-session.use-case.js";
import { SignInWithEmailUseCase } from "./application/sign-in-with-email.use-case.js";
import { SignOutUseCase } from "./application/sign-out.use-case.js";
import { SignUpWithEmailUseCase } from "./application/sign-up-with-email.use-case.js";
import { AuthController } from "./inbound/http/auth.controller.js";
import { AuthenticatedGuard } from "./inbound/http/authenticated.guard.js";
import { BetterAuthGateway } from "./outbound/better-auth.gateway.js";

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    BetterAuthGateway,
    GetAuthSessionUseCase,
    ResolveAuthSessionUseCase,
    SignInWithEmailUseCase,
    SignOutUseCase,
    SignUpWithEmailUseCase,
    AuthenticatedGuard,
    {
      provide: AuthGatewayToken,
      useExisting: BetterAuthGateway,
    },
  ],
  exports: [
    AuthGatewayToken,
    GetAuthSessionUseCase,
    ResolveAuthSessionUseCase,
    SignInWithEmailUseCase,
    SignOutUseCase,
    SignUpWithEmailUseCase,
    AuthenticatedGuard,
  ],
})
export class AuthModule {}
