'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '../app/api';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if accessToken exists in localStorage
    setIsLoggedIn(!!api.getAccessToken());
    // Listen to storage changes (for multi-tab logout/login)
    const handleStorage = () => setIsLoggedIn(!!api.getAccessToken());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.logout();
      setIsLoggedIn(false);
      window.location.href = "/";
    } catch (err) {
      alert((err as any).message || 'Logout failed');
      setLoading(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full h-20 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href='/'>
          <h1 className="text-[#5B2415] text-2xl font-medium">JoaliStay.</h1>
        </Link>
        <div className="hidden md:flex gap-8 text-[#5B2415]">
          <a href="/" className="hover:text-opacity-80">Home</a>
          <a href="/hotels" className="hover:text-opacity-80">Hotels</a>
          <a href="#" className="hover:text-opacity-80">About</a>
          <a href="#" className="hover:text-opacity-80">Contact</a>
          <Link href="/dashboard" className="hover:text-opacity-80">Dashboard</Link>
          <Link href="/tickets" className="hover:text-opacity-80">Tickets</Link>
          <Link href="/themepark" className="hover:text-opacity-80">Theme Park</Link>
        </div>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-[#8B4513] hover:bg-[#152C5B] text-white px-6 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        ) : (
          <Link href="/login">
            <button className="bg-[#5B2415] hover:bg-[#152C5B] text-white px-6 py-2 rounded-lg">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
