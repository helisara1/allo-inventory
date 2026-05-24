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

    const stock =
      await prisma.stock.findFirst({
        where: {
          productId,
          warehouseId,
        },
      });

    if (!stock) {

      return NextResponse.json(
        {
          error: "Stock not found",
        },
        {
          status: 404,
        }
      );
    }

    const availableStock =
      stock.totalQuantity -
      stock.reservedQuantity;

    if (availableStock < quantity) {

      return NextResponse.json(
        {
          error: "Not enough stock",
        },
        {
          status: 409,
        }
      );
    }

    await prisma.stock.update({
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
      await prisma.reservation.create({
        data: {
          productId,
          warehouseId,
          quantity,

          expiresAt: new Date(
            Date.now() + 10 * 60 * 1000
          ),
        },
      });

    return NextResponse.json({
      id: reservation.id,
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