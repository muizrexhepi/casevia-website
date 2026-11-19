import { setupConvexAuthServer } from "@convex-dev/auth/ssr";
import { setupConvexAuthNextjs } from "@convex-dev/auth/ssr/nextjs";
import { api } from "@/convex/_generated/api";
const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://disconnected.convex.cloud";
export const authRoutes = setupConvexAuthServer({
  convexUrl,
  refreshSession: api.auth.refreshSession,
  signOut: api.auth.signOut,
  signIn: [api.auth.completeSignInWithGithub],
  cookieOptions: { secure: process.env.NODE_ENV === "production" },
});
export const { convexAuthNextjsProxy, ConvexAuthNextjsServerProvider } =
  setupConvexAuthNextjs({
    convexUrl,
    refreshSession: api.auth.refreshSession,
    isAuthenticated: api.auth.isAuthenticated,
  });
