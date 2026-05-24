"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReservationPage() {

  const params = useParams();

  const id = params.id as string;

  const [timeLeft, setTimeLeft] =
    useState(600);

  useEffect(() => {

    const interval = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {

          clearInterval(interval);

          return 0;
        }

        return prev - 1;
      });

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  async function confirmReservation() {

    const response = await fetch(
      `/api/reservations/${id}/confirm`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert("Reservation confirmed!");
    window.location.href = "/";
  }

  async function releaseReservation() {

    const response = await fetch(
      `/api/reservations/${id}/release`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert("Reservation released!");
    window.location.href = "/";
  }

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  return (

    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">

      <div className="border rounded-2xl p-10 w-[400px] space-y-6 shadow-lg">

        <h1 className="text-3xl font-bold">
          Reservation
        </h1>

        <div className="text-xl">

          Expires in:

          {" "}

          <span className="font-bold text-red-500">

            {minutes}:
            {seconds.toString().padStart(2, "0")}

          </span>
        </div>

        <button
          onClick={confirmReservation}
          className="bg-green-600 text-white w-full py-3 rounded-lg"
        >
          Confirm Reservation
        </button>

        <button
          onClick={releaseReservation}
          className="bg-red-600 text-white w-full py-3 rounded-lg"
        >
          Release Reservation
        </button>

      </div>

    </main>
  );
}