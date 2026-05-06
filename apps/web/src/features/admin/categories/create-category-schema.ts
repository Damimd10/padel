import { z } from "zod";

export const createCategoryFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  shortCode: z.string().trim().min(1, "Short code is required").max(5),
  description: z.string().trim().optional(),
  skillLevel: z.number().int().min(0).max(9),
  color: z.string().trim().min(1, "Color is required"),
  divisions: z.array(z.enum(["masculino", "femenino", "mixto"])),
  minRanking: z.number().int().min(0).optional(),
  maxRanking: z.number().int().min(0).optional(),
  requiresOfficialRanking: z.boolean(),
  allowCategoryChange: z.boolean(),
  isActive: z.boolean(),
});

export type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>;
