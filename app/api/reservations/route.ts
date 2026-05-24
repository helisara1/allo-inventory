import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reservationSchema = z.object({
  productId: z.string(),
  warehouseId: z.string(),
  quantity: z.number().min(1),
});

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const {
      productId,
      warehouseId,
      quantity,
    } = reservationSchema.parse(body);

    const result =
      await prisma.$transaction(async (tx) => {

        const stockRows =
          await tx.$queryRawUnsafe<any[]>(`
            SELECT *
            FROM "Stock"
            WHERE "productId" = '${productId}'
            AND "warehouseId" = '${warehouseId}'
            FOR UPDATE
          `);

        const stock = stockRows[0];

        if (!stock) {
          throw new Error("STOCK_NOT_FOUND");
        }

        const availableStock =
          stock.totalQuantity -
          stock.reservedQuantity;

        if (availableStock < quantity) {
          throw new Error("OUT_OF_STOCK");
        }

        await tx.stock.update({
          where: {
            id: stock.id,
          },
          data: {
            reservedQuantity: {
              increment: quantity,
            },
          },
        });

        const reservation =
          await tx.reservation.create({
            data: {
              productId,
              warehouseId,
              quantity,

              expiresAt: new Date(
                Date.now() + 10 * 60 * 1000
              ),
            },
          });

        return reservation;
      });

    return NextResponse.json(result);

  } catch (error: any) {

    if (error.message === "OUT_OF_STOCK") {

      return NextResponse.json(
        {
          error: "Not enough stock",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}