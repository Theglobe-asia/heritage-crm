"use client";

import Link from "next/link";
import Image from "next/image";
import { UserPlus, Users } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="px-6 pt-10 pb-24 flex flex-col items-center text-white">
      {/* Logo + Back */}
      <Image src="/globe.png" alt="Logo" width={90} height={90} className="mb-4" />
      <Link href="/crm" className="mb-6 btn">← Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-8">Contacts</h1>

      <div className="grid max-w-4xl w-full grid-cols-1 sm:grid-cols-2 gap-7">
        {/* Add Contact */}
        <Link
          href="/crm/contacts/add"
          className="card-3d p-6 hover:scale-105 transition flex flex-col items-center"
        >
          <UserPlus className="h-8 w-8 mb-3 text-[var(--gold)]" />
          <h3 className="text-lg font-semibold text-[var(--gold)]">Add Contact</h3>
          <p className="mt-2 text-sm text-gray-300">Create new contacts or import in bulk</p>
        </Link>

        {/* Manage Contact */}
        <Link
          href="/crm/contacts/manage"
          className="card-3d p-6 hover:scale-105 transition flex flex-col items-center"
        >
          <Users className="h-8 w-8 mb-3 text-[var(--gold)]" />
          <h3 className="text-lg font-semibold text-[var(--gold)]">Manage Contacts</h3>
          <p className="mt-2 text-sm text-gray-300">View, edit, delete or export contacts</p>
        </Link>
      </div>
    </div>
  );
}
