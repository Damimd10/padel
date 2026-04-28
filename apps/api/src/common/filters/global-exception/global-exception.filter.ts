import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { Prisma } from "../../../generated/prisma/client.js";

function isZodLikeError(
  error: unknown,
): error is { name: string; issues: unknown[] } {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    "issues" in error &&
    (error as { name?: unknown }).name === "ZodError" &&
    Array.isArray((error as { issues?: unknown }).issues)
  );
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(HttpAdapterHost)
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    if (isZodLikeError(exception)) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = "Validation failed";
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      message = typeof response === "string" ? response : exception.message;
    } else if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      exception.code === "P2002"
    ) {
      statusCode = HttpStatus.CONFLICT;
      message = "Unique constraint violation";
    }

    httpAdapter.reply(
      ctx.getResponse(),
      {
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      },
      statusCode,
    );
  }
}
