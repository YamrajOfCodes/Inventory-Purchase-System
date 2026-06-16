import { prisma } from "@/lib/prisma";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    include: {
      supplierProducts: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Suppliers</h1>
        <p className="text-gray-500">
          Manage suppliers and their products.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Products</th>
              <th className="p-4 text-left">Created</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="border-b last:border-0"
              >
                <td className="p-4 font-medium">
                  {supplier.name}
                </td>

                <td className="p-4">
                  {supplier.supplierProducts.length}
                </td>

                <td className="p-4">
                  {supplier.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}