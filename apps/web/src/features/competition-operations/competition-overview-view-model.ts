import type {
  CompetitionOverviewCollection,
  CompetitionOverviewItem,
} from "@padel/schemas";
import type {
  InlineMetadataItem,
  KeyValueSummaryItem,
  TableRowState,
} from "@padel/ui";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const formatLabelMap: Record<CompetitionOverviewItem["format"], string> = {
  elimination: "Elimination",
  league: "League",
  "round-robin": "Round robin",
};

const statusLabelMap: Record<CompetitionOverviewItem["status"], string> = {
  closed: "Closed",
  draft: "Draft",
  open: "Open",
};

export interface CompetitionOverviewRowViewModel {
  id: string;
  metadataItems: InlineMetadataItem[];
  nextActionLabel: string;
  operationsSummary: string;
  rowState: TableRowState;
  scheduleLabel: string;
  statusLabel: string;
  title: string;
}

export interface CompetitionOverviewPageViewModel {
  attentionMessage: string | null;
  generatedAtLabel: string;
  rows: CompetitionOverviewRowViewModel[];
  summaryItems: KeyValueSummaryItem[];
}

function formatScheduleWindow(startsAt: string, endsAt: string) {
  return `${dateFormatter.format(new Date(startsAt))} to ${dateFormatter.format(new Date(endsAt))}`;
}

function summarizeOperations(item: CompetitionOverviewItem) {
  return `Owned by ${item.owner.name} • ${statusLabelMap[item.status]} competition`;
}

function selectNextActionLabel(item: CompetitionOverviewItem) {
  if (item.status === "draft") {
    return "Complete setup before opening registrations";
  }

  if (item.status === "open") {
    return "Review registrations and keep operations moving";
  }

  return "Inspect final competition record";
}

function selectRowState(item: CompetitionOverviewItem): TableRowState {
  if (item.status === "draft") {
    return "warning";
  }

  if (item.status === "open") {
    return "selected";
  }

  return "completed";
}

export function mapCompetitionOverviewToPageModel(
  response: CompetitionOverviewCollection,
): CompetitionOverviewPageViewModel {
  const totals = response.reduce(
    (accumulator, item: CompetitionOverviewItem) => ({
      closed: accumulator.closed + Number(item.status === "closed"),
      draft: accumulator.draft + Number(item.status === "draft"),
      open: accumulator.open + Number(item.status === "open"),
    }),
    {
      closed: 0,
      draft: 0,
      open: 0,
    },
  );

  const attentionMessage =
    totals.draft > 0
      ? `${totals.draft} competitions are still in draft and need setup before operators can rely on them.`
      : totals.open > 0
        ? `${totals.open} active competition overviews are open for daily operations follow-up.`
        : null;

  return {
    attentionMessage,
    generatedAtLabel: "Live collection response",
    rows: response.map((item: CompetitionOverviewItem) => ({
      id: item.id,
      metadataItems: [
        {
          label: "Format",
          value: formatLabelMap[item.format],
        },
        {
          label: "Status",
          tone: item.status === "draft" ? "warning" : "default",
          value: statusLabelMap[item.status],
        },
        {
          label: "Owner",
          value: item.owner.name,
        },
        {
          label: "Contact",
          value: item.owner.email,
        },
      ],
      nextActionLabel: selectNextActionLabel(item),
      operationsSummary: summarizeOperations(item),
      rowState: selectRowState(item),
      scheduleLabel: formatScheduleWindow(item.startsAt, item.endsAt),
      statusLabel: statusLabelMap[item.status],
      title: item.title,
    })),
    summaryItems: [
      {
        label: "Competitions in view",
        value: String(response.length),
      },
      {
        label: "Draft",
        tone: totals.draft > 0 ? "warning" : "default",
        value: String(totals.draft),
      },
      {
        label: "Open",
        tone: totals.open > 0 ? "warning" : "default",
        value: String(totals.open),
      },
      {
        label: "Closed",
        tone: totals.closed > 0 ? "success" : "default",
        value: String(totals.closed),
      },
      {
        label: "Transport shape",
        tone: "muted",
        value: "Competition overview collection",
      },
    ],
  };
}
