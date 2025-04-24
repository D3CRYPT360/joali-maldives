"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../services/api";

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if accessToken exists in localStorage
    setIsLoggedIn(!!api.getAccessToken());
    // Listen to storage changes (for multi-tab logout/login)
    const handleStorage = () => setIsLoggedIn(!!api.getAccessToken());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.logout();
    } catch (err) {
      alert((err as any).message || "Logout failed");
    } finally {
      // Always clear session and update UI
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      localStorage.removeItem("role");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("hotels");
      localStorage.removeItem("Role");

      setIsLoggedIn(false);
      setLoading(false);
      window.location.href = "/"; // Redirect to home
    }
  };

  return (
    <nav className="fixed top-0 w-full h-20 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <a
          href={
            typeof window !== "undefined" && localStorage.getItem("user_id")
              ? `/home/${localStorage.getItem("user_id")}`
              : "/"
          }
        >
          <h1 className="text-[#5B2415] text-2xl font-medium cursor-pointer">
            JoaliStay.
          </h1>
        </a>
        <div className="hidden md:flex gap-8 text-[#5B2415]">
          <a href="/" className="hover:text-opacity-80">
            Home
          </a>
          <a href="/hotels" className="hover:text-opacity-80">
            Hotels
          </a>
          <a href="/about" className="hover:text-opacity-80">
            About
          </a>
          <Link href="/dashboard" className="hover:text-opacity-80">
            Dashboard
          </Link>
          <Link href="/tickets" className="hover:text-opacity-80">
            Tickets
          </Link>
          <Link href="/themepark" className="hover:text-opacity-80">
            Theme Park
          </Link>
        </div>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-[#8B4513] hover:bg-[#152C5B] text-white px-6 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <Link href="/login">
            <button className="bg-[#5B2415] hover:bg-[#152C5B] text-white px-6 py-2 rounded-lg">
              Login/Signup
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
