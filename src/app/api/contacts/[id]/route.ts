// src/app/api/contacts/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET one contact
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: context.params.id },
    });
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json(contact);
  } catch (err) {
    console.error("Contact GET error:", err);
    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 });
  }
}

// ✅ UPDATE one contact
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await prisma.contact.update({
      where: { id: context.params.id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Contact PUT error:", err);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

// ✅ DELETE one contact
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await prisma.contact.delete({
      where: { id: context.params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
