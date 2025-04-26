"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { api } from "@/services/api";

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
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      const userId = localStorage.getItem("user_id");
      const user_name = localStorage.getItem("user_name");
      if (
        (role === "Customer" || role === "Staff") &&
        userId &&
        user_name !== "Admin"
      ) {
        router.replace(`/home/${userId}`);
      }
    }
  }, [router]);

  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orgNames, setOrgNames] = useState<{ [orgId: number]: string }>({});
  // Search state
  const [search, setSearch] = useState("");

  // Filtered staff list based on search
  const filteredStaffs = staffs.filter((staff) => {
    // Ensure orgId is never null/undefined before toString
    const safeOrgId = staff.orgId ?? "";
    const orgName = orgNames[safeOrgId] || safeOrgId.toString();
    const searchLower = search.toLowerCase();
    return (
      staff.name.toLowerCase().includes(searchLower) ||
      staff.email.toLowerCase().includes(searchLower) ||
      orgName.toLowerCase().includes(searchLower)
    );
  });

  // Modal and form state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    phoneNumber: string;
    orgId: string;
  }>({
    name: "",
    email: "",
    phoneNumber: "",
    orgId: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [orgOptions, setOrgOptions] = useState<{ id: number; name: string }[]>(
    []
  );

  // Fetch organizations for dropdown when modal opens
  useEffect(() => {
    if (showModal) {
      api.getAllOrganizations().then((orgs) => {
        setOrgOptions(
          Array.isArray(orgs)
            ? orgs.map((o: any) => ({ id: o.id, name: o.name }))
            : []
        );
      });
    }
  }, [showModal]);

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

  // Top-level fetchStaffs so it can be called from anywhere
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

  useEffect(() => {
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
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 max-w-xl">
                <input
                  type="text"
                  placeholder="Search staffs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#8B4513] text-black"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#8B4513] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  + New Staff
                </button>
              </div>
            </div>

            {/* New Staff Modal */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full relative">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2 className="text-2xl font-bold mb-4 text-[#8B4513] text-center">
                    Add New Staff
                  </h2>
                  {formError && (
                    <div className="text-red-600 mb-2 text-center">
                      {formError}
                    </div>
                  )}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setFormError("");
                      setFormLoading(true);
                      try {
                        await api.createStaff({
                          name: form.name,
                          email: form.email,
                          phoneNumber: form.phoneNumber,
                          orgId: Number(form.orgId),
                        });
                        setShowModal(false);
                        setForm({
                          name: "",
                          email: "",
                          phoneNumber: "",
                          orgId: "",
                        });
                        fetchStaffs();
                      } catch (err: any) {
                        setFormError(err.message || "Failed to create staff");
                      } finally {
                        setFormLoading(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        className="block mb-1 font-semibold"
                        htmlFor="staff-name"
                      >
                        Name
                      </label>
                      <input
                        id="staff-name"
                        type="text"
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring text-black"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-1 font-semibold"
                        htmlFor="staff-email"
                      >
                        Email
                      </label>
                      <input
                        id="staff-email"
                        type="email"
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring text-black"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-1 font-semibold"
                        htmlFor="staff-phone"
                      >
                        Phone Number
                      </label>
                      <input
                        id="staff-phone"
                        type="tel"
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring text-black"
                        value={form.phoneNumber}
                        onChange={(e) =>
                          setForm({ ...form, phoneNumber: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-1 font-semibold"
                        htmlFor="staff-org"
                      >
                        Organization
                      </label>
                      <select
                        id="staff-org"
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring text-black"
                        value={form.orgId}
                        onChange={(e) =>
                          setForm({ ...form, orgId: e.target.value })
                        }
                        required
                      >
                        <option value="" disabled>
                          Select organization
                        </option>
                        {orgOptions.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#8B4513] text-white py-2 rounded font-semibold hover:bg-[#6a3210] transition"
                      disabled={formLoading}
                    >
                      {formLoading ? "Adding..." : "Add Staff"}
                    </button>
                  </form>
                </div>
              </div>
            )}

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
                    {filteredStaffs.map((staff: Staff, idx: number) => {
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
                          <td
                            className="py-4 text-black"
                            data-raw-date={staff.createdAt ?? ""}
                          >
                            {/* DEBUG: Hydration - server/client date match check */}
                            {staff.createdAt &&
                            !isNaN(Date.parse(staff.createdAt))
                              ? new Date(staff.createdAt)
                                  .toISOString()
                                  .replace("T", " ")
                                  .slice(0, 16)
                              : staff.createdAt
                              ? staff.createdAt
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
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600 transition-all text-black"></div>
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
