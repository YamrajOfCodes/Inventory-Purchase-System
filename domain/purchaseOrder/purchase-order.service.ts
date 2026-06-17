import { prisma } from "@/lib/prisma";
import { POStatus } from "@prisma/client";

import { AppError } from "@/shared/errors/app-error";
import { CreatePurchaseOrderInput } from "@/shared/validators/purchase-order.validator";

import { assertTransition } from "./purchase-order.state-machine";

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

        status: POStatus.DRAFT,

        items: {
          create: data.items.map((item) => {
            const unitPriceMinor =
              priceMap.get(item.productId) ?? 0;

            return {
              productId: item.productId,
              quantity: item.quantity,

              unitPriceMinor,

              totalMinor:
                unitPriceMinor *
                item.quantity,
            };
          }),
        },
      },

      include: {
        items: true,
      },
    });
  },

  async place(id: string) {
    const purchaseOrder =
      await prisma.purchaseOrder.findUnique({
        where: {
          id,
        },

        include: {
          items: true,
        },
      });

    if (!purchaseOrder) {
      throw new AppError(
        404,
        "Purchase order not found"
      );
    }

    if (purchaseOrder.items.length === 0) {
      throw new AppError(
        400,
        "Purchase order must contain at least one item"
      );
    }

    assertTransition(
      purchaseOrder.status,
      POStatus.PLACED
    );

    return prisma.purchaseOrder.update({
      where: {
        id,
      },

      data: {
        status: POStatus.PLACED,
      },
    });
  },

  async cancel(id: string) {
  const purchaseOrder =
    await prisma.purchaseOrder.findUnique({
      where: {
        id,
      },
    });

  if (!purchaseOrder) {
    throw new AppError(
      404,
      "Purchase order not found"
    );
  }

  assertTransition(
    purchaseOrder.status,
    POStatus.CANCELLED
  );

  return prisma.purchaseOrder.update({
    where: {
      id,
    },

    data: {
      status: POStatus.CANCELLED,
    },
  });
},

async receive(id: string) {
  return prisma.$transaction(
    async (tx) => {
      const purchaseOrder =
        await tx.purchaseOrder.findUnique({
          where: {
            id,
          },

          include: {
            items: true,
          },
        });

      if (!purchaseOrder) {
        throw new AppError(
          404,
          "Purchase order not found"
        );
      }

      assertTransition(
        purchaseOrder.status,
        POStatus.RECEIVED
      );

      for (const item of purchaseOrder.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },

          data: {
            stockOnHand: {
              increment:
                item.quantity,
            },
          },
        });
      }

      return tx.purchaseOrder.update({
        where: {
          id,
        },

        data: {
          status:
            POStatus.RECEIVED,

          receivedAt:
            new Date(),
        },
      });
    }
  );
}



//



};


