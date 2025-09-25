import { NextResponse } from "next/server";

// Not used (kept for build success)
export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  // ... use `id` inside
}
