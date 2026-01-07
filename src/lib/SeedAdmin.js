import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error("ADMIN_USERNAME or ADMIN_PASSWORD missing");
  }

  const [rows] = await db.execute(
    "SELECT id FROM admin_users LIMIT 1"
  );

  const hash = await bcrypt.hash(password, 12);

  if (rows.length === 0) {
    // create admin
    await db.execute(
      "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
      [username, hash]
    );
    console.log("✅ Admin created");
  } else {
    // update admin
    await db.execute(
      "UPDATE admin_users SET username = ?, password_hash = ? WHERE id = ?",
      [username, hash, rows[0].id]
    );
    console.log("🔄 Admin credentials updated");
  }
}
