import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    const reservation =
      await prisma.reservation.findUnique({
        where: { id },
      });

    if (!reservation) {

      return NextResponse.json(
        {
          error: "Reservation not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      reservation.status !== "PENDING"
    ) {

      return NextResponse.json(
        {
          error:
            "Reservation already processed",
        },
        {
          status: 400,
        }
      );
    }

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
        where: { id },

        data: {
          status: "RELEASED",
        },
      });
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

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