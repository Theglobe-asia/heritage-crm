// src/app/api/contacts/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
    });
    if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(contact);
  } catch (err) {
    console.error("GET /contacts/[id] error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { email, firstName, lastName, tag } = await req.json();
    const updated = await prisma.contact.update({
      where: { id: params.id },
      data: { email, firstName, lastName, tag },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /contacts/[id] error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contact.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /contacts/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
