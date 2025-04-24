"use client";

import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import { api } from "@/services/api";
import { Service } from "@/types/types";

const initialServiceForm = {
  name: "",
  description: "",
  price: 0,
  orgId: 0,
  serviceTypeId: 0,
  capacity: 0,
  durationInMinutes: 0,
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialServiceForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Service Type creation
  const [serviceTypeName, setServiceTypeName] = useState("");
  const [serviceTypeLoading, setServiceTypeLoading] = useState(false);
  const [serviceTypeError, setServiceTypeError] = useState("");
  const [serviceTypeSuccess, setServiceTypeSuccess] = useState("");

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setError("");
      try {
        const token = api.getAccessToken();
        if (!token) throw new Error("Not authenticated");
        const data = await api.getAllServices(token);
        setServices(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch services");
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["price", "orgId", "serviceTypeId", "capacity", "durationInMinutes"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      const token = api.getAccessToken();
      if (!token) throw new Error("Not authenticated");
      await api.createService(token, form);
      setFormSuccess("Service created successfully!");
      setForm(initialServiceForm);
      setShowForm(false);
      // Refresh list
      const data = await api.getAllServices(token);
      setServices(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setFormError(err.message || "Failed to create service");
    } finally {
      setFormLoading(false);
    }
  };

  const handleServiceTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServiceTypeLoading(true);
    setServiceTypeError("");
    setServiceTypeSuccess("");
    try {
      const token = api.getAccessToken();
      if (!token) throw new Error("Not authenticated");
      await api.createServiceType(token, { name: serviceTypeName });
      setServiceTypeSuccess("Service type created!");
      setServiceTypeName("");
    } catch (err: any) {
      setServiceTypeError(err.message || "Failed to create service type");
    } finally {
      setServiceTypeLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Services</h1>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 max-w-xl">
                <input
                  type="text"
                  placeholder="Search services... (not implemented)"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-700"
                  disabled
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  + Create Service
                </button>
              </div>
            </div>

            {/* Service Type Creation */}
            <div className="mb-8">
              <form onSubmit={handleServiceTypeSubmit} className="flex gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium mb-1">New Service Type</label>
                  <input
                    className="border px-3 py-2 rounded"
                    value={serviceTypeName}
                    onChange={e => setServiceTypeName(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                  disabled={serviceTypeLoading}
                >
                  {serviceTypeLoading ? "Creating..." : "Create Type"}
                </button>
                {serviceTypeError && <span className="text-red-600 ml-2">{serviceTypeError}</span>}
                {serviceTypeSuccess && <span className="text-green-600 ml-2">{serviceTypeSuccess}</span>}
              </form>
            </div>

            {/* Service List */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-black">Service List</h2>
              {loading ? (
                <div className="text-center text-gray-600">Loading...</div>
              ) : error ? (
                <div className="text-red-600">{error}</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Org ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service: any, idx: number) => (
                      <tr key={service.id || idx} className="border-b">
                        <td className="py-4 text-black">{service.id || idx}</td>
                        <td className="py-4 text-black font-medium">{service.name}</td>
                        <td className="py-4 text-black">{service.serviceTypeId}</td>
                        <td className="py-4 text-black">{service.price}</td>
                        <td className="py-4 text-black">{service.orgId}</td>
                        <td className="py-4 text-black">{service.capacity ?? '-'}</td>
                        <td className="py-4 text-black">{service.durationInMinutes ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Create Service Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                    onClick={() => setShowForm(false)}
                  >
                    ×
                  </button>
                  <h3 className="text-xl font-bold mb-4">Create Service</h3>
                  <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        className="w-full border px-3 py-2 rounded"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        className="w-full border px-3 py-2 rounded"
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Price</label>
                      <input
                        type="number"
                        className="w-full border px-3 py-2 rounded"
                        name="price"
                        value={form.price}
                        onChange={handleFormChange}
                        required
                        min={0}
                        step={0.01}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Organization ID</label>
                      <input
                        type="number"
                        className="w-full border px-3 py-2 rounded"
                        name="orgId"
                        value={form.orgId}
                        onChange={handleFormChange}
                        required
                        min={1}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Service Type ID</label>
                      <input
                        type="number"
                        className="w-full border px-3 py-2 rounded"
                        name="serviceTypeId"
                        value={form.serviceTypeId}
                        onChange={handleFormChange}
                        required
                        min={1}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Capacity</label>
                      <input
                        type="number"
                        className="w-full border px-3 py-2 rounded"
                        name="capacity"
                        value={form.capacity}
                        onChange={handleFormChange}
                        min={0}
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                      <input
                        type="number"
                        className="w-full border px-3 py-2 rounded"
                        name="durationInMinutes"
                        value={form.durationInMinutes}
                        onChange={handleFormChange}
                        min={0}
                      />
                    </div>
                    {formError && <div className="mb-4 text-red-600">{formError}</div>}
                    {formSuccess && <div className="mb-4 text-green-600">{formSuccess}</div>}
                    <button
                      type="submit"
                      className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
                      disabled={formLoading}
                    >
                      {formLoading ? "Creating..." : "Create Service"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
