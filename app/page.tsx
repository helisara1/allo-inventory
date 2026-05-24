import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function Home() {

  const products =
    await prisma.product.findMany({
      include: {
        stocks: {
          include: {
            warehouse: true,
          },
        },
      },
    });

  return (

    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-10 text-center">

          Inventory Reservation System

        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {products.map(
            (product: any) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            )
          )}

        </div>

      </div>

    </main>
  );
}