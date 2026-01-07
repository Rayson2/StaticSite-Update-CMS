import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const IDLE_TIMEOUT = Number(process.env.IDLE_TIMEOUT);   // seconds
const ABSOLUTE_CAP = Number(process.env.ABSOLUTE_CAP);   // seconds

if (!IDLE_TIMEOUT || !ABSOLUTE_CAP) {
  throw new Error("Session timeout environment variables are missing");
}

export async function POST(req) {
  const { username, password } = await req.json();

  const [rows] = await db.execute(
    "SELECT id, password_hash FROM admin_users WHERE username = ?",
    [username]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, rows[0].password_hash);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await db.execute(
    `
    UPDATE admin_users
    SET login_count = login_count + 1,
        last_login_at = NOW()
    WHERE id = ?
    `,
    [rows[0].id]
  );

  const issuedAt = Math.floor(Date.now() / 1000);

  const token = jwt.sign(
    {
      id: rows[0].id,
      iat: issuedAt,
      exp: issuedAt + IDLE_TIMEOUT
    },
    process.env.AUTH_SECRET
  );

  const response = NextResponse.json({ success: true });

  response.cookies.set("cms_auth", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: IDLE_TIMEOUT
  });

  return response;
}
