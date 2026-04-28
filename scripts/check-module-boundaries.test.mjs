import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  formatViolations,
  runBoundaryCheck,
  validateProjectGraph,
} from "./check-module-boundaries.mjs";

function createGraph(overrides = {}) {
  const nodes = {
    "@padel/web": {},
    "@padel/api": {},
    "@padel/ui": {},
    "@padel/api-client": {},
    "@padel/schemas": {},
    "@padel/config": {},
    ...overrides.nodes,
  };

  const dependencies = {
    "@padel/web": [{ target: "@padel/ui" }, { target: "@padel/schemas" }],
    "@padel/api": [{ target: "@padel/schemas" }],
    "@padel/ui": [],
    "@padel/api-client": [{ target: "@padel/schemas" }],
    "@padel/schemas": [],
    "@padel/config": [],
    ...overrides.dependencies,
  };

  return {
    nodes,
    dependencies,
  };
}

describe("validateProjectGraph", () => {
  it("accepts the documented package boundary graph", () => {
    expect(validateProjectGraph(createGraph())).toEqual([]);
  });

  it("reports forbidden internal dependencies", () => {
    const violations = validateProjectGraph(
      createGraph({
        dependencies: {
          "@padel/web": [{ target: "@padel/ui" }, { target: "@padel/api" }],
        },
      }),
    );

    expect(violations).toHaveLength(1);
    expect(formatViolations(violations)).toContain(
      "Forbidden dependency: @padel/web -> @padel/api",
    );
  });
});

describe("runBoundaryCheck", () => {
  it("fails the CLI validation path when the graph violates boundaries", () => {
    const tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "padel-module-boundaries-"),
    );
    const graphPath = path.join(tempDir, "project-graph.json");

    fs.writeFileSync(
      graphPath,
      JSON.stringify({
        graph: createGraph({
          dependencies: {
            "@padel/api-client": [{ target: "@padel/web" }],
          },
        }),
      }),
      "utf8",
    );

    expect(() =>
      runBoundaryCheck({
        graphPath,
        shouldGenerateGraph: false,
      }),
    ).toThrowError(/@padel\/api-client -> @padel\/web/);
  });
});
