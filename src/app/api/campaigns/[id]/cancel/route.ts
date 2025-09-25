import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/campaigns/[id]/cancel
export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Only cancel Scheduled/Processing back to Draft
    const nextStatus = existing.status === "Scheduled" || existing.status === "Processing"
      ? "Draft"
      : existing.status;

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        status: nextStatus,
        scheduledAt: nextStatus === "Draft" ? null : existing.scheduledAt,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Campaign CANCEL error:", err);
    return NextResponse.json({ error: "Failed to cancel" }, { status: 500 });
  }
}
