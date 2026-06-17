"use client";

import { useEffect, useState } from "react";
import { Plus, X, ChevronDown, Send, XCircle, PackageCheck } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

import { useProducts } from "@/features/products/product.hooks";
import { useSuppliers } from "@/features/suppliers/supplier.hooks";

import {
  usePurchaseOrders,
  useCreatePurchaseOrder,
  usePlacePurchaseOrder,
  useCancelPurchaseOrder,
  useReceivePurchaseOrder,
} from "@/features/purchase-order/purchase-order.hooks";

type Supplier = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
};

type PurchaseOrderItemForm = {
  productId: string;
  quantity: number;
};

type PurchaseOrder = {
  id: string;
  status: string;
  supplier: {
    name: string;
  };
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: "#6B6F761A", text: "#6B6F76", label: "Draft" },
  PLACED: { bg: "#3D5A801A", text: "#3D5A80", label: "Placed" },
  RECEIVED: { bg: "#5B7A6B1A", text: "#5B7A6B", label: "Received" },
  CANCELLED: { bg: "#8B4B4F1A", text: "#8B4B4F", label: "Cancelled" },
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT;

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
}

function PurchaseOrderActions({
  po,
  onPlace,
  onCancel,
  onReceive,
}: {
  po: PurchaseOrder;
  onPlace: (id: string) => void;
  onCancel: (id: string) => void;
  onReceive: (id: string) => void;
}) {
  if (po.status === "DRAFT") {
    return (
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onPlace(po.id)}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#3D5A80] px-3 py-1.5 text-xs font-medium text-[#3D5A80] transition-colors hover:bg-[#3D5A8014]"
        >
          <Send className="h-3.5 w-3.5" strokeWidth={2} />
          Place
        </button>
        <button
          onClick={() => onCancel(po.id)}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#8B4B4F] px-3 py-1.5 text-xs font-medium text-[#8B4B4F] transition-colors hover:bg-[#8B4B4F14]"
        >
          <XCircle className="h-3.5 w-3.5" strokeWidth={2} />
          Cancel
        </button>
      </div>
    );
  }

  if (po.status === "PLACED") {
    return (
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onReceive(po.id)}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#5B7A6B] px-3 py-1.5 text-xs font-medium text-[#5B7A6B] transition-colors hover:bg-[#5B7A6B14]"
        >
          <PackageCheck className="h-3.5 w-3.5" strokeWidth={2} />
          Receive
        </button>
        <button
          onClick={() => onCancel(po.id)}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#8B4B4F] px-3 py-1.5 text-xs font-medium text-[#8B4B4F] transition-colors hover:bg-[#8B4B4F14]"
        >
          <XCircle className="h-3.5 w-3.5" strokeWidth={2} />
          Cancel
        </button>
      </div>
    );
  }

  return <span className="text-[#6B6F76]">—</span>;
}

export default function PurchaseOrdersPage() {

  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState<
    PurchaseOrderItemForm[]
  >([
    {
      productId: "",
      quantity: 1,
    },
  ]);


  const { data: suppliers = [] } =
    useSuppliers();

  const { data: products = [] } =
    useProducts();

  const {
    data: purchaseOrders = [],
    isLoading,
  } = usePurchaseOrders();

  const createMutation =
    useCreatePurchaseOrder();

  const placeMutation =
    usePlacePurchaseOrder();

  const cancelMutation =
    useCancelPurchaseOrder();

  const receiveMutation =
    useReceivePurchaseOrder();


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        productId: "",
        quantity: 1,
      },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  function updateItem(
    index: number,
    field: "productId" | "quantity",
    value: string | number
  ) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            [field]: value,
          }
          : item
      )
    );
  }


  useEffect(() => {
    if (!isModalOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsModalOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const createPO = async () => {
    if (!supplierId) return;

    const validItems = items.filter(
      (item) =>
        item.productId &&
        item.quantity > 0
    );

    if (validItems.length === 0)
      return;

    try {
      setIsSubmitting(true);

      await createMutation.mutateAsync({
        supplierId,
        items: validItems,
      });

      setSupplierId("");

      setItems([
        {
          productId: "",
          quantity: 1,
        },
      ]);

      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }
  async function placePO(id: string) {
    await placeMutation.mutateAsync(id);
  }

  async function cancelPO(id: string) {
    await cancelMutation.mutateAsync(id);
  }

  async function receivePO(id: string) {
    await receiveMutation.mutateAsync(id);
  }
  const columns: DataTableColumn<PurchaseOrder>[] = [
    {
      key: "supplier",
      header: "Supplier",
      render: (po) => <span className="font-medium">{po.supplier?.name ?? "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (po) => <StatusBadge status={po.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (po) => (
        <PurchaseOrderActions po={po} onPlace={placePO} onCancel={cancelPO} onReceive={receivePO} />
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#6B6F76]">
              Procurement
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#15171A] sm:text-4xl">
              Purchase Orders
            </h1>
            <p className="mt-2 text-base text-[#6B6F76]">
              Create, track, and action orders end-to-end.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#1F2A44] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#162033]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            New purchase order
          </button>
        </header>

        <DataTable
          columns={columns}
          data={purchaseOrders}
          rowKey={(po) => po.id}
          isLoading={isLoading}
          emptyTitle="No purchase orders yet"
          emptyDescription="Create your first draft to get started."
        />
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#15171A]/40 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-po-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg border border-[#E8E6E1] bg-white p-6 shadow-lg"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="create-po-title" className="text-base font-medium text-[#15171A]">
                New purchase order
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-[#6B6F76] transition-colors hover:bg-[#FAFAF9] hover:text-[#15171A]"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#6B6F76]">
                  Supplier
                </label>
                <div className="relative">
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full appearance-none rounded-md border border-[#E8E6E1] px-3 py-2 pr-9 text-sm text-[#15171A] outline-none focus:border-[#1F2A44] focus:ring-1 focus:ring-[#1F2A44]"
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((supplier: any) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6F76]" />
                </div>
              </div>

              <div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-[#6B6F76]">
                      Items
                    </label>

                    <button
                      type="button"
                      onClick={addItem}
                      className="text-sm font-medium text-[#1F2A44]"
                    >
                      + Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[2fr_1fr_auto] gap-3"
                      >
                        <div className="relative">
                          <select
                            value={item.productId}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "productId",
                                e.target.value
                              )
                            }
                            className="w-full appearance-none rounded-md border border-[#E8E6E1] px-3 py-2 pr-9 text-sm"
                          >
                            <option value="">
                              Select product
                            </option>

                            {products.map(
                              (product: any) => (
                                <option
                                  key={product.id}
                                  value={product.id}
                                >
                                  {product.name}
                                </option>
                              )
                            )}
                          </select>

                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6F76]" />
                        </div>

                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              Number(
                                e.target.value
                              )
                            )
                          }
                          className="rounded-md border border-[#E8E6E1] px-3 py-2 text-sm"
                        />

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(index)
                            }
                            className="rounded-md border px-3 py-2 text-sm text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-[#6B6F76] transition-colors hover:bg-[#FAFAF9]"
              >
                Cancel
              </button>
              <button
                onClick={createPO}
                disabled={
                  isSubmitting ||
                  !supplierId
                }
                className="inline-flex items-center justify-center rounded-md bg-[#1F2A44] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#162033] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create draft"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}