import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { uploadToFTP, ensureDir } from "@/lib/ftp";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("image");
  const type = formData.get("type"); // carousel | gallery

  if (!file || !type) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const limit = type === "carousel" ? 10 : 50;

  const [count] = await db.execute(
    "SELECT COUNT(*) AS total FROM images WHERE type = ?",
    [type]
  );

  if (count[0].total >= limit) {
    return NextResponse.json(
      { error: `${type} limit reached` },
      { status: 403 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${type}_${Date.now()}_${file.name}`;

  // ✅ RELATIVE PATHS (CORRECT)
  const typeDir = `/${type}`;
  const remotePath = `${typeDir}/${fileName}`;

  // Ensure folder exists
  await ensureDir(typeDir);

  // Upload
  await uploadToFTP(buffer, remotePath);

  // Public URL
  const imageUrl = `${process.env.SITE_URL}/uploads/${type}/${fileName}`;

  await db.execute(
    "INSERT INTO images (image_url, type) VALUES (?, ?)",
    [imageUrl, type]
  );

  return NextResponse.json({ success: true, imageUrl });
}
