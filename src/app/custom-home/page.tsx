"use client";
import { useEffect, useState } from "react";

export default function CustomHomePage() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("user_name");
      setName(storedName || "User");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3]">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-[#5B2415] mb-4">
          Welcome {name}
        </h1>
        <p className="text-lg text-[#8B4513]">
          You have successfully logged in.
        </p>
      </div>
    </div>
  );
}
