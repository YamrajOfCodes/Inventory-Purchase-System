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
import PurchaseModal from "@/components/ui/PurchaseModal";
import Loader from "@/components/ui/Loader";

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

  items: {
    quantity: number;
    totalMinor: number;

    product: {
      name: string;
    };
  }[];
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
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loader,setLoader] = useState(false);

  const filteredOrders =
    statusFilter === "ALL"
      ? purchaseOrders
      : purchaseOrders.filter(
        (po: any) =>
          po.status === statusFilter
      );


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
    setLoader(true);
    console.log("hi")
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
      },{
        onSuccess:()=>{
          setLoader(false)
        },
        onError:()=>{
          setLoader(false);
        }
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
     setLoader(true);
    await placeMutation.mutateAsync(id,{
       onSuccess:()=>{
          setLoader(false)
        },
        onError:()=>{
          setLoader(false);
        }
    });
  }

  async function cancelPO(id: string) {
    setLoader(true)
    await cancelMutation.mutateAsync(id,{
       onSuccess:()=>{
          setLoader(false)
        },
        onError:()=>{
          setLoader(false);
        }
    });
  }

  async function receivePO(id: string) {
    setLoader(true)
    await receiveMutation.mutateAsync(id,{
       onSuccess:()=>{
          setLoader(false)
        },
        onError:()=>{
          setLoader(false);
        }
    });
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
    {
      key: "items",
      header: "Items",

      render: (po) => (
        <div className="space-y-1">
          {po.items?.map((item, index) => (
            <div key={index}>
              {item.product.name} × {item.quantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      align: "right",

      render: (po) => {
        const total =
          po.items?.reduce(
            (sum, item) =>
              sum + item.totalMinor,
            0
          ) ?? 0;

        return (
          <span className="font-medium">
            ₹{(total / 100).toFixed(2)}
          </span>
        );
      },
    },
  ];

  if(loader){
    return (
      <Loader/>
    )
  }

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


        <div className="space-x-5 space-y-5">
            <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-md border px-3 py-2"
          >
            <option value="ALL">All</option>
            <option value="DRAFT">Draft</option>
            <option value="PLACED">Placed</option>
            <option value="RECEIVED">
              Received
            </option>
            <option value="CANCELLED">
              Cancelled
            </option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#1F2A44] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#162033]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            New purchase order
          </button>
        </div>
        </header>

        <DataTable
          columns={columns}
          data={filteredOrders}
          rowKey={(po) => po.id}
          isLoading={isLoading}
          emptyTitle="No purchase orders yet"
          emptyDescription="Create your first draft to get started."
        />
      </div>

      {isModalOpen && (
       <PurchaseModal
       addItem={addItem}
       items={items}
       products={products}
       removeItem={removeItem}
       setIsModalOpen={setIsModalOpen}
       supplierId={supplierId}
       suppliers={suppliers}
       updateItem={updateItem}
       isSubmitting={isSubmitting}
      setSupplierId={setSupplierId}
      createPO={createPO}
       />
      )}
    </main>
  );
}