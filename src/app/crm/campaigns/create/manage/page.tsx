"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Campaign = {
  id: string;
  title: string;
  message: string;
  audience: string;
  status: string;
  scheduledAt?: string | null;
  createdAt: string;
};

const PAGE_SIZE = 5;

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "All",
    scheduledAt: "",
  });
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/campaigns");
        const data = await res.json();
        setCampaigns(data);
      } catch {
        toast.error("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = campaigns.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startEdit = (c: Campaign) => {
    if (c.status === "Sent") {
      toast.error("Cannot edit a sent campaign");
      return;
    }
    setEditingId(c.id);
    setForm({
      title: c.title,
      message: c.message,
      audience: c.audience,
      scheduledAt: c.scheduledAt || "",
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return toast.error("Title is required");

    setSaving(true);
    try {
      const res = await fetch(`/api/campaigns/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved: Campaign = await res.json();

      setCampaigns((prev) =>
        prev.map((c) => (c.id === editingId ? saved : c))
      );

      toast.success("Campaign updated");
      setOpen(false);
    } catch {
      toast.error("Error updating campaign");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success("Campaign deleted");
    } catch {
      toast.error("Error deleting campaign");
    }
  };

  return (
    <div className="px-6 pt-10 pb-24 flex flex-col items-center text-white">
      <Image src="/globe.png" alt="Logo" width={90} height={90} className="mb-4" />
      <Link href="/crm" className="mb-6 btn">
        ← Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-8">Manage Campaigns</h1>

      {/* Search */}
      <div className="w-full max-w-5xl mb-6 flex justify-end">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="w-full max-w-5xl">
        <div className="card-3d rounded-2xl p-6 text-white">
          <div className="overflow-x-auto rounded-lg border border-white/10">
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : (
              <table className="min-w-full text-sm text-white">
                <thead className="bg-black/30">
                  <tr>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Audience</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Scheduled At</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-white/70">
                        No campaigns found.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((c) => (
                      <tr key={c.id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="p-3">{c.title}</td>
                        <td className="p-3">{c.audience}</td>
                        <td className="p-3">{c.status}</td>
                        <td className="p-3">{c.scheduledAt || "—"}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {c.status !== "Sent" && (
                              <button
                                onClick={() => startEdit(c)}
                                className="px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-700 transition"
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4 text-black" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 transition"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-black" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    page === i + 1
                      ? "bg-[var(--gold)] text-black"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white text-black rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-gray-100 text-black"
              />
            </div>
            <div>
              <Label>Message</Label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full min-h-[120px] rounded-lg bg-gray-100 text-black px-3 py-2"
              />
            </div>
            <div>
              <Label>Audience</Label>
              <select
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
                className="w-full bg-gray-100 text-black rounded-lg px-3 py-2"
              >
                <option>All</option>
                <option>Test</option>
                <option>Basic</option>
                <option>Silver</option>
                <option>VIP</option>
                <option>Gold</option>
              </select>
            </div>
            <div>
              <Label>Scheduled At</Label>
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                className="w-full bg-gray-100 text-black"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-[var(--gold)] text-black font-semibold"
              >
                {saving ? "Saving..." : "Update"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
