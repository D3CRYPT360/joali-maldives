"use client";

import Image from "next/image";
import { useState } from "react";
import { FaCalendarAlt, FaUser, FaSearch } from "react-icons/fa";
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
      price: "25",
    },
    {
      image: "/images/go-cart.jpg",
      title: "Go Karting",
      location: "Racing Track",
      price: "35",
    },
    {
      image: "/images/family-slide.jpg",
      title: "Family Slide",
      location: "Family Pool",
      price: "30",
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#F9F9F9]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[#152C5B] text-4xl md:text-5xl font-bold leading-tight mb-6">
              Forget Busy Work,
              <br />
              Start Next Vacation
            </h2>
            <p className="text-[#B0B0B0] mb-8">
              We provide what you need to enjoy your holiday with family.
              <br /> Time to make another memorable moments.
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

      {/* Theme Park Activities */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-[#152C5B] text-2xl font-medium mb-8">
            Theme park Activities
          </h3>
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
