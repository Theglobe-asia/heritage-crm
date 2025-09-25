import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(contact);
  } catch (err) {
    console.error("Contact GET error:", err);
    return NextResponse.json({ error: "Failed to load contact" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const updated = await prisma.contact.update({
      where: { id },
      data: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        tag: body.tag,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Contact PUT error:", err);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
