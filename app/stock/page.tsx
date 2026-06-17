"use client";

import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

type Product = {
  id: string;
  name: string;
  stockOnHand: number;
  reorderLevel: number;
};

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadStock() {
    setIsLoading(true);

    const res = await fetch("/api/stock/low");
    const data = await res.json();

    setProducts(data);
    setIsLoading(false);
  }

  useEffect(() => {
    loadStock();
  }, []);

  const columns: DataTableColumn<Product>[] = [
    {
      key: "name",
      header: "Name",
      render: (product) => <span className="font-medium">{product.name}</span>,
    },
    {
      key: "stock",
      header: "Stock on hand",
      align: "right",
      render: (product) => (
        <span className="inline-flex items-center rounded-full bg-[#8B4B4F1A] px-2.5 py-0.5 text-xs font-medium text-[#8B4B4F]">
          {product.stockOnHand}
        </span>
      ),
    },
    {
      key: "reorder",
      header: "Reorder level",
      align: "right",
      render: (product) => product.reorderLevel,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#6B6F76]">
              Inventory
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#15171A] sm:text-4xl">
              Low Stock
            </h1>
            <p className="mt-2 text-base text-[#6B6F76]">
              Products that have reached their reorder level and need restocking.
            </p>
          </div>

          <button
            onClick={loadStock}
            disabled={isLoading}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#E8E6E1] bg-white px-4 py-2 text-sm font-medium text-[#15171A] transition-colors hover:bg-[#FAFAF9] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} strokeWidth={2} />
            Refresh
          </button>
        </header>

        <DataTable
          columns={columns}
          data={products}
          rowKey={(product) => product.id}
          isLoading={isLoading}
          emptyTitle="All stocked up"
          emptyDescription="Every product is currently above its reorder level."
        />
      </div>
    </main>
  );
}