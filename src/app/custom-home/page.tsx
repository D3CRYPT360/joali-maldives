"use client";
import { useEffect, useState } from "react";

import { api } from "@/services/api";

export default function CustomHomePage() {
  const [name, setName] = useState<string>("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("user_name");
      setName(storedName || "User");
    }
    setLoading(true);
    setError(null);
    api.getMyServiceOrders()
      .then((data: any[]) => {
        console.log("DEBUG: getMyServiceOrders() response", data);
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("DEBUG: getMyServiceOrders() error", err);
        setError(err?.message || "Failed to fetch your bookings.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3] py-8">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center mb-8">
      </div>
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-[#8B4513] mb-4">Your Booked Rooms</h2>
        {loading ? (
          <div className="text-center text-[#8B4513]">Loading your bookings...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-[#8B4513]">You have not booked any rooms yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow p-4 flex gap-4">
                <div className="relative w-32 h-24 flex-shrink-0">
                  <img
                    src={order.service?.imageUrl || "/images/room-placeholder.jpg"}
                    alt={order.service?.name || "Room"}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-[#5B2415] mb-1">{order.service?.name || "Room"}</h3>
                    <p className="text-sm text-[#8B4513] mb-1">{order.service?.description}</p>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    <div>Booking #: {order.id}</div>
                    <div>Quantity: {order.quantity}</div>
                    <div>Scheduled For: {order.scheduledFor ? new Date(order.scheduledFor).toLocaleString() : "-"}</div>
                    <div>Status: {['Pending','Confirmed','Cancelled','Completed'][order.status] || 'Unknown'}</div>
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
