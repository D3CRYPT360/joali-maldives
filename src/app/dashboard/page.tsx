"use client";

import SideBar from "@/components/SideBar";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('user_id');
      if (role === 'Customer' && userId) {
        router.replace(`/home/${userId}`);
      }
    }
  }, [router]);

  // Optionally show a loader or nothing while redirecting
  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      <SideBar />
    </div>
  );
}
