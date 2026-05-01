import {
  Button,
  EmptyState,
  EmptyStateDescription,
  EmptyStateEyebrow,
  EmptyStateTitle,
  InlineAlert,
  InlineAlertDescription,
  InlineAlertTitle,
  InlineMetadataList,
  KeyValueSummaryBlock,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@padel/ui";
import { Link } from "@tanstack/react-router";
import type { CompetitionOverviewPageViewModel } from "./competition-overview-view-model.js";

interface CompetitionOperationsScreenProps {
  model: CompetitionOverviewPageViewModel;
}

export function CompetitionOperationsScreen({
  model,
}: CompetitionOperationsScreenProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_hsla(var(--accent)/0.75),_transparent_38%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)/0.52))] px-4 py-8 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.9),_rgba(231,242,236,0.95))] p-6 shadow-[0_20px_80px_rgba(33,72,53,0.08)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.34em] text-muted-foreground">
                Authenticated operations
              </p>
              <div className="space-y-3">
                <h1 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
                  Competition operations overview with route-owned loading and
                  shared admin display primitives.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  This first route scaffold keeps routing, query orchestration,
                  and DTO mapping in <code>apps/web</code> while the table,
                  summary, and feedback surfaces stay reusable in{" "}
                  <code>packages/ui</code>.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/competitions/operations">
                    Refresh operations view
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/sign-in">View sign-in boundary</Link>
                </Button>
              </div>
            </div>

            <KeyValueSummaryBlock
              columns={1}
              description="Operational trust comes from making missing data and blocked workflows visible before detail editing starts."
              heading="Snapshot"
              items={model.summaryItems}
            />
          </div>
        </section>

        {model.attentionMessage ? (
          <InlineAlert variant="warning">
            <InlineAlertTitle variant="warning">
              Route-critical issues surfaced at the overview boundary
            </InlineAlertTitle>
            <InlineAlertDescription>
              {model.attentionMessage}
            </InlineAlertDescription>
          </InlineAlert>
        ) : null}

        {model.rows.length === 0 ? (
          <EmptyState className="max-w-none bg-white/85" variant="info">
            <EmptyStateEyebrow>Competition operations</EmptyStateEyebrow>
            <EmptyStateTitle>
              No competitions need operational review yet.
            </EmptyStateTitle>
            <EmptyStateDescription>
              Once authenticated competition data is available, this route will
              promote the highest-risk items here without turning the shared UI
              package into a workflow-specific screen.
            </EmptyStateDescription>
          </EmptyState>
        ) : (
          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <TableHead scope="col">Competition</TableHead>
                  <TableHead scope="col">Schedule</TableHead>
                  <TableHead scope="col">Operations</TableHead>
                  <TableHead scope="col">Next action</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {model.rows.map((row) => (
                  <TableRow key={row.id} state={row.rowState}>
                    <TableCell className="space-y-3">
                      <div className="space-y-1">
                        <p className="font-serif text-xl leading-none tracking-tight">
                          {row.title}
                        </p>
                        <p className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground">
                          {row.statusLabel}
                        </p>
                      </div>
                      <InlineMetadataList
                        className="border-border/60 bg-background/70"
                        items={row.metadataItems}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {row.scheduleLabel}
                    </TableCell>
                    <TableCell>{row.operationsSummary}</TableCell>
                    <TableCell className="font-medium">
                      {row.nextActionLabel}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                Shared UI owns the table foundation. App space owns route data,
                risk mapping, and future drill-in actions.
              </TableCaption>
            </Table>
          </TableContainer>
        )}

        <p className="px-1 font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Overview generated {model.generatedAtLabel}
        </p>
      </div>
    </main>
  );
}
