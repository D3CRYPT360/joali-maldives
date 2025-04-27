"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

import { orderService } from "@/services/index";

export default function UserHomePage() {
  const { id } = useParams();
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
    orderService.getMyServiceOrders()
      .then((data: any[]) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err?.message || "Failed to fetch your bookings.");
        setLoading(false);
      });
  }, []);

  // Separate room and theme park bookings
  const roomBookings = orders.filter(
    (order) => order.service?.serviceTypeId === 1
  );
  const themeParkBookings = orders.filter(
    (order) => order.service?.serviceTypeId === 2
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3] py-8">
      <Navbar />
      <div className="w-full max-w-3xl">
        {/* Room Bookings Section */}
        {loading ? (
          <div className="text-center text-[#8B4513]">Loading your bookings...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <>
            {roomBookings.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold text-[#8B4513] mb-4">Your Booked Rooms</h2>
                <div className="flex flex-row gap-6 mb-10 overflow-x-auto scrollbar-thin scrollbar-thumb-[#d9a066] scrollbar-track-[#f8f3f1]">
                  {roomBookings.map((order) => (
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
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          <div>Booking ID: {order.id}</div>
                          <div>{order.quantity} Nights</div>
                          <div>Booked For: {order.scheduledFor ? new Date(order.scheduledFor).toLocaleString() : "-"}</div>
                          <div>Status: {['Pending Payment','Paid','Cancelled','Completed'][order.status] || 'Unknown'}</div>
                          {order.status === 0 && (
                            <button
                              className="mt-2 px-4 py-2 bg-gradient-to-r from-[#8B4513] to-[#d9a066] text-white rounded-lg font-semibold shadow hover:from-[#5B2415] hover:to-[#b97c2a] transition"
                              onClick={() => {
                                window.location.href = `/payment?bookingId=${order.id}`;
                              }}
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* Theme Park Tickets Section */}
            {themeParkBookings.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold text-[#8B4513] mb-4">Theme Park Tickets</h2>
                <div className="flex flex-row gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-[#d9a066] scrollbar-track-[#f8f3f1]">
                  {themeParkBookings.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow p-4 flex gap-4">
                      <div className="relative w-32 h-24 flex-shrink-0">
                        <img
                          src={order.service?.imageUrl || "/images/themepark-placeholder.jpg"}
                          alt={order.service?.name || "Theme Park Activity"}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="text-lg font-bold text-[#5B2415] mb-1">{order.service?.name || "Theme Park Activity"}</h3>
                          <p className="text-sm text-[#8B4513] mb-1">{order.service?.description}</p>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          <div>Booking ID: {order.id}</div>
                          <div>{order.quantity} Ticket(s)</div>
                          <div>Booked For: {order.scheduledFor ? new Date(order.scheduledFor).toLocaleString() : "-"}</div>
                          <div>Status: {['Pending Payment','Paid','Cancelled','Completed'][order.status] || 'Unknown'}</div>
                          {order.status === 0 && (
                            <button
                              className="mt-2 px-4 py-2 bg-gradient-to-r from-[#8B4513] to-[#d9a066] text-white rounded-lg font-semibold shadow hover:from-[#5B2415] hover:to-[#b97c2a] transition"
                              onClick={() => {
                                window.location.href = `/payment?bookingId=${order.id}`;
                              }}
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {roomBookings.length === 0 && themeParkBookings.length === 0 && (
              <div className="text-center text-[#8B4513]">You have not booked any rooms or theme park tickets yet.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
