import { NextResponse } from "next/server";
import { seedAdmin } from "@/lib/SeedAdmin";

export async function POST(req) {
  try {
    const secret = process.env.ADMIN_SEED_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: "ADMIN_SEED_SECRET not configured" },
        { status: 403 }
      );
    }

    const reqSecret = req.headers.get("x-seed-secret") || "";
    if (reqSecret !== secret) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await seedAdmin();
    return NextResponse.json({ success: true, message: "Admin credentials seeded/updated" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
