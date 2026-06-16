import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(1),
});

export type CreateSupplierInput = z.infer<
  typeof createSupplierSchema
>;