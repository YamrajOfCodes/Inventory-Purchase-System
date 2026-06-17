import { prisma } from "@/lib/prisma";
import { CreateProductInput } from "@/shared/validators/product.schema";

export const productService = {
  async create(data: CreateProductInput) {
    return prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        reorderLevel: data.reorderLevel,
      },
    });
  },

  async getAll() {
    return prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

    async getLowStockProducts() {
    const products =
      await prisma.product.findMany();

    return products.filter(
      (product) =>
        product.stockOnHand <
        product.reorderLevel
    );
  },
};