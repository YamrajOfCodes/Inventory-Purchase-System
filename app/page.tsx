import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/ui/stat-card";

export default async function DashboardPage() {
  const [
    products,
    suppliers,
    purchaseOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.supplier.count(),
    prisma.purchaseOrder.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Products"
          value={products}
        />

        <StatCard
          title="Suppliers"
          value={suppliers}
        />

        <StatCard
          title="Purchase Orders"
          value={purchaseOrders}
        />
      </div>
    </div>
  );
}