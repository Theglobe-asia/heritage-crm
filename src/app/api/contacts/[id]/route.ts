import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single contact
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
    });
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json(contact);
  } catch (err) {
    console.error("Contact GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT update contact
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await prisma.contact.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Contact PUT error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE contact
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contact.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
