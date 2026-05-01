import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@padel/api-client": path.resolve(
        __dirname,
        "packages/api-client/src/index.ts",
      ),
      "@padel/schemas": path.resolve(__dirname, "packages/schemas/src/index.ts"),
      "@padel/ui": path.resolve(__dirname, "packages/ui/src/index.ts"),
      "@padel/ui/styles.css": path.resolve(
        __dirname,
        "packages/ui/src/styles.css",
      ),
    },
  },
});
