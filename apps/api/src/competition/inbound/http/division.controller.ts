import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  createDivisionRequestSchema,
  divisionCollectionSchema,
  divisionResponseSchema,
  updateDivisionRequestSchema,
} from "@padel/schemas";

import { AuthenticatedGuard } from "../../../common/modules/auth/inbound/http/authenticated.guard.js";
import { CreateDivisionUseCase } from "../../application/create-division.use-case.js";
import { DeleteDivisionUseCase } from "../../application/delete-division.use-case.js";
import { ListDivisionsUseCase } from "../../application/list-divisions.use-case.js";
import { UpdateDivisionUseCase } from "../../application/update-division.use-case.js";

@Controller("competitions/:competitionId/divisions")
export class DivisionController {
  constructor(
    @Inject(CreateDivisionUseCase)
    private readonly createDivisionUseCase: CreateDivisionUseCase,
    @Inject(ListDivisionsUseCase)
    private readonly listDivisionsUseCase: ListDivisionsUseCase,
    @Inject(UpdateDivisionUseCase)
    private readonly updateDivisionUseCase: UpdateDivisionUseCase,
    @Inject(DeleteDivisionUseCase)
    private readonly deleteDivisionUseCase: DeleteDivisionUseCase,
  ) {}

  @Get()
  @UseGuards(AuthenticatedGuard)
  async listDivisions(@Param("competitionId") competitionId: string) {
    const response = await this.listDivisionsUseCase.execute(competitionId);

    return divisionCollectionSchema.parse(response);
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.CREATED)
  async createDivision(
    @Param("competitionId") competitionId: string,
    @Body() body: unknown,
  ) {
    const request = createDivisionRequestSchema.parse(body);

    const response = await this.createDivisionUseCase.execute({
      competitionId,
      name: request.name,
    });

    return divisionResponseSchema.parse(response);
  }

  @Patch(":divisionId")
  @UseGuards(AuthenticatedGuard)
  async updateDivision(
    @Param("divisionId") divisionId: string,
    @Body() body: unknown,
  ) {
    const request = updateDivisionRequestSchema.parse(body);

    const response = await this.updateDivisionUseCase.execute({
      divisionId,
      name: request.name,
    });

    return divisionResponseSchema.parse(response);
  }

  @Delete(":divisionId")
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDivision(@Param("divisionId") divisionId: string) {
    await this.deleteDivisionUseCase.execute({ divisionId });
  }
}
