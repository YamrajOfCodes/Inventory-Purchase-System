import { NextResponse } from "next/server";
import { purchaseOrderService } from "@/domain/purchaseOrder/purchase-order.service";
import { createPurchaseOrderSchema } from "@/shared/validators/purchase-order.validator";

export async function GET() {
  const purchaseOrders =
    await purchaseOrderService.getAll();

  return NextResponse.json(purchaseOrders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData =
      createPurchaseOrderSchema.parse(body);

    const purchaseOrder =
      await purchaseOrderService.createDraft(
        validatedData
      );

    return NextResponse.json(purchaseOrder, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Invalid request data",
      },
      {
        status: 400,
      }
    );
  }
}