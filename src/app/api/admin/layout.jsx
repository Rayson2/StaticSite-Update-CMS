import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import SessionGuard from "@/app/components/SessionGuard";

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_auth")?.value;

  if (!token) redirect("/login");

  try {
    jwt.verify(token, process.env.AUTH_SECRET);
  } catch {
    redirect("/login");
  }

  return (
    <SessionGuard>
      <div className="min-h-screen flex overflow-x-hidden">
        <aside>
          <Sidebar />
        </aside >
        <main className="flex-1 p-4 pt-15">{children}</main>
      </div>
    </SessionGuard>
  );
}
