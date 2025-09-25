import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: implement test logic
    return NextResponse.json({ success: true, id: params.id });
  } catch (err) {
    console.error("Campaign TEST error:", err);
    return NextResponse.json({ error: "Failed to run test" }, { status: 500 });
  }
}
