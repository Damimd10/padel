import type { IncomingMessage, ServerResponse } from "node:http";

import { Inject, Injectable } from "@nestjs/common";

import {
  type AuthGateway,
  AuthGatewayToken,
} from "./ports/auth-gateway.port.js";

@Injectable()
export class HandleAuthRequestUseCase {
  constructor(
    @Inject(AuthGatewayToken)
    private readonly authGateway: AuthGateway,
  ) {}

  async execute(request: IncomingMessage, response: ServerResponse) {
    return this.authGateway.handleRequest(request, response);
  }
}
