"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    router.push("/login");
  }

  const navItem = (href, label) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={`block px-4 py-3 rounded-lg transition
        ${
          pathname === href
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`}>
      {label}
    </Link>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200">
            {open ? "X" : "☰"}
          </button>
          <span className="font-semibold text-lg">CMS Panel</span>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 font-medium">
          Logout
        </button>
      </div>

      {/* Spacer for fixed navbar on mobile */}
      <div className="md:hidden h-16" />

      {/* Overlay (Mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar/Dropdown Menu */}
      <aside
        className={`fixed md:static top-16 md:top-0 left-0 z-50
    h-[calc(100svh-4rem)] md:h-full
    w-screen md:w-64
    bg-white shadow-lg
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0`}>
        <div className="hidden md:block p-4 border-b font-semibold text-lg">
          CMS Panel
        </div>

        <nav className="p-4 space-y-2 h-svh">
          {navItem("/admin/carousel", "Carousel")}
          {navItem("/admin/gallery", "Gallery")}

          <button
            onClick={logout}
            className="hidden md:block w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-100">
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
