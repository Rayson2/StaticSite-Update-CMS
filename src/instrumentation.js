import { seedAdmin } from "@/lib/SeedAdmin";

export async function register() {
  console.log("🔧 Server starting → syncing admin credentials");
  try {
    await seedAdmin();
  } catch (err) {
    console.warn("⚠️ Skipping admin seed: ", err?.message || err);
  }
}
