import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const products = await prisma.product.findMany({
    include: {
      stocks: {
        include: {
          warehouse: true,
        },
      },
    },
  });

  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,

    stocks: product.stocks.map((stock) => ({
      warehouse: stock.warehouse.name,

      availableStock:
        stock.totalQuantity -
        stock.reservedQuantity,
    })),
  }));

  return NextResponse.json(formattedProducts);
}