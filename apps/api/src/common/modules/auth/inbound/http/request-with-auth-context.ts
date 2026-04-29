import type { Request } from "express";

import type { AuthSession } from "../../application/ports/auth-gateway.port.js";

export interface RequestWithAuthContext extends Request {
  session?: AuthSession["session"];
  user?: AuthSession["user"];
}
