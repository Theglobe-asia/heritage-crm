import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  _context: { params: Promise<{ id: string }> }
) {
  // Minimal valid handler; redirect to site.
  return NextResponse.redirect("https://theglobeasia.com/whats-new/");
}
