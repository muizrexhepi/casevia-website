import { NextResponse, type NextRequest } from "next/server";
import { convexAuthNextjsProxy } from "@/lib/crm/auth-server";
const authProxy = convexAuthNextjsProxy((request) => {
  const host = request.nextUrl.hostname;
  const isCrm =
    request.nextUrl.pathname.startsWith("/crm") ||
    host === "crm.muizrexhepi.com";
  if (
    host === "crm.muizrexhepi.com" &&
    !request.nextUrl.pathname.startsWith("/crm") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.includes(".")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/crm${url.pathname === "/" ? "" : url.pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
  const response = NextResponse.next();
  if (isCrm) {
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Referrer-Policy", "same-origin");
  }
  return response;
});
export async function proxy(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) return NextResponse.next();
  if (
    request.nextUrl.hostname !== "crm.muizrexhepi.com" &&
    !request.nextUrl.pathname.startsWith("/crm") &&
    !request.nextUrl.pathname.startsWith("/auth")
  )
    return NextResponse.next();
  return authProxy(request);
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
