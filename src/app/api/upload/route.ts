import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // ensure folder exists
  await import("fs/promises").then(async (fs) => {
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch {}
  });

  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(uploadDir, filename);

  await writeFile(filepath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
