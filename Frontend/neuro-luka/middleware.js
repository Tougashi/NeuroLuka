import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Hanya terapkan middleware pada route yang membutuhkan autentikasi
export const config = {
  matcher: [
    "/riwayat/:path*",
    "/profil/:path*",
  ],
};

// Middleware hanya akan dijalankan pada route yang sesuai dengan matcher
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
); 