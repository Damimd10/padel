import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import { workspaceName } from "../src/index.js";

describe("config package baseline", () => {
  it("exposes shared workspace metadata", () => {
    expect(workspaceName).toContain("padel");
  });

  it("defines the shared ui tailwind preset", () => {
    const require = createRequire(import.meta.url);
    const preset = require("../tailwind-preset.cjs");

    expect(preset.theme.extend.colors.primary.DEFAULT).toBe(
      "hsl(var(--primary))",
    );
    expect(preset.theme.extend.borderRadius.lg).toBe("var(--radius)");
  });
});
