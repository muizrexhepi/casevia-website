import { setupConvexAuth } from "@convex-dev/auth/server";
import { setupGithub } from "@convex-dev/auth/methods/github/server";
import { components, internal } from "./_generated/api";
const core = setupConvexAuth({
  component: components.auth,
  sessionMaxLifetimeSeconds: 604800,
});
export const { signOut, refreshSession, isAuthenticated } = core;
export const { startSignInWithGithub, completeSignInWithGithub } = setupGithub(
  core,
  {
    component: components.authGithub,
    allowedRedirectOrigins: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://crm.muizrexhepi.com",
      ...(process.env.CRM_PREVIEW_ORIGIN
        ? [process.env.CRM_PREVIEW_ORIGIN]
        : []),
    ],
  },
).attachUserCallbacks({
  createUser: internal.users.createOwner,
  onSignIn: internal.users.checkOwner,
});
