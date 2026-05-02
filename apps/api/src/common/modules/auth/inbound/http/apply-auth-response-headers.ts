import type { Response } from "express";

import type { AuthResponseHeaders } from "../../application/ports/auth-gateway.port.js";

export function applyAuthResponseHeaders(
  response: Response,
  headers: AuthResponseHeaders,
) {
  if (headers.location) {
    response.setHeader("location", headers.location);
  }

  if (headers.setCookie.length > 0) {
    response.setHeader("set-cookie", headers.setCookie);
  }
}
