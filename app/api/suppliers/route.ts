import { NextResponse } from "next/server";
import { createSupplierSchema } from "@/shared/validators/supplier.validator";
import { supplierService } from "@/domain/supplier/supplier.service";

export async function GET() {
  const suppliers = await supplierService.getAll();

  return NextResponse.json(suppliers);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = createSupplierSchema.parse(body);

    const supplier = await supplierService.create(
      validatedData
    );

    return NextResponse.json(supplier, {
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