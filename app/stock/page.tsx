"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

type Supplier = {
  id: string;
  name: string;
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadSuppliers() {
    setIsLoading(true);
    const res = await fetch("/api/suppliers");
    const data = await res.json();
    setSuppliers(data);
    setIsLoading(false);
  }

  async function createSupplier() {
    if (!name.trim()) return;

    setIsSubmitting(true);

    await fetch("/api/suppliers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    setName("");
    setIsSubmitting(false);

    loadSuppliers();
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  const columns: DataTableColumn<Supplier>[] = [
    {
      key: "name",
      header: "Name",
      render: (supplier) => <span className="font-medium">{supplier.name}</span>,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <header className="mb-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#6B6F76]">
            Procurement
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#15171A] sm:text-4xl">
            Suppliers
          </h1>
          <p className="mt-2 text-base text-[#6B6F76]">
            Keep vendor details and contacts up to date.
          </p>
        </header>

        <div className="mb-8 rounded-lg border border-[#E8E6E1] bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-[#15171A]">Add a supplier</h2>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-[#6B6F76]">
                Name
              </label>
              <input
                placeholder="e.g. Acme Hardware Co."
                className="w-full rounded-md border border-[#E8E6E1] px-3 py-2 text-sm text-[#15171A] outline-none focus:border-[#1F2A44] focus:ring-1 focus:ring-[#1F2A44]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createSupplier();
                }}
              />
            </div>

            <button
              onClick={createSupplier}
              disabled={isSubmitting || !name.trim()}
              className="inline-flex h-[38px] items-center justify-center gap-1.5 rounded-md bg-[#1F2A44] px-4 text-sm font-medium text-white transition-colors hover:bg-[#162033] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={suppliers}
          rowKey={(supplier) => supplier.id}
          isLoading={isLoading}
          emptyTitle="No suppliers yet"
          emptyDescription="Add your first supplier using the form above."
        />
      </div>
    </main>
  );
}