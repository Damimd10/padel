import { getApiContractVersion } from "./contracts.js";

export function describeApiBootstrap() {
  return `api bootstrap ${getApiContractVersion()}`;
}
