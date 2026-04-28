import { describe, expect, it } from "vitest";

import { getWebContractVersion } from "../src/contracts.js";

describe("web shared schema wiring", () => {
  it("consumes the shared schema package", () => {
    expect(getWebContractVersion()).toBe("0.0.0");
  });
});
