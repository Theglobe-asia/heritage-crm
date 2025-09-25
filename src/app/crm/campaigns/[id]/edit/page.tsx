"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

type Campaign = {
  id: string;
  title: string;
  message: string;
  audience: "TEST" | "ALL" | "BASIC" | "SILVER" | "VIP" | "GOLD";
  sendOption: "Send Now" | "Scheduled";
  scheduledAt?: string | null;
  status: string;
};

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "ALL" as Campaign["audience"],
    sendOption: "Send Now" as Campaign["sendOption"],
    scheduledAt: "",
  });

  // Load existing campaign
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/campaigns/${id}`);
        if (!res.ok) throw new Error("Failed to load campaign");
        const c: Campaign = await res.json();

        setForm({
          title: c.title,
          message: c.message,
          audience: c.audience,
          sendOption: c.sendOption,
          scheduledAt: c.scheduledAt ? c.scheduledAt.slice(0, 16) : "",
        });
      } catch {
        toast.error("Failed to load campaign");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        title: form.title,
        message: form.message,
        audience: form.audience,
        sendOption: form.sendOption,
        scheduledAt: form.sendOption === "Scheduled" ? form.scheduledAt : "",
      };

      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Update failed");

      toast.success("Campaign updated");
      router.push("/crm/campaigns");
    } catch {
      toast.error("Error updating campaign");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this campaign?")) return;
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Campaign deleted");
      router.push("/crm/campaigns");
    } catch {
      toast.error("Error deleting campaign");
    }
  };

  if (loading) {
    return (
      <div className="px-6 pt-10 pb-24 flex flex-col items-center">
        <Image src="/globe.png" alt="Logo" width={90} height={90} />
        <div className="card-3d p-6 w-full max-w-md mt-6 text-white">Loading…</div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-10 pb-24 flex flex-col items-center">
      <Image src="/globe.png" alt="Logo" width={90} height={90} />
      <Link href="/crm/campaigns" className="mb-6 btn">← Back to Campaigns</Link>
      <h1 className="text-3xl font-bold mb-6">Edit Campaign</h1>

      <form onSubmit={handleSubmit} className="card-3d p-6 w-full max-w-md bg-white text-black rounded-lg">
        <label className="block mb-1 font-medium">Title *</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="input w-full mb-4"
        />

        <label className="block mb-1 font-medium">Message *</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          className="input w-full min-h-[120px] mb-4"
        />

        <label className="block mb-1 font-medium">Audience *</label>
        <select
          value={form.audience}
          onChange={(e) => setForm({ ...form, audience: e.target.value as Campaign["audience"] })}
          className="input w-full mb-4"
        >
          <option value="TEST">Test Campaign</option>
          <option value="ALL">All</option>
          <option value="BASIC">Basic</option>
          <option value="SILVER">Silver</option>
          <option value="VIP">VIP</option>
          <option value="GOLD">Gold</option>
        </select>

        <label className="block mb-1 font-medium">Send *</label>
        <select
          value={form.sendOption}
          onChange={(e) => setForm({ ...form, sendOption: e.target.value as Campaign["sendOption"] })}
          className="input w-full mb-4"
        >
          <option value="Send Now">Send Now</option>
          <option value="Scheduled">Scheduled At</option>
        </select>

        {form.sendOption === "Scheduled" && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Scheduled At *</label>
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              required
              className="input w-full"
            />
          </div>
        )}

        <div className="flex gap-3 justify-between mt-4">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
          <div className="flex gap-3">
            <Link
              href="/crm/campaigns"
              className="px-4 py-2 rounded-lg border border-black/20 text-black hover:bg-black/5"
            >
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="btn">
              {saving ? "Saving..." : "Submit Campaign"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
