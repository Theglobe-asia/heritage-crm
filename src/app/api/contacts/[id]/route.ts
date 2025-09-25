import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET contact by ID
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: context.params.id },
    });
    if (!contact) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(contact);
  } catch (err) {
    console.error("Contact GET error:", err);
    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 });
  }
}

// UPDATE contact
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const contact = await prisma.contact.update({
      where: { id: context.params.id },
      data: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        tag: body.tag,
      },
    });
    return NextResponse.json(contact);
  } catch (err) {
    console.error("Contact PUT error:", err);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

// DELETE contact
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
