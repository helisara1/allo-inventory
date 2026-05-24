"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Stock = {
  warehouse: string;
  availableStock: number;
};

type Product = {
  id: string;
  name: string;
  sku: string;
  stocks: Stock[];
};

export default function ProductCard({
  product,
}: {
  product: Product;
}) {

  const [loading, setLoading] =
    useState(false);
  const router = useRouter();
  async function reserveProduct() {

    try {

      setLoading(true);

      const stock =
        product.stocks[0];

      const warehouseResponse =
        await fetch(
          "http://localhost:3000/api/warehouses"
        );

      const warehouses =
        await warehouseResponse.json();

      const response = await fetch(
        "http://localhost:3000/api/reservations",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            productId: product.id,

            warehouseId:
              warehouses[0].id,

            quantity: 1,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      router.push(`/reservation/${data.id}`);

    } catch {

      alert("Something went wrong");

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition space-y-5 border">

      <div>

        <h2 className="text-xl font-bold">
          {product.name}
        </h2>

        <p className="text-gray-500">
          SKU: {product.sku}
        </p>
      </div>

      <div className="space-y-2">

        {product.stocks.map(
          (stock, index) => (

            <div
              key={index}
              className="flex justify-between"
            >

              <span>
                {stock.warehouse}
              </span>

              <span>
                Available:
                {" "}
                {stock.availableStock}
              </span>

            </div>
          )
        )}
      </div>

      <button
        onClick={reserveProduct}
        disabled={loading}
        className="bg-black hover:bg-gray-800 transition text-white px-4 py-3 rounded-xl w-full font-semibold"
      >

        {loading
          ? "Reserving..."
          : "Reserve"}

      </button>

    </div>
  );
}