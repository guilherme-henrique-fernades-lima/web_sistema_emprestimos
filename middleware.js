import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const requestHeaders = new Headers(req.headers);
    const referer = requestHeaders.get("referer");

    if (req.url.startsWith("/api/") && !referer) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (token) {
          return true;
        } else {
          return false;
        }
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|public/|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.png$|.*\\.jpg$|.*\\.jpeg$).*)",
  ],
};
