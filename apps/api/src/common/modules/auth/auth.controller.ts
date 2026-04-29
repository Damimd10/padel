import { All, Controller, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { AuthService } from "./auth.service.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @All("*")
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.authService.auth)(req, res);
  }
}
