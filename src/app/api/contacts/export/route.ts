// src/app/api/contacts/export/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany();

    let csv = "Email,First Name,Last Name,Tag\n";
    contacts.forEach((c) => {
      csv += `${c.email},${c.firstName},${c.lastName},${c.tag}\n`;
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=contacts.csv",
      },
    });
  } catch (err) {
    console.error("GET /contacts/export error:", err);
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}
