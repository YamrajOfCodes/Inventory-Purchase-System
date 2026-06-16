import { prisma } from "@/lib/prisma";

export default async function PurchaseOrdersPage() {
  const purchaseOrders =
    await prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Purchase Orders
        </h1>

        <p className="text-gray-500">
          Track purchase order lifecycle.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 text-left">PO ID</th>

              <th className="p-4 text-left">
                Supplier
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Items
              </th>

              <th className="p-4 text-left">
                Created
              </th>
            </tr>
          </thead>

          <tbody>
            {purchaseOrders.map((po) => (
              <tr
                key={po.id}
                className="border-b last:border-0"
              >
                <td className="p-4">
                  {po.id.slice(0, 8)}
                </td>

                <td className="p-4">
                  {po.supplier.name}
                </td>

                <td className="p-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {po.status}
                  </span>
                </td>

                <td className="p-4">
                  {po.items.length}
                </td>

                <td className="p-4">
                  {po.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}