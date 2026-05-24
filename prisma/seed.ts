import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: "Warehouse A",
      location: "Hyderabad",
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: "Warehouse B",
      location: "Bangalore",
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: "iPhone 15",
      sku: "IPHONE15",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Samsung S24",
      sku: "S24",
    },
  });

  await prisma.stock.createMany({
    data: [
      {
        productId: product1.id,
        warehouseId: warehouse1.id,
        totalQuantity: 5,
      },
      {
        productId: product1.id,
        warehouseId: warehouse2.id,
        totalQuantity: 2,
      },
      {
        productId: product2.id,
        warehouseId: warehouse1.id,
        totalQuantity: 3,
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });