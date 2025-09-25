import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  _context: { params: Promise<{ id: string }> }
) {
  // Keep minimal/valid; tracking is handled elsewhere in current LOCKED flow.
  const gif1x1 = Buffer.from(
    "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
    "base64"
  );
  return new NextResponse(gif1x1, {
    headers: { "Content-Type": "image/gif", "Cache-Control": "no-store" },
  });
}
