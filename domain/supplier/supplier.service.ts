import { prisma } from "@/lib/prisma";
import { CreateSupplierInput } from "@/shared/validators/supplier.validator";

export const supplierService = {
  async getAll() {
    return prisma.supplier.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async create(data: CreateSupplierInput) {
    return prisma.supplier.create({
      data,
    });
  },
};