import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  _context: { params: Promise<{ id: string }> }
) {
  // No-op endpoint kept for compatibility with older UI.
  return NextResponse.json({ ok: true });
}
