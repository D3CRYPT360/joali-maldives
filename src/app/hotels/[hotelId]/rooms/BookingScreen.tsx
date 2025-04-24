"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/services/api";
import Image from "next/image";

export default function BookingScreen({
  room,
  hotelId
}: {
  room: any;
  hotelId: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [scheduledFor, setScheduledFor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleBook = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.placeServiceOrder({
        serviceId: room.id,
        quantity,
        scheduledFor: scheduledFor || new Date().toISOString()
      });
      // Redirect to payment page (you may want to pass order ID in real use)
      router.push(`/payment?roomId=${room.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to place booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 mt-10">
      <div className="relative h-56 w-full mb-4">
        <Image
          src={room.imageUrl || "/images/room-placeholder.jpg"}
          alt={room.name}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <h2 className="text-2xl font-bold text-[#5B2415] mb-2">{room.name}</h2>
      <p className="text-[#8B4513] mb-2">{room.description}</p>
      <div className="mb-4">
        <span className="font-semibold">Price:</span> ${room.price} / night
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          className="w-20 px-2 py-1 border rounded text-black"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Scheduled For</label>
        <input
          type="datetime-local"
          value={scheduledFor}
          onChange={e => setScheduledFor(e.target.value)}
          className="w-full px-2 py-1 border rounded text-black"
        />
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        onClick={handleBook}
        className="bg-[#8B4513] hover:bg-[#5B2415] text-white px-6 py-2 rounded-lg w-full font-semibold transition"
        disabled={loading}
      >
        {loading ? "Booking..." : "Book Room"}
      </button>
    </div>
  );
}
