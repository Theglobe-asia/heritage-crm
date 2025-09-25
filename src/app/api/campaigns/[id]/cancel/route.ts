import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: implement cancel logic
    return NextResponse.json({ success: true, id: params.id });
  } catch (err) {
    console.error("Campaign CANCEL error:", err);
    return NextResponse.json({ error: "Failed to cancel" }, { status: 500 });
  }
}
