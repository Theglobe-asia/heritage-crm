import { NextResponse } from "next/server";

// Not used (kept for build success)
export async function POST(_req: Request, _context: any) {
  return NextResponse.json({ ok: true });
}
