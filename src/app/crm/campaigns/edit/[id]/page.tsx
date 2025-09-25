"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { CalendarClock, Save } from "lucide-react";

type Campaign = {
  id: string;
  title: string;
  message: string;
  audience: "Test" | "All" | "Basic" | "Silver" | "VIP" | "Gold";
  sendOption: "Send Now" | "Scheduled";
  scheduledAt?: string | null;
  status: string;
};

export default function EditCampaignPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "All" as Campaign["audience"],
    submitChoice: "Send Now" as "Send Now" | "Scheduled",
    scheduledAt: "",
  });

  const canSchedule = useMemo(() => form.submitChoice === "Scheduled", [form.submitChoice]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/campaigns/${id}`);
        if (!res.ok) throw new Error("Failed to load campaign");
        const c: Campaign = await res.json();

        setForm({
          title: c.title ?? "",
          message: c.message ?? "",
          audience: (c.audience as Campaign["audience"]) ?? "All",
          submitChoice: (c.sendOption as "Send Now" | "Scheduled") ?? "Send Now",
          scheduledAt: c.scheduledAt ? new Date(c.scheduledAt).toISOString().slice(0, 16) : "",
        });
      } catch {
        toast.error("Could not load campaign");
        router.push("/crm/campaigns/manage");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");

    let scheduledAtISO: string | null = null;
    if (form.submitChoice === "Send Now") {
      scheduledAtISO = new Date().toISOString();
    } else {
      if (!form.scheduledAt) return toast.error("Choose a date & time to schedule");
      scheduledAtISO = new Date(form.scheduledAt).toISOString();
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          message: form.message,
          audience: form.audience,
          sendOption: form.submitChoice,
          scheduledAt: scheduledAtISO,
        }),
      });
      if (!res.ok) throw new Error("Save failed");

      toast.success("Campaign updated");
      router.push("/crm/campaigns/manage");
    } catch (err) {
      console.error(err);
      toast.error("Error updating campaign");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 pt-10 pb-24 flex flex-col items-center text-white">
        <Image src="/globe.png" alt="Logo" width={90} height={90} className="mb-4" />
        <div className="card-3d p-6 w-full max-w-3xl text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-10 pb-24 flex flex-col items-center text-white">
      <Image src="/globe.png" alt="Logo" width={90} height={90} className="mb-4" />
      <Link href="/crm" className="mb-6 btn">← Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-8">Edit Campaign</h1>

      <form onSubmit={handleSave} className="w-full max-w-3xl card-3d p-6 grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm text-gray-300">Title *</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:ring-2 focus:ring-[var(--gold)]"
            placeholder="Campaign title"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm text-gray-300">Message *</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full min-h-[140px] rounded-lg bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:ring-2 focus:ring-[var(--gold)]"
            placeholder="Write your campaign message..."
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm text-gray-300">To *</label>
          <select
            value={form.audience}
            onChange={(e) =>
              setForm((f) => ({ ...f, audience: e.target.value as Campaign["audience"] }))
            }
            className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:ring-2 focus:ring-[var(--gold)]"
          >
            <option value="Test">Test campaign</option>
            <option value="All">All</option>
            <option value="Basic">Basic</option>
            <option value="Silver">Silver</option>
            <option value="VIP">VIP</option>
            <option value="Gold">Gold</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm text-gray-300">Submit Campaign *</label>
            <select
              value={form.submitChoice}
              onChange={(e) =>
                setForm((f) => ({ ...f, submitChoice: e.target.value as "Send Now" | "Scheduled" }))
              }
              className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:ring-2 focus:ring-[var(--gold)]"
            >
              <option>Send Now</option>
              <option>Scheduled</option>
            </select>
          </div>

          {canSchedule && (
            <div className="grid gap-2">
              <label className="text-sm text-gray-300">Scheduled At *</label>
              <div className="relative">
                <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                  className="pl-9 w-full rounded-lg bg-gray-800 border border-gray-700 text-white px-3 py-2 focus:ring-2 focus:ring-[var(--gold)]"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/crm/campaigns/manage"
            className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn inline-flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
