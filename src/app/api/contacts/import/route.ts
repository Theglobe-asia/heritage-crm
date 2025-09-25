// src/app/api/contacts/import/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { contacts } = await req.json();

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ error: "No contacts provided" }, { status: 400 });
    }

    const created = await prisma.contact.createMany({
      data: contacts.map((c: any) => ({
        email: c.email,
        firstName: c.firstName,
        lastName: c.lastName,
        tag: c.tag?.toUpperCase() || "BASIC",
      })),
      skipDuplicates: true, // prevents crashing on duplicate emails
    });

    return NextResponse.json({ count: created.count });
  } catch (err) {
    console.error("POST /contacts/import error:", err);
    return NextResponse.json({ error: "Failed to import contacts" }, { status: 500 });
  }
}
