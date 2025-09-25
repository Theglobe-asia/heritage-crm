"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Campaign = {
  id: string;
  title: string;
  message: string;
  status: string;
  audience: string;
  sendOption: string;
  scheduledAt?: string | null;
};

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleEdit = (id: string) => {
    router.push(`/crm/campaigns/create?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success("Campaign deleted");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting campaign");
    }
  };

  return (
    <div className="px-6 pt-10 pb-24 flex flex-col items-center text-white">
      <Image src="/globe.png" alt="Logo" width={90} height={90} className="mb-4" />
      <Link href="/crm/campaigns" className="mb-6 btn">← Back to Campaigns</Link>
      <h1 className="text-3xl font-bold mb-8">Manage Campaigns</h1>

      <div className="w-full max-w-5xl">
        <div className="rounded-2xl p-6 bg-[#121217] border border-white/10">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : campaigns.length === 0 ? (
            <div className="p-6 text-center text-white/70">No campaigns found.</div>
          ) : (
            <table className="min-w-full text-sm text-white">
              <thead className="bg-black/30">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Audience</th>
                  <th className="p-3 text-left">Send Option</th>
                  <th className="p-3 text-left">Scheduled At</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-t border-white/10">
                    <td className="p-3">{c.title}</td>
                    <td className="p-3">{c.status}</td>
                    <td className="p-3">{c.audience}</td>
                    <td className="p-3">{c.sendOption}</td>
                    <td className="p-3">{c.scheduledAt || "—"}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {c.status === "Scheduled" && (
                          <button
                            onClick={() => handleEdit(c.id)}
                            className="px-2 py-1 rounded-md bg-[var(--gold)]"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-black" />
                          </button>
                        )}
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
