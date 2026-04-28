import { Global, Module } from "@nestjs/common";

import { GlobalExceptionFilter } from "../../filters/global-exception/global-exception.filter.js";

@Global()
@Module({
  providers: [GlobalExceptionFilter],
  exports: [GlobalExceptionFilter],
})
export class CoreModule {}
