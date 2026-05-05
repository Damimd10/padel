import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@padel/ui";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { CompetitionOverviewPageViewModel } from "./competition-overview-view-model.js";

interface CompetitionOperationsScreenProps {
  model: CompetitionOverviewPageViewModel;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "outline";
      icon: React.ReactNode;
    }
  > = {
    open: {
      label: "In Progress",
      variant: "default",
      icon: <Play className="size-3" />,
    },
    draft: {
      label: "Draft",
      variant: "outline",
      icon: <Pause className="size-3" />,
    },
    closed: {
      label: "Completed",
      variant: "outline",
      icon: <CheckCircle2 className="size-3" />,
    },
    cancelled: {
      label: "Cancelled",
      variant: "secondary",
      icon: <Clock className="size-3" />,
    },
  };

  const { label, variant, icon } = config[status] || config.draft;

  return (
    <Badge variant={variant} className="gap-1 font-medium">
      {icon}
      {label}
    </Badge>
  );
}

function FormatBadge({ format }: { format: string }) {
  const formatLabelMap: Record<string, string> = {
    elimination: "Elimination",
    "round-robin": "Round Robin",
    league: "League",
  };

  return (
    <Badge variant="outline" className="font-normal">
      {formatLabelMap[format] || format}
    </Badge>
  );
}

const formatOptions = [
  { value: "elimination", label: "Elimination" },
  { value: "round-robin", label: "Round Robin" },
  { value: "league", label: "League" },
];

const statusOptions = [
  { value: "open", label: "In Progress" },
  { value: "draft", label: "Draft" },
  { value: "closed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function CompetitionOperationsScreen({
  model,
}: CompetitionOperationsScreenProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");

  const filteredRows = model.rows.filter((row) => {
    const matchesSearch =
      search === "" ||
      row.title.toLowerCase().includes(search.toLowerCase()) ||
      row.statusLabel.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      row.statusLabel.toLowerCase() === statusFilter.toLowerCase();

    const formatValue =
      row.metadataItems.find((m) => m.label === "Format")?.value ?? "";
    const matchesFormat =
      formatFilter === "all" ||
      String(formatValue).toLowerCase() === formatFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesFormat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitions</h1>
          <p className="text-muted-foreground">
            Manage and organize your club competitions
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/competitions/create">
            <Plus className="mr-2 size-4" />
            Create Competition
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Competitions
            </CardTitle>
            <Trophy className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {model.summaryItems[0]?.value || "0"}
            </div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Play className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {model.summaryItems[2]?.value || "0"}
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Pause className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {model.summaryItems[1]?.value || "0"}
            </div>
            <p className="text-xs text-muted-foreground">Pending setup</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {model.summaryItems[3]?.value || "0"}
            </div>
            <p className="text-xs text-muted-foreground">Finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Competitions</CardTitle>
          <CardDescription>
            View and manage all competitions in your club
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search competitions..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={formatFilter} onValueChange={setFormatFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  {formatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="size-4" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-visible rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competition</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Prize</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">
                        No competitions found matching your filters.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row) => {
                    const formatValue = String(
                      row.metadataItems.find((m) => m.label === "Format")
                        ?.value ?? "",
                    );

                    return (
                      <TableRow key={row.id}>
                        <TableCell>
                          <div>
                            <Link
                              to="/admin/competitions/$competitionId"
                              params={{ competitionId: row.id }}
                              className="font-medium hover:underline"
                            >
                              {row.title}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {row.scheduleLabel}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <FormatBadge format={formatValue} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {row.categoryNames.length > 0 ? (
                              row.categoryNames.map((name) => (
                                <Badge key={name} variant="secondary">
                                  {name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={row.statusLabel.toLowerCase()} />
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {row.registrationCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={
                                row.statusLabel.toLowerCase() === "closed"
                                  ? 100
                                  : row.statusLabel.toLowerCase() === "open"
                                    ? 50
                                    : 0
                              }
                              className="h-2 w-16"
                            />
                            <span className="text-sm text-muted-foreground">
                              {row.statusLabel.toLowerCase() === "closed"
                                ? "100%"
                                : row.statusLabel.toLowerCase() === "open"
                                  ? "50%"
                                  : "0%"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {row.prizePool > 0
                            ? `$${row.prizePool.toLocaleString()}`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-50">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  to="/admin/competitions/$competitionId"
                                  params={{ competitionId: row.id }}
                                >
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  to="/admin/competitions/$competitionId/matches"
                                  params={{ competitionId: row.id }}
                                >
                                  Manage Matches
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete Competition
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
