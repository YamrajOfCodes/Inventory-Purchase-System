"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import {
  useProducts,
  useCreateProduct,
} from "@/features/products/product.hooks";
import Loader from "@/components/ui/Loader";


type Product = {
  id: string;
  name: string;
  sku: string;
  stockOnHand: number;
  reorderLevel: number;
};

export default function ProductsPage() {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [reorderLevel, setReorderLevel] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loader,setLoader] = useState(false);

  const {
    data: products = [],
    isLoading,
  } = useProducts();

  const createMutation = useCreateProduct();



  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(
    (product: any) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.sku
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  async function createProduct() {
    if (!name.trim() || !sku.trim()) return;
    setLoader(true);

    try {
      setIsSubmitting(true);

      await createMutation.mutateAsync({
        name,
        sku,
        reorderLevel,
      },{
         onSuccess:()=>{
          setLoader(false)
        },
        onError:()=>{
          setLoader(false);
        }
      });

      setName("");
      setSku("");
      setReorderLevel(1);
    } finally {
      setIsSubmitting(false);
    }
  }

  const columns: DataTableColumn<Product>[] = [
    {
      key: "name",
      header: "Name",
      render: (product) => <span className="font-medium">{product.name}</span>,
    },
    {
      key: "sku",
      header: "SKU",
      render: (product) => <span className="text-[#6B6F76]">{product.sku}</span>,
    },
    {
      key: "stock",
      header: "Stock",
      align: "right",
      render: (product) => product.stockOnHand,
    },
    {
      key: "reorder",
      header: "Reorder level",
      align: "right",
      render: (product) =>
        product.stockOnHand <= product.reorderLevel ? (
          <span className="inline-flex items-center rounded-full bg-[#8B4B4F1A] px-2 py-0.5 text-xs font-medium text-[#8B4B4F]">
            {product.reorderLevel}
          </span>
        ) : (
          product.reorderLevel
    ),
  },
  ];

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <header className="mb-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#6B6F76]">
            Catalog
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#15171A] sm:text-4xl">
            Products
          </h1>
          <p className="mt-2 text-base text-[#6B6F76]">
            Manage your catalog, pricing, and reorder thresholds.
          </p>

          
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="mb-4 w-full rounded-md border px-3 py-2 mt-5"
          />
        </header>

        <div className="mb-8 rounded-lg border border-[#E8E6E1] bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-[#15171A]">Add a product</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#6B6F76]">
                Name
              </label>
              <input
                placeholder="e.g. Steel hinge 60mm"
                className="w-full rounded-md border border-[#E8E6E1] px-3 py-2 text-sm text-[#15171A] outline-none focus:border-[#1F2A44] focus:ring-1 focus:ring-[#1F2A44]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#6B6F76]">
                SKU
              </label>
              <input
                placeholder="HNG-060"
                className="w-full rounded-md border border-[#E8E6E1] px-3 py-2 text-sm text-[#15171A] outline-none focus:border-[#1F2A44] focus:ring-1 focus:ring-[#1F2A44]"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#6B6F76]">
                Reorder level
              </label>
              <input
                type="number"
                min={0}
                className="w-full rounded-md border border-[#E8E6E1] px-3 py-2 text-sm text-[#15171A] outline-none focus:border-[#1F2A44] focus:ring-1 focus:ring-[#1F2A44]"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(Number(e.target.value))}
              />
            </div>

            <button
              onClick={createProduct}
              disabled={isSubmitting}
              className="inline-flex h-[38px] items-center justify-center gap-1.5 rounded-md bg-[#1F2A44] px-4 text-sm font-medium text-white transition-colors hover:bg-[#162033] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredProducts}
          rowKey={(product) => product.id}
          isLoading={isLoading}
          emptyTitle="No products yet"
          emptyDescription="Add your first product using the form above."
        />
      </div>
    </main>
  );
}