// src/app/api/campaigns/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Use `any` for the context to satisfy Next’s strict route validator in builds.
export async function GET(_req: Request, context: any) {
  try {
    const id = context?.params?.id as string;
    const c = await prisma.campaign.findUnique({ where: { id } });
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      ...c,
      audience: String(c.audience),
      status: String(c.status),
    });
  } catch (err) {
    console.error("Campaign GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const id = context?.params?.id as string;
    const body = await req.json();
    const { title, message, audience, sendOption, scheduledAt } = body;

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        title,
        message,
        audience,
        sendOption,
        scheduledAt: sendOption === "Scheduled" && scheduledAt ? new Date(scheduledAt) : null,
        status: sendOption === "Send Now" ? "Sent" : "Scheduled",
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Campaign PUT error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: any) {
  try {
    const id = context?.params?.id as string;

    await prisma.$transaction([
      prisma.report.deleteMany({ where: { campaignId: id } }),
      prisma.campaign.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Campaign DELETE error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
