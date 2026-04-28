import { sharedPingContract } from "@padel/schemas";

export function sampleContractSummary() {
  const parsed = sharedPingContract.parse({ status: "ok", version: "0.0.0" });

  return `${parsed.status}:${parsed.version}`;
}
