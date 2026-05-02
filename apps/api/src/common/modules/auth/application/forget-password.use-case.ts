import type { IncomingHttpHeaders } from "node:http";

import { Inject, Injectable } from "@nestjs/common";

import type { ForgetPasswordRequest } from "@padel/schemas";

import {
  type AuthGateway,
  AuthGatewayToken,
} from "./ports/auth-gateway.port.js";

@Injectable()
export class ForgetPasswordUseCase {
  constructor(
    @Inject(AuthGatewayToken)
    private readonly authGateway: AuthGateway,
  ) {}

  async execute(headers: IncomingHttpHeaders, request: ForgetPasswordRequest) {
    return this.authGateway.forgetPassword(headers, request);
  }
}
