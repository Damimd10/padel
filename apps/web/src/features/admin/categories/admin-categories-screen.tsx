import type { GlobalCategoryCollection } from "@padel/schemas";
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
  FolderKanban,
  MoreHorizontal,
  Plus,
  Search,
  Trophy,
  Users,
} from "lucide-react";

interface AdminCategoriesScreenProps {
  categories: GlobalCategoryCollection;
}

const skillLevelLabels: Record<number, string> = {
  0: "Open",
  1: "Profesional",
  2: "Avanzado Alto",
  3: "Avanzado",
  4: "Intermedio Alto",
  5: "Intermedio",
  6: "Intermedio Bajo",
  7: "Principiante Alto",
  8: "Principiante",
  9: "Iniciacion",
};

export function AdminCategoriesScreen({
  categories,
}: AdminCategoriesScreenProps) {
  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">
            Gestiona las categorias de jugadores y torneos
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/categories/create">
            <Plus className="mr-2 size-4" />
            Crear Categoria
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categorias
            </CardTitle>
            <FolderKanban className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeCategories.length} activas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nivel Promedio
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length > 0
                ? (
                    categories.reduce((acc, c) => acc + c.skillLevel, 0) /
                    categories.length
                  ).toFixed(1)
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              De habilidad promedio
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Divisiones</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Masculino, Femenino, Mixto
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <Trophy className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCategories.length}</div>
            <p className="text-xs text-muted-foreground">
              Disponibles para torneos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="flex flex-col overflow-hidden">
            <div className={`h-2 ${category.color}`} />
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>
                    {category.description ||
                      skillLevelLabels[category.skillLevel]}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                    <DropdownMenuItem>Editar Categoria</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Eliminar Categoria
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nivel</p>
                  <p className="text-2xl font-bold leading-tight">
                    {skillLevelLabels[category.skillLevel] ??
                      category.skillLevel}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Codigo</p>
                  <p className="text-2xl font-bold">{category.shortCode}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Divisiones</span>
                  <div className="flex gap-1">
                    {category.divisions.map((div) => (
                      <span
                        key={div}
                        className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                          div === "masculino"
                            ? "bg-blue-100 text-blue-700"
                            : div === "femenino"
                              ? "bg-pink-100 text-pink-700"
                              : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {div === "masculino"
                          ? "M"
                          : div === "femenino"
                            ? "F"
                            : "X"}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estado</span>
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
              </div>

              <div className="mt-auto flex gap-2">
                <Button variant="outline" className="flex-1">
                  Ver Detalles
                </Button>
                <Button className="flex-1" asChild>
                  <Link to="/admin/competitions/create">Nuevo Torneo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderKanban className="mb-4 size-12 text-muted-foreground" />
              <CardTitle className="mb-2">No hay categorias</CardTitle>
              <CardDescription className="mb-4 text-center">
                Crea tu primera categoria para comenzar a organizar torneos
              </CardDescription>
              <Button asChild>
                <Link to="/admin/categories/create">
                  <Plus className="mr-2 size-4" />
                  Crear Categoria
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vista General de Categorias</CardTitle>
          <CardDescription>
            Vista detallada de todas las categorias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar categorias..." className="pl-9" />
            </div>
          </div>

          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Divisiones</TableHead>
                  <TableHead>Estado</TableHead>
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
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {category.shortCode}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {skillLevelLabels[category.skillLevel] ??
                          category.skillLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {category.divisions.map((div) => (
                          <span
                            key={div}
                            className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                              div === "masculino"
                                ? "bg-blue-100 text-blue-700"
                                : div === "femenino"
                                  ? "bg-pink-100 text-pink-700"
                                  : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {div === "masculino"
                              ? "M"
                              : div === "femenino"
                                ? "F"
                                : "X"}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                      >
                        {category.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Eliminar
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
