import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    environment: "node",
    server: {
      deps: {
        inline: [
          "@convex-dev/auth",
          "@convex-dev/workpool",
          "@convex-dev/batch-worker",
        ],
      },
    },
  },
});
