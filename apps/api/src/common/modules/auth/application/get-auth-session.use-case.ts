import type { IncomingHttpHeaders } from "node:http";

import { Inject, Injectable } from "@nestjs/common";

import {
  type AuthGateway,
  AuthGatewayToken,
} from "./ports/auth-gateway.port.js";

@Injectable()
export class GetAuthSessionUseCase {
  constructor(
    @Inject(AuthGatewayToken)
    private readonly authGateway: AuthGateway,
  ) {}

  async execute(headers: IncomingHttpHeaders) {
    return this.authGateway.getSessionWithHeaders(headers);
  }
}
