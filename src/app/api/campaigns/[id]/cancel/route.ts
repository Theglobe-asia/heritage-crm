// src/app/api/campaigns/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(_req: Request, context: any) {
  try {
    const id = context?.params?.id as string;
    const updated = await prisma.campaign.update({
      where: { id },
      data: { status: "Draft", scheduledAt: null },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Campaign CANCEL error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
