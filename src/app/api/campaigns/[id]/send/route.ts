import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  _context: { params: Promise<{ id: string }> }
) {
  // No-op endpoint kept for compatibility; creation already sends when "Send Now".
  return NextResponse.json({ ok: true });
}
