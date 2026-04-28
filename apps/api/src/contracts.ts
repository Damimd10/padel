import { sharedPingContract } from "@padel/schemas";

export function getApiContractVersion() {
  return sharedPingContract.shape.version.value;
}
