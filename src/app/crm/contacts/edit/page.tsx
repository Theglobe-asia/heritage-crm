// src/app/crm/contacts/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

type FormState = {
  email: string;
  firstName: string;
  lastName: string;
  tag: "BASIC" | "SILVER" | "VIP" | "GOLD";
};

export default function EditContactPage() {
  const search = useSearchParams();
  const router = useRouter();
  const id = search.get("id");

  const [form, setForm] = useState<FormState>({
    email: "",
    firstName: "",
    lastName: "",
    tag: "BASIC",
  });
  const [saving, setSaving] = useState(false);

  // ✅ Load contact for edit
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/contacts/${id}`);
        if (!res.ok) throw new Error("Failed to load contact");
        const c = await res.json();
        setForm({
          email: c.email,
          firstName: c.firstName,
          lastName: c.lastName,
          tag: c.tag,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load contact");
      }
    })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Contact updated");
      router.push("/crm/contacts/manage");
    } catch (err) {
      console.error(err);
      toast.error("Error updating contact");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 pt-10 pb-24 flex flex-col items-center text-white">
      <Image src="/globe.png" alt="Logo" width={90} height={90} className="mb-4" />
      <Link href="/crm/contacts/manage" className="mb-6 btn">
        ← Back to Manage Contacts
      </Link>
      <h1 className="text-3xl font-bold mb-8">Edit Contact</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl space-y-5 bg-white rounded-2xl p-6 text-black border border-white/10"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">First Name *</label>
          <input
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Last Name *</label>
          <input
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tag *</label>
          <select
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value as FormState["tag"] })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="BASIC">Basic</option>
            <option value="SILVER">Silver</option>
            <option value="VIP">VIP</option>
            <option value="GOLD">Gold</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/crm/contacts/manage"
            className="px-4 py-2 rounded-lg border border-gray-300 text-black"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn"
          >
            {saving ? "Saving..." : "Update Contact"}
          </button>
        </div>
      </form>
    </div>
  );
}
