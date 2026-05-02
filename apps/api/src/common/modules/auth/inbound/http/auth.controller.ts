import type { Request, Response } from "express";

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import {
  authErrorSchema,
  authMutationResponseSchema,
  authSessionResponseSchema,
  signInWithEmailRequestSchema,
  signOutResponseSchema,
  signUpWithEmailRequestSchema,
} from "@padel/schemas";

import { AuthGatewayError } from "../../application/auth-gateway.error.js";
import { GetAuthSessionUseCase } from "../../application/get-auth-session.use-case.js";
import { SignInWithEmailUseCase } from "../../application/sign-in-with-email.use-case.js";
import { SignOutUseCase } from "../../application/sign-out.use-case.js";
import { SignUpWithEmailUseCase } from "../../application/sign-up-with-email.use-case.js";
import { applyAuthResponseHeaders } from "./apply-auth-response-headers.js";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(GetAuthSessionUseCase)
    private readonly getAuthSessionUseCase: GetAuthSessionUseCase,
    @Inject(SignUpWithEmailUseCase)
    private readonly signUpWithEmailUseCase: SignUpWithEmailUseCase,
    @Inject(SignInWithEmailUseCase)
    private readonly signInWithEmailUseCase: SignInWithEmailUseCase,
    @Inject(SignOutUseCase)
    private readonly signOutUseCase: SignOutUseCase,
  ) {}

  @Post("sign-up")
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() body: unknown,
  ) {
    const authRequest = signUpWithEmailRequestSchema.parse(body);

    try {
      const result = await this.signUpWithEmailUseCase.execute(
        request.headers,
        authRequest,
      );

      applyAuthResponseHeaders(response, result.headers);

      return authMutationResponseSchema.parse(result.data);
    } catch (error) {
      return this.handleAuthError(response, error);
    }
  }

  @Post("sign-in")
  async signIn(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() body: unknown,
  ) {
    const authRequest = signInWithEmailRequestSchema.parse(body);

    try {
      const result = await this.signInWithEmailUseCase.execute(
        request.headers,
        authRequest,
      );

      applyAuthResponseHeaders(response, result.headers);

      return authMutationResponseSchema.parse(result.data);
    } catch (error) {
      return this.handleAuthError(response, error);
    }
  }

  @Post("sign-out")
  @HttpCode(HttpStatus.OK)
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.signOutUseCase.execute(request.headers);

    applyAuthResponseHeaders(response, result.headers);

    return signOutResponseSchema.parse(result.data);
  }

  @Get("session")
  async getCurrentSession(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.getAuthSessionUseCase.execute(request.headers);

    applyAuthResponseHeaders(response, result.headers);

    if (!result.data) {
      return authSessionResponseSchema.parse({
        authenticated: false,
      });
    }

    return authSessionResponseSchema.parse({
      authenticated: true,
      session: result.data.session,
      user: result.data.user,
    });
  }

  private handleAuthError(response: Response, error: unknown) {
    if (error instanceof AuthGatewayError) {
      response.status(error.statusCode);
      return authErrorSchema.parse({
        code: error.code,
        message: error.message,
      });
    }

    throw error;
  }
}
