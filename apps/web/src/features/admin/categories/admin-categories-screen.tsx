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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@padel/ui";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  FolderKanban,
  MoreHorizontal,
  Plus,
  Search,
  Trophy,
  Users,
} from "lucide-react";

const CATEGORY_COLORS = [
  "bg-blue-500",
  "bg-amber-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-teal-500",
] as const;

interface CategoryCard {
  id: string;
  name: string;
  description: string;
  players: number;
  teams: number;
  activeTournaments: number;
  totalTournaments: number;
  color: (typeof CATEGORY_COLORS)[number];
}

const categories: CategoryCard[] = [
  {
    id: "1",
    name: "Open",
    description: "All skill levels welcome",
    players: 245,
    teams: 82,
    activeTournaments: 3,
    totalTournaments: 12,
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "Professional",
    description: "Advanced players only",
    players: 86,
    teams: 28,
    activeTournaments: 2,
    totalTournaments: 8,
    color: "bg-amber-500",
  },
  {
    id: "3",
    name: "Amateur",
    description: "Beginner to intermediate players",
    players: 312,
    teams: 104,
    activeTournaments: 4,
    totalTournaments: 15,
    color: "bg-green-500",
  },
  {
    id: "4",
    name: "Junior",
    description: "Players under 18 years old",
    players: 78,
    teams: 26,
    activeTournaments: 1,
    totalTournaments: 6,
    color: "bg-purple-500",
  },
  {
    id: "5",
    name: "Masters 40+",
    description: "Players 40 years and above",
    players: 64,
    teams: 21,
    activeTournaments: 1,
    totalTournaments: 5,
    color: "bg-orange-500",
  },
  {
    id: "6",
    name: "Women",
    description: "Women only tournaments",
    players: 98,
    teams: 33,
    activeTournaments: 2,
    totalTournaments: 7,
    color: "bg-pink-500",
  },
  {
    id: "7",
    name: "Mixed Doubles",
    description: "Mixed gender teams",
    players: 156,
    teams: 52,
    activeTournaments: 2,
    totalTournaments: 9,
    color: "bg-cyan-500",
  },
];

export function AdminCategoriesScreen() {
  const totalPlayers = categories.reduce((acc, cat) => acc + cat.players, 0);
  const totalTeams = categories.reduce((acc, cat) => acc + cat.teams, 0);
  const activeTournaments = categories.reduce(
    (acc, cat) => acc + cat.activeTournaments,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage tournament categories and player classifications
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/categories/create">
            <Plus className="mr-2 size-4" />
            Create Category
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <FolderKanban className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlayers}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
            <p className="text-xs text-muted-foreground">Registered teams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Tournaments
            </CardTitle>
            <Trophy className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTournaments}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className={`h-2 ${category.color}`} />
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/categories/${category.id}`}>
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/categories/${category.id}/edit`}>
                        Edit Category
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>View Players</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Delete Category
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Players</p>
                  <p className="text-2xl font-bold">{category.players}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Teams</p>
                  <p className="text-2xl font-bold">{category.teams}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Active Tournaments
                  </span>
                  <span className="font-medium">
                    {category.activeTournaments} / {category.totalTournaments}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${category.color}`}
                    style={{
                      width: `${(category.activeTournaments / category.totalTournaments) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/admin/categories/${category.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link
                    to={`/admin/tournaments/create?category=${category.id}`}
                  >
                    New Tournament
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories Overview</CardTitle>
          <CardDescription>Detailed view of all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search categories..." className="pl-9" />
            </div>
          </div>

          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Total Tournaments</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`size-3 rounded-full ${category.color}`}
                        />
                        <Link
                          to={`/admin/categories/${category.id}`}
                          className="font-medium hover:underline"
                        >
                          {category.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.description}
                    </TableCell>
                    <TableCell>{category.players}</TableCell>
                    <TableCell>{category.teams}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {category.activeTournaments}
                      </Badge>
                    </TableCell>
                    <TableCell>{category.totalTournaments}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/categories/${category.id}`}>
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/categories/${category.id}/edit`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}
