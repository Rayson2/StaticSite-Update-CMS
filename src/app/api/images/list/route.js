import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    if (!type) return NextResponse.json({ images: [] });

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [rows] = await db.execute(
      "SELECT id, image_url FROM images WHERE type = ? ORDER BY uploaded_at DESC",
      [type]
    );

    await db.end();
    return NextResponse.json({ images: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ images: [] });
  }
}
    