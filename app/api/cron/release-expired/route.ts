import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {

  const expiredReservations =
    await prisma.reservation.findMany({
      where: {
        status: "PENDING",

        expiresAt: {
          lt: new Date(),
        },
      },
    });

  for (const reservation of expiredReservations) {

    await prisma.$transaction(async (tx) => {

      const stock =
        await tx.stock.findFirst({
          where: {
            productId:
              reservation.productId,

            warehouseId:
              reservation.warehouseId,
          },
        });

      if (stock) {

        await tx.stock.update({
          where: {
            id: stock.id,
          },

          data: {
            reservedQuantity: {
              decrement:
                reservation.quantity,
            },
          },
        });
      }

      await tx.reservation.update({
        where: {
          id: reservation.id,
        },

        data: {
          status: "EXPIRED",
        },
      });
    });
  }

  return NextResponse.json({
    released:
      expiredReservations.length,
  });
}