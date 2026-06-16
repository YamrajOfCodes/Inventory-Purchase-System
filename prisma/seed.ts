import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Suppliers
  const techSupplier = await prisma.supplier.create({
    data: {
      name: "Tech Supplier",
    },
  });

  const officeSupplier = await prisma.supplier.create({
    data: {
      name: "Office Supplier",
    },
  });

  // Products
  const mouse = await prisma.product.create({
    data: {
      name: "Mouse",
      sku: "MOUSE-001",
      stockOnHand: 5,
      reorderLevel: 10,
    },
  });

  const keyboard = await prisma.product.create({
    data: {
      name: "Keyboard",
      sku: "KEYBOARD-001",
      stockOnHand: 20,
      reorderLevel: 10,
    },
  });

  const monitor = await prisma.product.create({
    data: {
      name: "Monitor",
      sku: "MONITOR-001",
      stockOnHand: 2,
      reorderLevel: 5,
    },
  });

  // Supplier Product Prices
  await prisma.supplierProduct.createMany({
    data: [
      {
        supplierId: techSupplier.id,
        productId: mouse.id,
        currentPriceMinor: 50000, // ₹500.00
      },
      {
        supplierId: techSupplier.id,
        productId: keyboard.id,
        currentPriceMinor: 120000, // ₹1200.00
      },
      {
        supplierId: officeSupplier.id,
        productId: monitor.id,
        currentPriceMinor: 1000000, // ₹10000.00
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });