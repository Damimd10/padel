import { sampleContractSummary } from "@padel/api-client";
import { sharedPingContract } from "@padel/schemas";
import { Button } from "@padel/ui";

export function App() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-border bg-white/80 p-8 shadow-sm">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Padel monorepo foundation
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Shared UI foundation is now wired for reusable primitives.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            {sampleContractSummary()} Shared schema status:{" "}
            {sharedPingContract.shape.status.value}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button>Register players</Button>
          <Button variant="secondary">Review submissions</Button>
          <Button variant="outline">Plan Storybook rollout</Button>
        </div>
      </div>
    </main>
  );
}
