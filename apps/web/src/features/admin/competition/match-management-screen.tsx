import {
  completeMatchRequestSchema,
  scheduleMatchRequestSchema,
} from "@padel/schemas";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  EmptyStateDescription,
  EmptyStateEyebrow,
  EmptyStateTitle,
  Field,
  InlineAlert,
  InlineAlertDescription,
  InlineAlertTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableEmptyState,
  TableHead,
  TableHeader,
  TableRow,
} from "@padel/ui";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import type { MatchManagementViewModel } from "./match-view-model.js";

interface MatchManagementScreenProps {
  model: MatchManagementViewModel;
  onGenerateMatches: () => Promise<void>;
  onScheduleMatch: (matchId: string, scheduledAt: string) => Promise<void>;
  onStartMatch: (matchId: string) => Promise<void>;
  onCompleteMatch: (
    matchId: string,
    scoreA: number,
    scoreB: number,
  ) => Promise<void>;
  onCancelMatch: (matchId: string) => Promise<void>;
  isGenerating: boolean;
  isScheduling: boolean;
  isStarting: boolean;
  isCompleting: boolean;
  isCancelling: boolean;
  error: string | null;
  clearError: () => void;
}

export function MatchManagementScreen({
  model,
  onGenerateMatches,
  onScheduleMatch,
  onStartMatch,
  onCompleteMatch,
  onCancelMatch,
  isGenerating,
  isScheduling,
  isStarting,
  isCompleting,
  isCancelling,
  error,
  clearError,
}: MatchManagementScreenProps) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [schedulingMatch, setSchedulingMatch] = useState<{ id: string } | null>(
    null,
  );
  const [completingMatch, setCompletingMatch] = useState<{ id: string } | null>(
    null,
  );
  const [cancellingMatch, setCancellingMatch] = useState<{ id: string } | null>(
    null,
  );

  const scheduleForm = useForm({
    defaultValues: { scheduledAt: "" },
    validators: {
      onChange: scheduleMatchRequestSchema,
      onBlur: scheduleMatchRequestSchema,
      onSubmit: scheduleMatchRequestSchema,
    },
    onSubmit: async ({ value }) => {
      if (!schedulingMatch) return;
      await onScheduleMatch(schedulingMatch.id, value.scheduledAt);
      setScheduleOpen(false);
    },
  });

  const completeForm = useForm({
    defaultValues: { scoreA: 0, scoreB: 0 },
    validators: {
      onChange: completeMatchRequestSchema,
      onBlur: completeMatchRequestSchema,
      onSubmit: completeMatchRequestSchema,
    },
    onSubmit: async ({ value }) => {
      if (!completingMatch) return;
      await onCompleteMatch(completingMatch.id, value.scoreA, value.scoreB);
      setCompleteOpen(false);
    },
  });

  function openSchedule(match: { id: string }) {
    setSchedulingMatch(match);
    scheduleForm.reset();
    setScheduleOpen(true);
    clearError();
  }

  function openComplete(match: { id: string }) {
    setCompletingMatch(match);
    completeForm.reset();
    setCompleteOpen(true);
    clearError();
  }

  function openCancel(match: { id: string }) {
    setCancellingMatch(match);
    setCancelOpen(true);
    clearError();
  }

  function handleCancelConfirm() {
    if (!cancellingMatch) return;
    onCancelMatch(cancellingMatch.id).then(() => {
      setCancellingMatch(null);
      setCancelOpen(false);
    });
  }

  function getStatusBadge(status: string) {
    const variantMap: Record<string, "default" | "secondary" | "outline"> = {
      scheduled: "outline",
      in_progress: "default",
      completed: "secondary",
      cancelled: "outline",
    };
    const labelMap: Record<string, string> = {
      scheduled: "Scheduled",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return (
      <Badge variant={variantMap[status] ?? "default"}>
        {labelMap[status] ?? status}
      </Badge>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Matches</h1>
          <p className="text-muted-foreground">
            Manage competition matches, schedule dates, and record results.
          </p>
        </div>
        <Button
          onClick={async () => {
            clearError();
            await onGenerateMatches();
          }}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Matches"}
        </Button>
      </div>

      {error && (
        <InlineAlert variant="blocked">
          <InlineAlertTitle variant="blocked">
            Operation failed
          </InlineAlertTitle>
          <InlineAlertDescription>{error}</InlineAlertDescription>
        </InlineAlert>
      )}

      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Match List</CardTitle>
          <CardDescription>
            All matches for this competition. Use the actions to schedule,
            start, complete, or cancel matches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!model.hasMatches ? (
            <EmptyState variant="info">
              <EmptyStateEyebrow>Matches</EmptyStateEyebrow>
              <EmptyStateTitle>No matches yet</EmptyStateTitle>
              <EmptyStateDescription>
                Generate matches from approved registrations to get started.
              </EmptyStateDescription>
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    clearError();
                    await onGenerateMatches();
                  }}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Matches"}
                </Button>
              </div>
            </EmptyState>
          ) : (
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead scope="col">Player A</TableHead>
                    <TableHead scope="col">Player B</TableHead>
                    <TableHead scope="col">Status</TableHead>
                    <TableHead scope="col">Scheduled</TableHead>
                    <TableHead scope="col">Score</TableHead>
                    <TableHead scope="col" className="w-64">
                      Actions
                    </TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {model.matches.map((match) => (
                    <TableRow key={match.id} state={match.rowState}>
                      <TableCell>
                        <p className="font-medium">
                          {match.registrationAId.slice(0, 8)}...
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {match.registrationBId.slice(0, 8)}...
                        </p>
                      </TableCell>
                      <TableCell>{getStatusBadge(match.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {match.scheduledAt
                          ? new Date(match.scheduledAt).toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {match.scoreA != null && match.scoreB != null
                          ? `${match.scoreA} - ${match.scoreB}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {match.status === "scheduled" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openSchedule({ id: match.id })}
                              >
                                Schedule
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => onStartMatch(match.id)}
                                disabled={isStarting}
                              >
                                {isStarting ? "Starting..." : "Start"}
                              </Button>
                            </>
                          )}
                          {match.status === "in_progress" && (
                            <Button
                              size="sm"
                              onClick={() => openComplete({ id: match.id })}
                              disabled={isCompleting}
                            >
                              {isCompleting ? "Completing..." : "Complete"}
                            </Button>
                          )}
                          {match.status !== "completed" &&
                            match.status !== "cancelled" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openCancel({ id: match.id })}
                                disabled={isCancelling}
                              >
                                {isCancelling ? "Cancelling..." : "Cancel"}
                              </Button>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      <Dialog
        open={scheduleOpen}
        onOpenChange={(open) => {
          setScheduleOpen(open);
          if (!open) setSchedulingMatch(null);
        }}
      >
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scheduleForm.handleSubmit();
            }}
          >
            <DialogHeader>
              <DialogTitle>Schedule match</DialogTitle>
              <DialogDescription>
                Set the date and time for this match.
              </DialogDescription>
            </DialogHeader>
            <CardContent className="space-y-4 pt-4">
              <scheduleForm.Field name="scheduledAt">
                {(field) => (
                  <Field
                    id="schedule-date"
                    label="Date and time"
                    required
                    error={getFieldError(field.state.meta.errors)}
                  >
                    <Input
                      type="datetime-local"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </scheduleForm.Field>
            </CardContent>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isScheduling}>
                {isScheduling ? "Scheduling..." : "Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog
        open={completeOpen}
        onOpenChange={(open) => {
          setCompleteOpen(open);
          if (!open) setCompletingMatch(null);
        }}
      >
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              completeForm.handleSubmit();
            }}
          >
            <DialogHeader>
              <DialogTitle>Complete match</DialogTitle>
              <DialogDescription>
                Enter the final score for this match.
              </DialogDescription>
            </DialogHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex gap-4">
                <completeForm.Field name="scoreA">
                  {(field) => (
                    <Field
                      id="score-a"
                      label="Player A score"
                      required
                      error={getFieldError(field.state.meta.errors)}
                    >
                      <Input
                        type="number"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        min={0}
                      />
                    </Field>
                  )}
                </completeForm.Field>
                <completeForm.Field name="scoreB">
                  {(field) => (
                    <Field
                      id="score-b"
                      label="Player B score"
                      required
                      error={getFieldError(field.state.meta.errors)}
                    >
                      <Input
                        type="number"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        min={0}
                      />
                    </Field>
                  )}
                </completeForm.Field>
              </div>
            </CardContent>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isCompleting}>
                {isCompleting ? "Completing..." : "Complete"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        open={cancelOpen}
        onOpenChange={(open) => {
          setCancelOpen(open);
          if (!open) setCancellingMatch(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel match</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this match? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="outline"
              disabled={isCancelling}
              onClick={handleCancelConfirm}
            >
              {isCancelling ? "Cancelling..." : "Cancel Match"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getFieldError(errors: unknown[]): string {
  return errors
    .map((err) => {
      if (typeof err === "string") return err;
      if (err && typeof err === "object" && "message" in err) {
        return String((err as { message: unknown }).message);
      }
      return "";
    })
    .filter(Boolean)
    .join(", ");
}
