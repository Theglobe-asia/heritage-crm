// src/app/crm/contacts/manage/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

type Contact = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tag: string;
};

export default function ManageContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/contacts");
        const data = await res.json();
        setContacts(data);
      } catch {
        toast.error("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEdit = (id: string) => {
    window.location.href = `/crm/contacts/edit?id=${id}`;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Contact deleted");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting contact");
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch("/api/contacts/export");
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "contacts.csv";
      a.click();
      toast.success("Contacts exported");
    } catch (err) {
      console.error(err);
      toast.error("Export failed");
    }
  };

  return (
    <div className="px-6 pt-10 pb-24 flex flex-col items-center text-white">
      <Image src="/globe.png" alt="Logo" width={90} height={90} className="mb-4" />
      <Link href="/crm" className="mb-6 btn">← Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-8">Manage Contacts</h1>

      {/* Export Button */}
      <div className="w-full max-w-5xl mb-6 flex justify-end">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--gold)] text-black font-semibold"
        >
          <Download className="h-4 w-4" />
          Export Contacts
        </button>
      </div>

      <div className="w-full max-w-5xl">
        <div className="rounded-2xl p-6 bg-[#121217] border border-white/10">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : contacts.length === 0 ? (
            <div className="p-6 text-center text-white/70">No contacts found.</div>
          ) : (
            <table className="min-w-full text-sm text-white">
              <thead className="bg-black/30">
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">First Name</th>
                  <th className="p-3 text-left">Last Name</th>
                  <th className="p-3 text-left">Tag</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-t border-white/10">
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.firstName}</td>
                    <td className="p-3">{c.lastName}</td>
                    <td className="p-3">{c.tag}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(c.id)}
                          className="px-2 py-1 rounded-md bg-[var(--gold)]"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4 text-black" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-2 py-1 rounded-md bg-[var(--gold)]"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-black" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
