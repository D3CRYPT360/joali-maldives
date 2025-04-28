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

  // Separate bookings by type
  const roomBookings = orders.filter(
    (order) => order.service?.serviceTypeId === 1
  );
  const themeParkBookings = orders.filter(
    (order) => order.service?.serviceTypeId === 2
  );
  const ferryBookings = orders.filter(
    (order) => order.service?.serviceTypeId === 3
  );
  const beachEventBookings = orders.filter(
    (order) => order.service?.serviceTypeId === 4
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3] py-8">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#5B2415] mb-6">Welcome, {name}!</h1>
        <div className="w-full max-w-5xl mx-auto">
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
                    <div key={order.id} className="bg-white rounded-xl shadow p-4 flex gap-4 min-w-[350px]">
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
                <div className="flex flex-row gap-6 mb-10 overflow-x-auto scrollbar-thin scrollbar-thumb-[#d9a066] scrollbar-track-[#f8f3f1]">
                  {themeParkBookings.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow p-4 flex gap-4 min-w-[350px]">
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
            {/* Ferry Tickets Section */}
            {ferryBookings.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold text-[#8B4513] mb-4">Ferry Tickets</h2>
                <div className="flex flex-row gap-6 mb-10 overflow-x-auto scrollbar-thin scrollbar-thumb-[#d9a066] scrollbar-track-[#f8f3f1]">
                  {ferryBookings.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow p-4 flex gap-4 min-w-[350px]">
                      <div className="relative w-32 h-24 flex-shrink-0">
                        <img
                          src={order.service?.imageUrl || "/images/ferry-placeholder.jpg"}
                          alt={order.service?.name || "Ferry Service"}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="text-lg font-bold text-[#5B2415] mb-1">{order.service?.name || "Ferry Service"}</h3>
                          <p className="text-sm text-[#8B4513] mb-1">{order.service?.organization?.name || ""}</p>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          <div>Booking ID: {order.id}</div>
                          <div>{order.quantity} Passenger(s)</div>
                          <div>Travel Date: {order.scheduledFor ? new Date(order.scheduledFor).toLocaleDateString() : "-"}</div>
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

            {/* Beach Events Section */}
            {beachEventBookings.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold text-[#8B4513] mb-4">Beach Events</h2>
                <div className="flex flex-row gap-6 mb-10 overflow-x-auto scrollbar-thin scrollbar-thumb-[#d9a066] scrollbar-track-[#f8f3f1]">
                  {beachEventBookings.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow p-4 flex gap-4 min-w-[350px]">
                      <div className="relative w-32 h-24 flex-shrink-0">
                        <img
                          src={order.service?.imageUrl || "/images/beach-event-placeholder.jpg"}
                          alt={order.service?.name || "Beach Event"}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="text-lg font-bold text-[#5B2415] mb-1">{order.service?.name || "Beach Event"}</h3>
                          <p className="text-sm text-[#8B4513] mb-1">{order.service?.description}</p>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          <div>Booking ID: {order.id}</div>
                          <div>{order.quantity} Participant(s)</div>
                          <div>Event Date: {order.scheduledFor ? new Date(order.scheduledFor).toLocaleDateString() : "-"}</div>
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

            {roomBookings.length === 0 && themeParkBookings.length === 0 && ferryBookings.length === 0 && beachEventBookings.length === 0 && (
              <div className="text-center text-[#8B4513] p-8 bg-white rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
                <p>You haven't made any bookings yet. Explore our services to get started!</p>
                <div className="flex justify-center gap-4 mt-6">
                  <a href="/hotels" className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#5B2415] transition">
                    Book a Room
                  </a>
                  <a href="/tickets" className="px-4 py-2 bg-[#d9a066] text-white rounded-lg hover:bg-[#b97c2a] transition">
                    Explore Activities
                  </a>
                </div>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
}
