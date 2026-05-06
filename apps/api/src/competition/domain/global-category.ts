import type { GlobalCategoryResponse } from "@padel/schemas";
import type { CreateGlobalCategoryCommand } from "../application/create-global-category.use-case.js";
import { type DivisionName, assertDivisionName } from "./division-name.js";

export interface GlobalCategoryProps {
  id: string;
  name: string;
  shortCode: string;
  description: string | null;
  skillLevel: number;
  color: string;
  divisions: DivisionName[];
  minRanking: number | null;
  maxRanking: number | null;
  requiresOfficialRanking: boolean;
  allowCategoryChange: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class GlobalCategory {
  private constructor(private readonly props: GlobalCategoryProps) {}

  static create(input: CreateGlobalCategoryCommand, id: string) {
    const name = input.name.trim();
    const shortCode = input.shortCode.trim().toUpperCase();

    if (name.length === 0) {
      throw new Error("Category name is required.");
    }

    if (shortCode.length === 0 || shortCode.length > 5) {
      throw new Error("Short code must be between 1 and 5 characters.");
    }

    if (input.skillLevel < 0 || input.skillLevel > 9) {
      throw new Error("Skill level must be between 0 and 9.");
    }

    const divisions = input.divisions.map((d) => {
      assertDivisionName(d);
      return d;
    });

    const now = new Date().toISOString();

    return new GlobalCategory({
      id,
      name,
      shortCode,
      description: input.description?.trim() ?? null,
      skillLevel: input.skillLevel,
      color: input.color,
      divisions,
      minRanking: input.minRanking ?? null,
      maxRanking: input.maxRanking ?? null,
      requiresOfficialRanking: input.requiresOfficialRanking ?? false,
      allowCategoryChange: input.allowCategoryChange ?? true,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: GlobalCategoryProps) {
    return new GlobalCategory(props);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get shortCode() {
    return this.props.shortCode;
  }

  get isActive() {
    return this.props.isActive;
  }

  toResponse(): GlobalCategoryResponse {
    return {
      id: this.props.id,
      name: this.props.name,
      shortCode: this.props.shortCode,
      description: this.props.description,
      skillLevel: this.props.skillLevel,
      color: this.props.color,
      divisions: this.props.divisions,
      minRanking: this.props.minRanking,
      maxRanking: this.props.maxRanking,
      requiresOfficialRanking: this.props.requiresOfficialRanking,
      allowCategoryChange: this.props.allowCategoryChange,
      isActive: this.props.isActive,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
