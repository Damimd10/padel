import type { IncomingHttpHeaders } from "node:http";

import { Inject, Injectable } from "@nestjs/common";

import type { ResetPasswordRequest } from "@padel/schemas";

import {
  type AuthGateway,
  AuthGatewayToken,
} from "./ports/auth-gateway.port.js";

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(AuthGatewayToken)
    private readonly authGateway: AuthGateway,
  ) {}

  async execute(headers: IncomingHttpHeaders, request: ResetPasswordRequest) {
    return this.authGateway.resetPassword(headers, request);
  }
}
