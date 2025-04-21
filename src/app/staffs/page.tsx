"use client";

import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import { api } from "../api";

export default function StaffsPage() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStaffs() {
      setLoading(true);
      setError("");
      try {
        // Assume API endpoint: /api/User/AllStaffs or filter AllUsers by role (userType === staff)
        const data = await api.getAllUsers();
        // Filter for staff (userType === 1 or staffRole != null)
        const filtered = Array.isArray(data) ? data.filter((u: any) => u.userType === 1 || u.staffRole) : [];
        setStaffs(filtered);
      } catch (err) {
        setError((err as any).message || "Failed to fetch staffs");
      } finally {
        setLoading(false);
      }
    }
    fetchStaffs();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gray-100">
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-[#8B4513] mb-6">Manage Staffs</h1>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            {loading ? (
              <div className="text-center text-gray-500">Loading staffs...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Created At</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffs.map((staff: any, idx: number) => (
                      <tr key={staff.id || idx} className="border-b">
                        <td className="py-4 text-black font-medium">{staff.id}</td>
                        <td className="py-4 text-black font-medium">{staff.name}</td>
                        <td className="py-4 text-black">{staff.email}</td>
                        <td className="py-4 text-black">{staff.staffRole || '-'}</td>
                        <td className="py-4 text-black">{staff.createdAt ? new Date(staff.createdAt).toLocaleString() : '-'}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-[15px] text-white text-xs ${staff.isActive ? 'bg-green-600' : 'bg-gray-400'}`}>
                            {staff.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
