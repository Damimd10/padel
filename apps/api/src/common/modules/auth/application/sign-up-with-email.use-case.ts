import type { IncomingHttpHeaders } from "node:http";

import { Inject, Injectable } from "@nestjs/common";

import type { SignUpWithEmailRequest } from "@padel/schemas";

import {
  type AuthGateway,
  AuthGatewayToken,
} from "./ports/auth-gateway.port.js";

@Injectable()
export class SignUpWithEmailUseCase {
  constructor(
    @Inject(AuthGatewayToken)
    private readonly authGateway: AuthGateway,
  ) {}

  async execute(headers: IncomingHttpHeaders, request: SignUpWithEmailRequest) {
    return this.authGateway.signUpWithEmail(headers, request);
  }
}
