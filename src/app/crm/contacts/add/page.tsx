"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function AddContactPage() {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    tag: "BASIC",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Contact added");
      setForm({ email: "", firstName: "", lastName: "", tag: "BASIC" });
    } catch {
      toast.error("Error adding contact");
    } finally {
      setSaving(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const Papa = await import("papaparse");
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const res = await fetch("/api/contacts/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contacts: results.data }),
          });
          if (!res.ok) throw new Error("Import failed");
          toast.success("CSV imported successfully");
        } catch {
          toast.error("CSV import failed");
        }
      },
    });
  };

  return (
    <div className="px-6 pt-10 pb-24 flex flex-col items-center text-black">
      <Image src="/globe.png" alt="Logo" width={90} height={90} className="mb-4" />
      <Link href="/crm/contacts" className="mb-6 btn">
        ← Back to Contacts
      </Link>
      <h1 className="text-3xl font-bold mb-8">Add Contact</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <div>
          <label className="block font-semibold">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">First Name *</label>
          <input
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Last Name *</label>
          <input
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Select Tag *</label>
          <select
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="BASIC">Basic</option>
            <option value="SILVER">Silver</option>
            <option value="VIP">VIP</option>
            <option value="GOLD">Gold</option>
          </select>
        </div>

        <button type="submit" disabled={saving} className="btn w-full">
          {saving ? "Saving..." : "Add Contact"}
        </button>
      </form>

      <div className="mt-10 w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg text-center">
        <h2 className="text-lg font-semibold mb-3">Import Contacts CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="block w-full text-sm mb-3"
        />
        <p className="text-xs text-gray-600">
          CSV must include: <code>email, firstName, lastName, tag</code>
        </p>
      </div>
    </div>
  );
}
