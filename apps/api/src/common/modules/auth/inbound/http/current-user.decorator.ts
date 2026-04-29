import { type ExecutionContext, createParamDecorator } from "@nestjs/common";

import type { RequestWithAuthContext } from "./request-with-auth-context.js";

export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithAuthContext>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
