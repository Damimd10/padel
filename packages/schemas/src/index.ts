import { z } from "zod";

export const sharedPingContract = z.object({
  status: z.literal("ok"),
  version: z.literal("0.0.0"),
});

export type SharedPingContract = z.infer<typeof sharedPingContract>;
