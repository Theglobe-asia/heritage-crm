"use client";

import Link from "next/link";
import Image from "next/image";
import { Users, Megaphone, BarChart2, ChevronRight } from "lucide-react";

export default function CRMPage() {
  return (
    <div className="px-6 pt-10 pb-24 flex flex-col items-center text-white">
      {/* Logo */}
      <Image src="/globe.png" alt="Logo" width={90} height={90} className="mb-4" />

      {/* Title & Tagline */}
      <h1 className="text-3xl font-bold mb-2">CRM by The Globe's Heritage by Chef Alex</h1>
      <p className="text-sm text-gray-400 mb-10">
        Developed by Chef Alex ©2025
      </p>

      {/* Cards (locked layout: 3 cards, gold headings, with icons & buttons) */}
      <div className="grid max-w-6xl w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {/* Contacts */}
        <Link
          href="/crm/contacts"
          className="card-3d p-7 hover:translate-y-[-6px] hover:scale-[1.02] transition"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-3">
              <Users className="h-6 w-6 text-[var(--gold)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--gold)]">Contacts</h3>
          </div>
          <p className="mt-3 text-sm text-gray-300">
            Add, edit, tag, import & export your audience.
          </p>
          <span className="btn mt-5 inline-flex items-center gap-2">
            Open Contacts <ChevronRight className="h-4 w-4" />
          </span>
        </Link>

        {/* Campaigns */}
        <Link
          href="/crm/campaigns"
          className="card-3d p-7 hover:translate-y-[-6px] hover:scale-[1.02] transition"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-3">
              <Megaphone className="h-6 w-6 text-[var(--gold)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--gold)]">Campaigns</h3>
          </div>
          <p className="mt-3 text-sm text-gray-300">
            Create & manage email campaigns quickly.
          </p>
          <span className="btn mt-5 inline-flex items-center gap-2">
            Open Campaigns <ChevronRight className="h-4 w-4" />
          </span>
        </Link>

        {/* Reports */}
        <Link
          href="/crm/reports"
          className="card-3d p-7 hover:translate-y-[-6px] hover:scale-[1.02] transition"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-3">
              <BarChart2 className="h-6 w-6 text-[var(--gold)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--gold)]">Reports</h3>
          </div>
          <p className="mt-3 text-sm text-gray-300">
            Track performance with charts & exports.
          </p>
          <span className="btn mt-5 inline-flex items-center gap-2">
            Open Reports <ChevronRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
