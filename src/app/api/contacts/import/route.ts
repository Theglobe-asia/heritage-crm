import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Tag = "BASIC" | "SILVER" | "VIP" | "GOLD";
const TAGS: Tag[] = ["BASIC", "SILVER", "VIP", "GOLD"];

// POST /api/contacts/import  (multipart form with field "file")
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "CSV file is required" }, { status: 400 });
    }

    const text = await file.text();
    // Expect header: email,firstName,lastName,tag
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return NextResponse.json({ imported: 0 });

    // skip header if present
    const start = lines[0].toLowerCase().includes("email") ? 1 : 0;
    const rows = lines.slice(start);

    const data = rows
      .map((line) => line.split(",").map((s) => s.trim()))
      .filter((cols) => cols.length >= 3)
      .map((cols) => {
        const [email, firstName, lastName, rawTag] = cols;
        const t = (rawTag || "BASIC").toUpperCase();
        const tag: Tag = TAGS.includes(t as Tag) ? (t as Tag) : "BASIC";
        return { email, firstName, lastName, tag };
      });

    if (data.length === 0) return NextResponse.json({ imported: 0 });

    const result = await prisma.$transaction(
      data.map((d) =>
        prisma.contact.upsert({
          where: { email: d.email },
          create: d,
          update: { firstName: d.firstName, lastName: d.lastName, tag: d.tag },
        })
      )
    );

    return NextResponse.json({ imported: result.length });
  } catch (err) {
    console.error("Contacts IMPORT error:", err);
    return NextResponse.json({ error: "Failed to import contacts" }, { status: 500 });
  }
}
