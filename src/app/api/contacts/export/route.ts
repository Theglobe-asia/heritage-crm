import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/contacts/export
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
    const header = "email,firstName,lastName,tag";
    const rows = contacts.map(
      (c) => [c.email, c.firstName, c.lastName, c.tag].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    );
    const csv = [header, ...rows].join("\r\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="contacts.csv"',
      },
    });
  } catch (err) {
    console.error("Contacts EXPORT error:", err);
    return NextResponse.json({ error: "Failed to export contacts" }, { status: 500 });
  }
}
