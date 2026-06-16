import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products =
    await prisma.product.findMany();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Products
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 text-left">
              Name
            </th>

            <th className="p-3 text-left">
              SKU
            </th>

            <th className="p-3 text-left">
              Stock
            </th>

            <th className="p-3 text-left">
              Reorder Level
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t"
            >
              <td className="p-3">
                {product.name}
              </td>

              <td className="p-3">
                {product.sku}
              </td>

              <td className="p-3">
                {product.stockOnHand}
              </td>

              <td className="p-3">
                {product.reorderLevel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}