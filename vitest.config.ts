import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

function resolveJsToTs() {
  return {
    name: "resolve-js-to-ts",
    resolveId(id: string, importer: string | undefined) {
      if (
        id.endsWith(".js") &&
        importer &&
        !id.startsWith("@") &&
        !id.startsWith(".")
      ) {
        return null;
      }
      if (id.endsWith(".js") && importer) {
        const resolved = path.resolve(path.dirname(importer), id);
        const tsPath = resolved.replace(/\.js$/, ".ts");
        return tsPath;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [tsconfigPaths(), resolveJsToTs()],
  resolve: {
    alias: {
      "@padel/api-client": path.resolve(
        __dirname,
        "packages/api-client/src/index.ts",
      ),
      "@padel/schemas": path.resolve(
        __dirname,
        "packages/schemas/src/index.ts",
      ),
      "@padel/ui": path.resolve(__dirname, "packages/ui/src/index.ts"),
      "@padel/ui/styles.css": path.resolve(
        __dirname,
        "packages/ui/src/styles.css",
      ),
    },
  },
  esbuild: {
    target: "ES2022",
  },
});
