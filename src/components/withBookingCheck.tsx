"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Message component to show when no booking is found
const NoBookingMessage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3]">
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
      <svg
        className="w-16 h-16 text-orange-400 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Booking Required
      </h1>
      <p className="text-gray-700 mb-6">
        A valid hotel booking is required to purchase ferry tickets.
      </p>
      <a
        href="/hotels"
        className="inline-block bg-orange-400 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-500 transition-colors ml-4"
      >
        Book a Hotel Now
      </a>
      <p className="text-gray-700 mt-4 text-sm">
        <a
          href="/tickets"
          className="text-gray-700 hover:underline"
          style={{ paddingLeft: "20px" }}
        >
          Back to Tickets Page
        </a>
      </p>
    </div>
  </div>
);

// Loading component to show while checking booking status
const BookingCheckLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3]">
    <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400 mx-auto mb-4"></div>
      <p className="text-gray-600">Checking booking status...</p>
    </div>
  </div>
);

/**
 * Higher-order component (HOC) for checking if user has a valid booking
 * @param Component The component to wrap with booking check
 * @returns A new component with booking check logic
 */
export default function withBookingCheck<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const [hasBooking, setHasBooking] = useState<boolean | null>(null);

    useEffect(() => {
      // Reset booking state
      setHasBooking(null);

      // Check if user has a booking
      if (typeof window !== "undefined") {
        // Small delay to ensure smooth UI transition
        const timer = setTimeout(() => {
          const bookingStatus = localStorage.getItem("hasBooking");
          setHasBooking(bookingStatus === "True");
        }, 300);

        return () => clearTimeout(timer);
      }
    }, [router]);

    // Show loading state while checking booking status
    if (hasBooking === null) {
      return <BookingCheckLoader />;
    }

    // Show message if no booking is found
    if (hasBooking === false) {
      return <NoBookingMessage />;
    }

    // Render the wrapped component with all its props when booking is found
    return <Component {...props} />;
  };
}
