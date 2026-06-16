import { NextResponse } from "next/server";
import { productService } from "@/domain/product/product.service";
import { createProductSchema } from "@/shared/validators/product.schema";

export async function GET() {
  const products = await productService.getAll();

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = createProductSchema.parse(body);

    const product = await productService.create(validatedData);

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
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