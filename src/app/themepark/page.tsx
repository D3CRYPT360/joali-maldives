"use client";
import React from "react";

const activities = [
  {
    image: "/images/themepark1.jpg",
    title: "Roller Coaster Adventure",
    location: "Adventure Zone",
    price: 50,
  },
  {
    image: "/images/themepark2.jpg",
    title: "Water Slide Splash",
    location: "Aqua World",
    price: 40,
  },
  {
    image: "/images/themepark3.jpg",
    title: "Ferris Wheel Fun",
    location: "Sky Plaza",
    price: 30,
  },
  {
    image: "/images/themepark4.jpg",
    title: "Haunted House",
    location: "Mystery Mansion",
    price: 35,
  },
  {
    image: "/images/themepark5.jpg",
    title: "Bumper Cars",
    location: "Fun Arena",
    price: 25,
  },
  {
    image: "/images/themepark6.jpg",
    title: "Mini Golf",
    location: "Green Fields",
    price: 20,
  },
];

import ActivityCard from "@/components/ActivityCard";

export default function ThemeParkActivitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#5B2415] mb-2">Theme Park Activities</h1>
        <p className="text-lg text-center text-[#8B4513] mb-10">Discover and book your favorite theme park adventures</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {activities.map((activity, idx) => (
            <ActivityCard
              key={idx}
              image={activity.image}
              title={activity.title}
              location={activity.location}
              price={activity.price?.toString()}
              buttonLabel="Book Activity"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
