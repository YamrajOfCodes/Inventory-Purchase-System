import { prisma } from "@/lib/prisma";
import { CreatePurchaseOrderInput } from "@/shared/validators/purchase-order.validator";

export const purchaseOrderService = {
  async getAll() {
    return prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async createDraft(
    data: CreatePurchaseOrderInput
  ) {
    const supplierProducts =
      await prisma.supplierProduct.findMany({
        where: {
          supplierId: data.supplierId,
        },
      });

    const priceMap = new Map(
      supplierProducts.map((sp) => [
        sp.productId,
        sp.currentPriceMinor,
      ])
    );

    return prisma.purchaseOrder.create({
      data: {
        supplierId: data.supplierId,
        status: "DRAFT",

        items: {
          create: data.items.map((item) => {
            const unitPriceMinor =
              priceMap.get(item.productId) ?? 0;

            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPriceMinor,
              totalMinor:
                unitPriceMinor * item.quantity,
            };
          }),
        },
      },

      include: {
        items: true,
      },
    });
  },
};