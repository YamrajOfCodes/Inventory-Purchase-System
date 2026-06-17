import { NextResponse } from "next/server";

import { productService } from "@/domain/product/product.service";

export async function GET() {
  const products =
    await productService.getLowStockProducts();

  return NextResponse.json(products);
}