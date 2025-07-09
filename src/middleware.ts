// middleware.ts or middleware.js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("accessToken");

    const isPublicPath =
        pathname.startsWith("/auth") || // login, register, reset
        pathname.startsWith("/_next") || // static Next.js assets
        pathname.startsWith("/favicon.ico") ||
        pathname === "/" ||
        pathname.startsWith("/api");

    // If path is protected and token is missing → redirect to login
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Prevent redirecting back to /auth/login if already there
    if (pathname === "/auth/login" && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|favicon.ico).*)"],
};
