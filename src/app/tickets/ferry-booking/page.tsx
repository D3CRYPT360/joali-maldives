"use client";
import React, { useState } from "react";
import withBookingCheck from "@/components/withBookingCheck";

function FerryBookingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    passengers: 1,
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // Here you would handle the booking logic (API call, etc.)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3]">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-2 text-green-700">
            Booking Confirmed!
          </h2>
          <p className="mb-4">
            Thank you, {form.name}. Your ferry ticket has been booked for{" "}
            {form.date}.
          </p>
          <a href="/tickets" className="text-orange-400 hover:underline">
            Back to Tickets
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">
          Ferry Ticket Booking
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="number"
            name="passengers"
            min="1"
            max="10"
            value={form.passengers}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            className="bg-orange-400 text-white font-semibold py-2 px-6 rounded-lg mt-2 hover:bg-orange-500 transition-colors"
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default withBookingCheck(FerryBookingPage);
