"use client";

import React from "react";

interface CreateOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: any) => void;
  loading: boolean;
  error: string;
  success: string;
  form: any;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const orgTypes = [
  { value: 0, label: "Other" },
  { value: 1, label: "Hotel" },
  { value: 2, label: "Restaurant" },
  { value: 3, label: "Ferry" },
  { value: 4, label: "Park" },
  { value: 5, label: "Events" },
];

export default function CreateOrganizationModal({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  success,
  form,
  onFormChange,
}: CreateOrganizationModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-sm relative">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center text-[#8B4513]">Create Organization</h2>
        <form className="space-y-3" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
          <input type="text" name="name" value={form.name} onChange={onFormChange} placeholder="Name" required className="w-full border px-3 py-2 rounded" />
          <input type="text" name="registrationNumber" value={form.registrationNumber} onChange={onFormChange} placeholder="Registration Number" required className="w-full border px-3 py-2 rounded" />
          <input type="email" name="email" value={form.email} onChange={onFormChange} placeholder="Email" required className="w-full border px-3 py-2 rounded" />
          <input type="text" name="phone" value={form.phone} onChange={onFormChange} placeholder="Phone" required className="w-full border px-3 py-2 rounded" />
          <input type="text" name="address" value={form.address} onChange={onFormChange} placeholder="Address" required className="w-full border px-3 py-2 rounded" />
          <input type="text" name="country" value={form.country} onChange={onFormChange} placeholder="Country" required className="w-full border px-3 py-2 rounded" />
          <input type="text" name="website" value={form.website} onChange={onFormChange} placeholder="Website" className="w-full border px-3 py-2 rounded" />
          <input type="text" name="logoUrl" value={form.logoUrl} onChange={onFormChange} placeholder="Logo URL" className="w-full border px-3 py-2 rounded" />
          <select name="type" value={form.type} onChange={onFormChange} className="w-full border px-3 py-2 rounded">
            {orgTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {error && <div className="text-red-600 text-center text-sm">{error}</div>}
          {success && <div className="text-green-700 text-center text-sm">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-[#8B4513] rounded hover:bg-[#5B2415] transition disabled:opacity-50 mt-1"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
