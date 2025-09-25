import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const updated = await prisma.campaign.update({
      where: { id },
      data: { status: "Cancelled" },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Cancel campaign error:", err);
    return NextResponse.json({ error: "Failed to cancel campaign" }, { status: 500 });
  }
}
