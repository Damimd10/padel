import { sharedPingContract } from "@padel/schemas";

export function getWebContractVersion() {
  return sharedPingContract.shape.version.value;
}
