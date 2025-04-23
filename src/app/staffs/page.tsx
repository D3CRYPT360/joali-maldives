"use client";

import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import { api } from "../api";

type Staff = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  staffRole?: string;
  createdAt?: string;
  isActive: boolean;
  orgId: number;
};

export default function StaffsPage() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orgNames, setOrgNames] = useState<{ [orgId: number]: string }>({});

  // Helper to fetch and cache org name
  const fetchOrgName = async (orgId: number) => {
    if (!orgId || orgNames[orgId]) return;
    try {
      const org = await api.getOrganizationById(orgId);
      setOrgNames((prev) => ({
        ...prev,
        [orgId]: org?.name || `Org ${orgId}`,
      }));
    } catch {
      setOrgNames((prev) => ({ ...prev, [orgId]: `Org ${orgId}` }));
    }
  };

  useEffect(() => {
    async function fetchStaffs() {
      setLoading(true);
      setError("");
      try {
        // Assume API endpoint: /api/User/AllStaffs or filter AllUsers by role (userType === staff)
        const data = await api.getAllUsers();
        // Filter for staff (userType === 1 or staffRole != null)
        const filtered = Array.isArray(data)
          ? data.filter((u: any) => u.userType === 1 || u.staffRole)
          : [];
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
          <h1 className="text-2xl font-bold text-[#8B4513] mb-6">
            Manage Staffs
          </h1>
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
                      <th className="pb-3">Organization</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Created At</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffs.map((staff: Staff, idx: number) => {
                      // Fetch org name if not already cached
                      if (staff.orgId && !orgNames[staff.orgId]) {
                        fetchOrgName(staff.orgId);
                      }
                      return (
                        <tr key={staff.id || idx} className="border-b">
                          <td className="py-4 text-black font-medium">
                            {staff.id}
                          </td>
                          <td className="py-4 text-black font-medium">
                            {orgNames[staff.orgId] || staff.orgId}
                          </td>
                          <td className="py-4 text-black font-medium">
                            {staff.name}
                          </td>
                          <td className="py-4 text-black">{staff.email}</td>
                          <td className="py-4 text-black">
                            {staff.staffRole || "-"}
                          </td>
                          <td className="py-4 text-black">
                            {staff.createdAt
                              ? new Date(staff.createdAt).toLocaleString()
                              : "-"}
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 rounded-[15px] text-white text-xs ${
                                staff.isActive ? "bg-green-600" : "bg-red-400"
                              }`}
                            >
                              {staff.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {/* Toggle Switch */}
                              {!(
                                staff.name &&
                                staff.name.toLowerCase() === "admin"
                              ) && (
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={staff.isActive}
                                    onChange={async () => {
                                      try {
                                        await api.toggleUser(staff.email);
                                        setStaffs((staffs) =>
                                          staffs.map((s) =>
                                            s.id === staff.id
                                              ? { ...s, isActive: !s.isActive }
                                              : s
                                          )
                                        );
                                      } catch (err) {
                                        alert("Failed to toggle staff");
                                      }
                                    }}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600 transition-all"></div>
                                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-full"></div>
                                </label>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
