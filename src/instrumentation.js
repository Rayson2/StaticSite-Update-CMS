import { seedAdmin } from "@/lib/SeedAdmin";

export async function register() {
  console.log("🔧 Server starting → syncing admin credentials");
  await seedAdmin();
}
