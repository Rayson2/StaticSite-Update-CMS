import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ABSOLUTE_CAP = Number(process.env.ABSOLUTE_CAP);

export function middleware(req) {
  const token = req.cookies.get("cms_auth")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const payload = jwt.verify(token, process.env.AUTH_SECRET);
      const now = Math.floor(Date.now() / 1000);

      if (now - payload.iat > ABSOLUTE_CAP) {
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.delete("cms_auth");
        return res;
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
