import { NextResponse } from "next/server";
import { purchaseOrderService } from "@/domain/purchaseOrder/purchase-order.service";
import { createPurchaseOrderSchema } from "@/shared/validators/purchase-order.validator";

export async function GET() {
  try {
    const purchaseOrders =
      await purchaseOrderService.getAll();

    return NextResponse.json(purchaseOrders);
  } catch (error) {
    console.error("GET PURCHASE ORDERS ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
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