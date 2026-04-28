import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
  Optional,
} from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";

import { PrismaClient } from "../../generated/prisma/client.js";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(@Optional() configService?: ConfigService) {
    super({
      datasourceUrl:
        configService?.get<string>("DATABASE_URL") ?? process.env.DATABASE_URL,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
