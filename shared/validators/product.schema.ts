import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  reorderLevel: z.number().int().positive(),
});


export type CreateProductInput = z.infer<typeof createProductSchema>;