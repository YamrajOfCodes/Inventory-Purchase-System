import { NextResponse } from "next/server";

import { purchaseOrderService } from "@/domain/purchaseOrder/purchase-order.service";
import { AppError } from "@/shared/errors/app-error";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const purchaseOrder =
      await purchaseOrderService.cancel(id);

    return NextResponse.json(
      purchaseOrder
    );
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.statusCode,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}