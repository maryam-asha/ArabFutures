import { auth } from "@lib/auth";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const authMiddleware = auth.createMiddleware();

export default function proxy(req: NextRequest): NextResponse {
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  if (isDashboard) {
    return (authMiddleware as any)(req);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
