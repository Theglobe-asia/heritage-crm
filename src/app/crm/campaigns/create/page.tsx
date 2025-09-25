"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type FormState = {
  title: string;
  message: string;
  audience: "TEST" | "ALL" | "BASIC" | "SILVER" | "VIP" | "GOLD";
  sendOption: "Send Now" | "Scheduled";
  scheduledAt: string;
};

export default function CreateCampaignPage() {
  const router = useRouter();
  const search = useSearchParams();
  const editId = search.get("id");

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    message: "",
    audience: "ALL",
    sendOption: "Send Now",
    scheduledAt: "",
  });

  // ✅ Prefill if editing
  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const res = await fetch(`/api/campaigns/${editId}`);
        if (!res.ok) throw new Error("Failed to load campaign");
        const c = await res.json();
        setForm({
          title: c.title ?? "",
          message: c.message ?? "",
          audience: (c.audience as FormState["audience"]) ?? "ALL",
          sendOption: (c.sendOption as FormState["sendOption"]) ?? "Send Now",
          scheduledAt: c.scheduledAt ? new Date(c.scheduledAt).toISOString().slice(0, 16) : "",
        });
      } catch (e) {
        console.error(e);
        toast.error("Error loading campaign for edit");
      }
    })();
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return toast.error("Title is required");
    if (form.sendOption === "Scheduled" && !form.scheduledAt) {
      return toast.error("Pick a schedule time");
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        message: form.message,
        audience: form.audience,
        sendOption: form.sendOption,
        scheduledAt: form.sendOption === "Scheduled" ? form.scheduledAt : null,
      };

      const method = editId ? "PUT" : "POST";
      const url = editId ? `/api/campaigns/${editId}` : "/api/campaigns";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");

      toast.success(editId ? "Campaign updated" : "Campaign created");
      router.push("/crm/campaigns/manage");
    } catch (err) {
      console.error(err);
      toast.error("Error saving campaign");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 pt-10 pb-24 flex flex-col items-center text-white">
      <Image src="/globe.png" alt="Logo" width={90} height={90} className="mb-4" />
      <Link href="/crm/campaigns" className="mb-6 btn">← Back to Campaigns</Link>
      <h1 className="text-3xl font-bold mb-8">{editId ? "Edit Campaign" : "Create Campaign"}</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl space-y-5 bg-white rounded-2xl p-6 text-black border border-white/10"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Campaign title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message *</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
            className="w-full min-h-[200px] rounded-lg border border-gray-300 px-3 py-2 font-sans text-base leading-relaxed"
            style={{ whiteSpace: "pre-wrap" }} // ✅ preserves spacing & line breaks in both & edit
            placeholder="Write your campaign message..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">To *</label>
            <select
              value={form.audience}
              onChange={(e) =>
                setForm((s) => ({ ...s, audience: e.target.value as FormState["audience"] }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="TEST">Test campaign</option>
              <option value="ALL">All</option>
              <option value="BASIC">Basic</option>
              <option value="SILVER">Silver</option>
              <option value="VIP">VIP</option>
              <option value="GOLD">Gold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Send *</label>
            <select
              value={form.sendOption}
              onChange={(e) =>
                setForm((s) => ({ ...s, sendOption: e.target.value as FormState["sendOption"] }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="Send Now">Send Now</option>
              <option value="Scheduled">Schedule</option>
            </select>
          </div>

          {form.sendOption === "Scheduled" && (
            <div>
              <label className="block text-sm font-medium mb-1">Scheduled At *</label>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm((s) => ({ ...s, scheduledAt: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/crm/campaigns"
            className="px-4 py-2 rounded-lg border border-gray-300 text-black"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn"
          >
            {saving ? "Saving..." : editId ? "Update Campaign" : "Submit Campaign"}
          </button>
        </div>

        <p className="text-xs mt-3 text-gray-600">
          Tagline: <em>The Globe in Pattaya - the hidden Gem where nights shine brighter.</em>
        </p>
      </form>
    </div>
  );
}
