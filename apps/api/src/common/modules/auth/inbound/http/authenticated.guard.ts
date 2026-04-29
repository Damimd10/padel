import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { ResolveAuthSessionUseCase } from "../../application/resolve-auth-session.use-case.js";
import type { RequestWithAuthContext } from "./request-with-auth-context.js";

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    @Inject(ResolveAuthSessionUseCase)
    private readonly resolveAuthSessionUseCase: ResolveAuthSessionUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuthContext>();
    const session = await this.resolveAuthSessionUseCase.execute(
      request.headers,
    );

    if (!session) {
      throw new UnauthorizedException();
    }

    request.session = session.session;
    request.user = session.user;

    return true;
  }
}
