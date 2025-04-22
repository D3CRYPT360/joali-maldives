'use client';

import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import CreateOrganizationModal from "@/components/CreateOrganizationModal";
import { api } from "../api";

const orgTypes = [
  { value: 0, label: "Other" },
  { value: 1, label: "Hotel" },
  { value: 2, label: "Restaurante" },
  { value: 3, label: "Ferry" },
  { value: 4, label: "Park" },
  { value: 5, label: "Events" },
];

type Organization = {
  id: number;
  name: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  website?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  parentOrganizationId?: number | null;
  parentOrganization?: any | null;
  type: number;
};

const Organizations = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const initialFormState = {
    name: "",
    registrationNumber: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    website: "",
    logoUrl: "",
    type: 0,
  };
  const [form, setForm] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    async function fetchOrgs() {
      setLoading(true);
      setError("");
      try {
        const data = await api.getAllOrganizations();
        setOrgs(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch organizations");
      } finally {
        setLoading(false);
      }
    }
    fetchOrgs();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "type" ? Number(value) : value }));
  };

  const handleFormSubmit = async (formData: typeof initialFormState) => {
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      await api.createOrganization(formData);
      setFormSuccess("Organization created successfully!");
      setForm(initialFormState);
      setShowModal(false);
      const orgData = await api.getAllOrganizations();
      setOrgs(orgData);
    } catch (err: any) {
      setFormError(err.message || "Failed to create organization");
    } finally {
      setFormLoading(false);
    }
  };


  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Organizations</h1>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 max-w-xl">
                <input
                  type="text"
                  placeholder="Search organizations..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#8B4513]"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#8B4513] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  + Create
                </button>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-black">Organization List</h2>
              {loading ? (
                <div className="text-center text-gray-500">Loading organizations...</div>
              ) : error ? (
                <div className="text-center text-red-600">{error}</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Country</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orgs.map((org, idx) => (
                      <tr key={org.id || idx} className="border-b">
                        <td className="py-4 text-black font-medium flex items-center gap-2">
                          {org.logoUrl && (
                            <img
                              src={org.logoUrl}
                              alt="logo"
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          )}
                          {org.name}
                        </td>
                        <td className="py-4 text-black">
                          {orgTypes.find(t => t.value === org.type)?.label || "Other"}
                        </td>
                        <td className="py-4 text-black">{org.email}</td>
                        <td className="py-4 text-black">{org.phone}</td>
                        <td className="py-4 text-black">{org.country}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-[15px] text-white text-xs ${
                              org.isActive ? "bg-green-600" : "bg-gray-400"
                            }`}
                          >
                            {org.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 text-black">
                          {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <CreateOrganizationModal
            open={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleFormSubmit}
            loading={formLoading}
            error={formError}
            success={formSuccess}
            form={form}
            onFormChange={handleFormChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Organizations;
