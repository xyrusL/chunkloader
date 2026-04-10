import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SITE_DOMAIN } from "@/lib/site-config";

const LEGACY_HOSTS = new Set(["deze.me", "www.deze.me"]);

function getRequestHost(request: NextRequest): string {
  return (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();
}

function createNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

function createContentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
  ].join("; ");
}

function applySecurityHeaders(response: NextResponse, nonce: string) {
  response.headers.set("Content-Security-Policy", createContentSecurityPolicy(nonce));
  response.headers.set("Permissions-Policy", "camera=(), geolocation=(), microphone=(), payment=(), usb=()");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
}

export function proxy(request: NextRequest) {
  const host = getRequestHost(request);
  const nonce = createNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  if (!LEGACY_HOSTS.has(host)) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    applySecurityHeaders(response, nonce);
    return response;
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.protocol = "https";
  redirectUrl.host = SITE_DOMAIN;

  const response = NextResponse.redirect(redirectUrl, 308);
  applySecurityHeaders(response, nonce);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml)$).*)",
  ],
};
