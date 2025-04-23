"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function UserHomePage() {
  const { id } = useParams();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    // Optionally, you could re-decode the JWT here if you want to verify the id matches
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("user_name");
      setName(storedName || "User");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3]">
      <Navbar />
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-[#5B2415] mb-4">
          Welcome {name}
        </h1>
        <p className="text-lg text-[#8B4513]">
          This is your personalized home page. Your user ID is{" "}
          <span className="font-mono font-bold">{id}</span>.
        </p>
      </div>
    </div>
  );
}
