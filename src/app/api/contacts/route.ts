import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Tag = "BASIC" | "SILVER" | "VIP" | "GOLD";
const TAGS: Tag[] = ["BASIC", "SILVER", "VIP", "GOLD"];

// GET /api/contacts
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(contacts);
  } catch (err) {
    console.error("Contacts GET error:", err);
    return NextResponse.json({ error: "Failed to load contacts" }, { status: 500 });
  }
}

// POST /api/contacts
export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";

    let email = "";
    let firstName = "";
    let lastName = "";
    let tag: Tag = "BASIC";

    if (ct.includes("application/json")) {
      const body = await req.json();
      email = body.email;
      firstName = body.firstName;
      lastName = body.lastName;
      tag = TAGS.includes(body.tag) ? (body.tag as Tag) : "BASIC";
    } else {
      const form = await req.formData();
      email = String(form.get("email") || "");
      firstName = String(form.get("firstName") || "");
      lastName = String(form.get("lastName") || "");
      const t = String(form.get("tag") || "BASIC").toUpperCase();
      tag = TAGS.includes(t as Tag) ? (t as Tag) : "BASIC";
    }

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const created = await prisma.contact.create({
      data: { email, firstName, lastName, tag },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Contacts POST error:", err);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
