import { sampleContractSummary } from "@padel/api-client";
import { sharedPingContract } from "@padel/schemas";
import { uiPackageMarker } from "@padel/ui";

export function App() {
  return (
    <main>
      <h1>Padel monorepo foundation</h1>
      <p>{uiPackageMarker}</p>
      <p>{sampleContractSummary()}</p>
      <p>Shared schema status: {sharedPingContract.shape.status.value}</p>
    </main>
  );
}
