"use client";

import Link from "next/link";
import Image from "next/image";

export default function CampaignsPage() {
  return (
    <div className="px-6 pt-10 pb-24 flex flex-col items-center text-white">
      <Image src="/globe.png" alt="Logo" width={90} height={90} className="mb-4" />
      <Link href="/crm" className="mb-6 btn">
        ← Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-8">Campaigns</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Create Campaign Card */}
        <Link
          href="/crm/campaigns/create"
          className="card-3d p-6 rounded-2xl transition transform hover:scale-105 hover:shadow-xl
                     bg-[#121217] border border-white/10 w-full max-w-sm mx-auto"
        >
          <h2 className="text-lg font-semibold text-[var(--gold)]">Create Campaign</h2>
          <p className="text-sm text-gray-400 mt-2">
            Launch a new campaign with scheduling or send now
          </p>
        </Link>

        {/* Manage Campaigns Card */}
        <Link
          href="/crm/campaigns/manage"
          className="card-3d p-6 rounded-2xl transition transform hover:scale-105 hover:shadow-xl
                     bg-[#121217] border border-white/10 w-full max-w-sm mx-auto"
        >
          <h2 className="text-lg font-semibold text-[var(--gold)]">Manage Campaigns</h2>
          <p className="text-sm text-gray-400 mt-2">
            Edit or delete existing campaigns
          </p>
        </Link>
      </div>
    </div>
  );
}
