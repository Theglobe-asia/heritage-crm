// src/app/api/campaigns/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET one campaign
export async function GET(_req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const c = await prisma.campaign.findUnique({ where: { id } });
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      ...c,
      audience: String(c.audience),
      status: String(c.status),
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// UPDATE campaign
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const body = await req.json();
    const { title, message, audience, sendOption, scheduledAt } = body;

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        title,
        message,
        audience,
        sendOption,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });

    return NextResponse.json({
      ...updated,
      audience: String(updated.audience),
      status: String(updated.status),
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE campaign (+ cascading reports by FK)
export async function DELETE(_req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    await prisma.campaign.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
