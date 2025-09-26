// src/app/api/contacts/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET one contact
export async function GET(_req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const c = await prisma.contact.findUnique({ where: { id } });
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(c);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// UPDATE contact
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const body = await req.json();
    const { email, firstName, lastName, tag } = body;

    const updated = await prisma.contact.update({
      where: { id },
      data: { email, firstName, lastName, tag },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE contact
export async function DELETE(_req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
