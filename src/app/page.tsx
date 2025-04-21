'use client';

import Image from "next/image";
import { useState } from "react";
import { FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa';
import ActivityCard from "@/components/ActivityCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const [checkInDate, setCheckInDate] = useState("");
  const [duration, setDuration] = useState("");
  const [persons, setPersons] = useState(2);

  const activities = [
    {
      image: "/images/water-slide.png",
      title: "Water Slide",
      location: "Main Pool Area",
      price: "25"
    },
    {
      image: "/images/go-cart.jpg",
      title: "Go Karting",
      location: "Racing Track",
      price: "35"
    },
    {
      image: "/images/family-slide.jpg",
      title: "Family Slide",
      location: "Family Pool",
      price: "30"
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#F9F9F9]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[#152C5B] text-4xl md:text-5xl font-bold leading-tight mb-6">
              Forget Busy Work,<br />Start Next Vacation
            </h2>
            <p className="text-[#B0B0B0] mb-8">
              We provide what you need to enjoy your holiday with family.<br /> Time to make another memorable moments.
            </p>
            <button className="bg-[#5B2415] text-white px-8 py-3 rounded-lg">
              Show More
            </button>
          </div>
          <div className="relative">
            <div className="bg-[#C4C4C4] w-full h-[400px] rounded-[30px] overflow-hidden">
              <Image
                src="/images/hero.jpg"
                alt="Luxury accommodation"
                fill
                className="object-cover rounded-[30px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="px-4 -mt-8">
        <div className="container mx-auto">
          <div className="bg-[#ECAF9E] rounded-3xl p-8 shadow-lg">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-4 flex items-center gap-4 text-[#152C5B]">
                <FaCalendarAlt className="text-xl text-gray-600" />
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full outline-none"
                  placeholder="Check in"
                />
              </div>
              <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                <FaCalendarAlt className="text-xl text-gray-600" />
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full outline-none text-[#152C5B]"
                >
                  <option value="">Select Duration</option>
                  <option value="3">3 Days</option>
                  <option value="5">5 Days</option>
                  <option value="7">7 Days</option>
                </select>
              </div>
              <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                <FaUser className="text-xl text-gray-600" />
                <select
                  value={persons}
                  onChange={(e) => setPersons(Number(e.target.value))}
                  className="w-full outline-none text-[#152C5B]"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons</option>
                  <option value="3">3 Persons</option>
                  <option value="4">4 Persons</option>
                </select>
              </div>
              <button className="bg-[#5B2415] text-white rounded-xl p-4 flex items-center justify-center gap-2">
                <FaSearch />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Park Activities */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-[#152C5B] text-2xl font-medium mb-8">Theme park Activities</h3>
          <div className="grid md:grid-cols-3 gap-6 text-[#152C5B]">
            {activities.map((activity, index) => (
              <ActivityCard
                key={index}
                image={activity.image}
                title={activity.title}
                location={activity.location}
                price={activity.price}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
