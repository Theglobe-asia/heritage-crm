// src/app/api/contacts/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET all contacts
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(contacts);
  } catch (err) {
    console.error("GET /contacts error:", err);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

// ✅ POST create new contact
export async function POST(req: Request) {
  try {
    const { email, firstName, lastName, tag } = await req.json();

    if (!email || !firstName || !lastName || !tag) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newContact = await prisma.contact.create({
      data: { email, firstName, lastName, tag },
    });

    return NextResponse.json(newContact);
  } catch (err: any) {
    console.error("POST /contacts error:", err);
    return NextResponse.json({ error: err.message || "Failed to create contact" }, { status: 500 });
  }
}
