// src/app/api/contacts/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: Request, context: any) {
  try {
    const id = context?.params?.id as string;
    const c = await prisma.contact.findUnique({ where: { id } });
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(c);
  } catch (err) {
    console.error("Contact GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const id = context?.params?.id as string;
    const { email, firstName, lastName, tag } = await req.json();
    const updated = await prisma.contact.update({
      where: { id },
      data: { email, firstName, lastName, tag },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Contact PUT error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: any) {
  try {
    const id = context?.params?.id as string;
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact DELETE error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
