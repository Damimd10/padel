import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_GRAPH_PATH = ".nx/project-graph.json";

const PROJECT_CONSTRAINTS = {
  "@padel/web": {
    allowedTargets: [
      "@padel/api-client",
      "@padel/schemas",
      "@padel/ui",
      "@padel/config",
    ],
  },
  "@padel/api": {
    allowedTargets: ["@padel/schemas", "@padel/config"],
  },
  "@padel/ui": {
    allowedTargets: ["@padel/schemas", "@padel/config"],
  },
  "@padel/api-client": {
    allowedTargets: ["@padel/schemas", "@padel/config"],
  },
  "@padel/schemas": {
    allowedTargets: ["@padel/config"],
  },
  "@padel/config": {
    allowedTargets: [],
  },
};

export function validateProjectGraph(graph) {
  const nodes = graph?.nodes ?? {};
  const dependencies = graph?.dependencies ?? {};
  const violations = [];

  for (const [source, rule] of Object.entries(PROJECT_CONSTRAINTS)) {
    if (!nodes[source]) {
      violations.push({
        source,
        target: null,
        reason: "missing-project",
        allowedTargets: rule.allowedTargets,
      });
      continue;
    }

    for (const dependency of dependencies[source] ?? []) {
      const target = dependency.target;

      if (!nodes[target]) {
        continue;
      }

      if (!rule.allowedTargets.includes(target)) {
        violations.push({
          source,
          target,
          reason: "forbidden-dependency",
          allowedTargets: rule.allowedTargets,
        });
      }
    }
  }

  return violations;
}

export function formatViolations(violations) {
  return violations
    .map((violation) => {
      if (violation.reason === "missing-project") {
        return [
          `- Missing project in Nx graph: ${violation.source}`,
          "  Expected one of the documented workspace projects so boundary rules stay enforceable.",
        ].join("\n");
      }

      return [
        `- Forbidden dependency: ${violation.source} -> ${violation.target}`,
        `  Allowed targets: ${violation.allowedTargets.join(", ") || "(none)"}`,
        "  Fix the import or package dependency so it matches /docs/10-monorepo/package-boundaries.md.",
      ].join("\n");
    })
    .join("\n");
}

function parseArgs(argv) {
  let graphPath = DEFAULT_GRAPH_PATH;
  let shouldGenerateGraph = true;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--graph") {
      graphPath = argv[index + 1] ?? graphPath;
      shouldGenerateGraph = false;
      index += 1;
      continue;
    }

    if (arg === "--skip-generate") {
      shouldGenerateGraph = false;
    }
  }

  return {
    graphPath,
    shouldGenerateGraph,
  };
}

function generateGraph(graphPath) {
  const resolvedGraphPath = path.resolve(graphPath);
  fs.mkdirSync(path.dirname(resolvedGraphPath), { recursive: true });

  execFileSync("pnpm", ["exec", "nx", "graph", "--file", resolvedGraphPath], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NX_BASE: "HEAD",
      NX_HEAD: "HEAD",
    },
    stdio: "inherit",
  });
}

function readGraph(graphPath) {
  const graphFile = JSON.parse(fs.readFileSync(graphPath, "utf8"));
  return graphFile.graph;
}

export function runBoundaryCheck(options = {}) {
  const graphPath = options.graphPath ?? DEFAULT_GRAPH_PATH;

  if (options.shouldGenerateGraph ?? true) {
    generateGraph(graphPath);
  }

  const graph = readGraph(graphPath);
  const violations = validateProjectGraph(graph);

  if (violations.length > 0) {
    const message = [
      "Module boundary enforcement failed.",
      formatViolations(violations),
    ].join("\n\n");

    throw new Error(message);
  }

  return {
    graphPath,
    projectCount: Object.keys(graph.nodes ?? {}).length,
  };
}

const isDirectExecution =
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (isDirectExecution) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const result = runBoundaryCheck(options);

    console.log(
      `Module boundaries validated for ${result.projectCount} workspace projects.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
