import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SITE_DOMAIN } from "@/lib/site-config";

const LEGACY_HOSTS = new Set(["deze.me", "www.deze.me"]);

function getRequestHost(request: NextRequest): string {
  return (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();
}

export function proxy(request: NextRequest) {
  const host = getRequestHost(request);

  if (!LEGACY_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.protocol = "https";
  redirectUrl.host = SITE_DOMAIN;

  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml)$).*)",
  ],
};
