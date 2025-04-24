"use client";
import React from "react";
import Image from "next/image";

import { api } from "@/services/api";
import { useEffect, useState } from "react";
import BookingScreen from "./BookingScreen";
import { useRouter } from "next/navigation";

type Room = {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  capacity?: number;
  durationInMinutes?: number;
  serviceType?: { name: string };
};

function HotelTitle({ hotelId }: { hotelId: string }) {
  let hotelName = hotelId;
  if (typeof window !== "undefined") {
    try {
      const hotelsRaw = localStorage.getItem("hotels");
      if (hotelsRaw) {
        const hotels = JSON.parse(hotelsRaw);
        const found = hotels.find((h: any) => String(h.id) === String(hotelId));
        if (found && found.name) hotelName = found.name;
      }
    } catch (e) {}
  }
  return (
    <h1 className="text-4xl font-bold text-center text-[#5B2415] mb-2">
      Rooms for {hotelName}
    </h1>
  );
}

export default function HotelRoomsPage({
  params,
}: {
  params: Promise<{ hotelId: string }>;
}) {
  const { hotelId } = React.use(params);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getAllServices({ orgId: hotelId, typeId: 1 })
      .then((data: any) => {
        setRooms(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(
          err?.message || "Failed to fetch rooms. Please try again later."
        );
        setLoading(false);
      });
  }, [hotelId]);

  if (bookingRoom) {
    return <BookingScreen room={bookingRoom} hotelId={hotelId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <HotelTitle hotelId={hotelId} />
        <p className="text-lg text-center text-[#8B4513] mb-10">
          Choose from a variety of luxury rooms for your perfect stay
        </p>
        {loading ? (
          <div className="text-center text-[#8B4513] text-lg">Loading rooms...</div>
        ) : error ? (
          <div className="text-center text-red-600 text-lg">{error}</div>
        ) : rooms.length === 0 ? (
          <div className="text-center text-[#8B4513] text-lg">No rooms found for this hotel.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={room.imageUrl || "/images/room-placeholder.jpg"}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <h2 className="text-xl font-semibold text-[#5B2415]">
                    {room.name}
                  </h2>
                  <p className="text-sm text-[#8B4513]">{room.serviceType?.name || "Room"}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-[#152C5B]">
                      ${room.price}/night
                    </span>
                    <button
                      className="bg-[#8B4513] hover:bg-[#5B2415] text-white px-4 py-2 rounded-lg text-sm transition"
                      onClick={() => setBookingRoom(room)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
