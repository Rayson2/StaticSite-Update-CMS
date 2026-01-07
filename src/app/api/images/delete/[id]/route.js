import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import FTPClient from "ftp";
import path from "path";

export async function DELETE(req, context) {
  const { id } = await context.params;

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Get image info
    const [rows] = await db.execute(
      "SELECT image_url, type FROM images WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      await db.end();
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const { image_url, type } = rows[0];
    const fileName = path.basename(image_url);
    const folder = type === "carousel" ? "carousel" : "gallery";

    // FTP delete (IMPORTANT FIX)
    await new Promise((resolve, reject) => {
      const ftp = new FTPClient();

      ftp.on("ready", () => {
        ftp.cwd(folder, (err) => {
          if (err) {
            ftp.end();
            return reject(err);
          }

          ftp.delete(fileName, (err) => {
            ftp.end();
            err ? reject(err) : resolve();
          });
        });
      });

      ftp.connect({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        port: 21
      });
    });

    // Delete DB record
    await db.execute("DELETE FROM images WHERE id = ?", [id]);
    await db.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
