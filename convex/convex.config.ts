import { defineApp } from "convex/server";
import auth from "@convex-dev/auth/convex.config";
import github from "@convex-dev/auth/components/github/convex.config";
import workpool from "@convex-dev/workpool/convex.config";
import { v } from "convex/values";
const app = defineApp({
  env: { AUTH_GITHUB_ID: v.string(), AUTH_GITHUB_SECRET: v.string() },
});
app.use(auth);
app.use(github, {
  name: "authGithub",
  httpPrefix: "/oauth/github",
  env: {
    CLIENT_ID: app.env.AUTH_GITHUB_ID,
    CLIENT_SECRET: app.env.AUTH_GITHUB_SECRET,
  },
});
app.use(workpool, { name: "aiPool" });
app.use(workpool, { name: "emailPool" });
export default app;
