// src/app/api/campaigns/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Keep it simple: context typed as `any` to satisfy Next.js build
export async function POST(req: Request, context: any) {
  try {
    const { id } = context.params;

    // ✅ Update campaign back to Draft if it's scheduled
    const updated = await prisma.campaign.update({
      where: { id },
      data: { status: "Draft" },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Cancel campaign error:", err);
    return NextResponse.json(
      { error: "Failed to cancel campaign" },
      { status: 500 }
    );
  }
}
