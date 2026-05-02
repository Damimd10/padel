import type { IncomingHttpHeaders } from "node:http";

import { Inject, Injectable } from "@nestjs/common";

import type { SignInWithEmailRequest } from "@padel/schemas";

import {
  type AuthGateway,
  AuthGatewayToken,
} from "./ports/auth-gateway.port.js";

@Injectable()
export class SignInWithEmailUseCase {
  constructor(
    @Inject(AuthGatewayToken)
    private readonly authGateway: AuthGateway,
  ) {}

  async execute(headers: IncomingHttpHeaders, request: SignInWithEmailRequest) {
    return this.authGateway.signInWithEmail(headers, request);
  }
}
