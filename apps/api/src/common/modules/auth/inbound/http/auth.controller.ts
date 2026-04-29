import { All, Controller, Inject, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";

import { HandleAuthRequestUseCase } from "../../application/handle-auth-request.use-case.js";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(HandleAuthRequestUseCase)
    private readonly handleAuthRequestUseCase: HandleAuthRequestUseCase,
  ) {}

  @All("*")
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return this.handleAuthRequestUseCase.execute(req, res);
  }
}
