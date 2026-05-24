import ProductCard
from "@/components/ProductCard";

async function getProducts() {

  const response = await fetch(
    "http://localhost:3000/api/products",
    {
      cache: "no-store",
    }
  );

  return response.json();
}

export default async function Home() {

  const products =
    await getProducts();

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