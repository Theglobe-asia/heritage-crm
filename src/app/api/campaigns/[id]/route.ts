import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET campaign by ID (for edit prefill)
export async function GET(_req: Request, context: any) {
  try {
    const { id } = context.params;
    const c = await prisma.campaign.findUnique({ where: { id } });
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...c,
      audience: String(c.audience),
      status: String(c.status),
    });
  } catch (err) {
    console.error("GET campaign by id error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
