"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

type Report = {
  id: string;
  title: string;
  sent: number;
  opened: number;
  clicked: number;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        setReports(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="px-6 pt-10 pb-24 flex flex-col items-center text-white">
      <Image src="/globe.png" alt="Logo" width={90} height={90} />
      <Link href="/crm" className="mb-6 btn">← Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="w-full max-w-5xl card-3d p-6">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reports}>
              <XAxis dataKey="title" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Legend />
              <Bar dataKey="sent" fill="#f3c969" name="Sent" />
              <Bar dataKey="opened" fill="#60a5fa" name="Opened" />
              <Bar dataKey="clicked" fill="#34d399" name="Clicked" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
