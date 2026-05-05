import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@padel/ui";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Info, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  type CreateCompetitionFormValues,
  createCompetitionFormSchema,
} from "./create-competition-schema.js";

interface CreateCompetitionScreenProps {
  onSubmit: (values: CreateCompetitionFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const categories = [
  {
    id: "1ra",
    name: "Primera",
    description: "Nivel profesional/elite",
    color: "bg-amber-500",
  },
  {
    id: "2da",
    name: "Segunda",
    description: "Nivel avanzado alto",
    color: "bg-amber-400",
  },
  {
    id: "3ra",
    name: "Tercera",
    description: "Nivel avanzado",
    color: "bg-orange-500",
  },
  {
    id: "4ta",
    name: "Cuarta",
    description: "Nivel intermedio alto",
    color: "bg-orange-400",
  },
  {
    id: "5ta",
    name: "Quinta",
    description: "Nivel intermedio",
    color: "bg-blue-500",
  },
  {
    id: "6ta",
    name: "Sexta",
    description: "Nivel intermedio bajo",
    color: "bg-blue-400",
  },
  {
    id: "7ma",
    name: "Septima",
    description: "Nivel principiante alto",
    color: "bg-green-500",
  },
  {
    id: "8va",
    name: "Octava",
    description: "Nivel principiante",
    color: "bg-green-400",
  },
  {
    id: "9na",
    name: "Novena",
    description: "Nivel iniciacion",
    color: "bg-emerald-500",
  },
  {
    id: "open",
    name: "Open",
    description: "Todas las categorias",
    color: "bg-purple-500",
  },
];

const divisions = [
  {
    id: "masculino",
    name: "Masculino",
    icon: "M",
    description: "Division masculina",
  },
  {
    id: "femenino",
    name: "Femenino",
    icon: "F",
    description: "Division femenina",
  },
  { id: "mixto", name: "Mixto", icon: "X", description: "Parejas mixtas" },
];

const courts = [
  { id: "1", name: "Court 1", type: "Indoor" },
  { id: "2", name: "Court 2", type: "Indoor" },
  { id: "3", name: "Court 3", type: "Outdoor" },
  { id: "4", name: "Court 4", type: "Outdoor" },
];

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

export function CreateCompetitionScreen({
  onSubmit,
  isSubmitting,
}: CreateCompetitionScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [format, setFormat] = useState<string>("");

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      format: undefined as "elimination" | "round-robin" | "league" | undefined,
      startsAt: "",
      endsAt: "",
      regStartsAt: "",
      regEndsAt: "",
      maxTeams: 16,
      pricePerTeam: 0,
      isPublic: true,
      requiresApproval: false,
      hasWaitlist: true,
      groupCount: 4,
      teamsPerGroup: 4,
      setsToWin: 2,
      gamesPerSet: 6,
      tiebreakPoints: 7,
      goldenPoint: false,
      matchDurationMinutes: 60,
      courts: [],
      firstMatchTime: "09:00",
      lastMatchTime: "21:00",
      breakBetweenMatchesMinutes: 15,
      autoGenerateSchedule: true,
      earlyBirdDiscount: 0,
      isFreeEntry: false,
      prizes: [
        { place: "1er Lugar", amount: 2500 },
        { place: "2do Lugar", amount: 1500 },
        { place: "3er Lugar", amount: 750 },
        { place: "4to Lugar", amount: 250 },
      ],
    } as CreateCompetitionFormValues,
    validators: {
      onChange: createCompetitionFormSchema,
      onBlur: createCompetitionFormSchema,
      onSubmit: createCompetitionFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const toggleCourt = (courtId: string) => {
    const currentCourts = form.getFieldValue("courts");
    const court = courts.find((c) => c.id === courtId);
    if (!court) return;

    const isSelected = currentCourts.some((c) => c.name === court.name);
    const newCourts = isSelected
      ? currentCourts.filter((c) => c.name !== court.name)
      : [...currentCourts, { name: court.name, type: court.type }];
    form.setFieldValue("courts", newCourts);
  };

  const totalPrizePool = form
    .getFieldValue("prizes")
    .reduce(
      (sum: number, prize: { place: string; amount: number }) =>
        sum + prize.amount,
      0,
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/competitions">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Create Competition
          </h1>
          <p className="text-muted-foreground">
            Set up a new competition for your club
          </p>
        </div>
        <Button variant="outline">Save as Draft</Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => form.handleSubmit()}
        >
          <Save className="mr-2 size-4" />
          {isSubmitting ? "Creating..." : "Create Competition"}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Informacion Basica</TabsTrigger>
          <TabsTrigger value="format">Formato y Reglas</TabsTrigger>
          <TabsTrigger value="schedule">Horarios y Canchas</TabsTrigger>
          <TabsTrigger value="prizes">Premios e Inscripcion</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informacion del Torneo</CardTitle>
              <CardDescription>Detalles basicos de tu torneo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <form.Field name="title">
                  {(field) => (
                    <Field
                      label="Nombre del Torneo"
                      error={getFieldError(field.state.meta.errors)}
                    >
                      <Input
                        id="name"
                        placeholder="ej., Torneo de Verano 2024"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="description">
                  {(field) => (
                    <Field
                      label="Descripcion"
                      error={getFieldError(field.state.meta.errors)}
                    >
                      <Textarea
                        id="description"
                        placeholder="Describe tu torneo, reglas e informacion especial..."
                        rows={4}
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </Field>
                  )}
                </form.Field>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <Field label="Categoria">
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Seleccionar categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`size-2 rounded-full ${cat.color}`}
                                />
                                <span>{cat.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  - {cat.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <div>
                    <Field label="Division">
                      <Select
                        value={selectedDivision}
                        onValueChange={setSelectedDivision}
                      >
                        <SelectTrigger id="division">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {divisions.map((div) => (
                            <SelectItem key={div.id} value={div.id}>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`flex size-5 items-center justify-center rounded-full text-xs font-bold ${
                                    div.id === "masculino"
                                      ? "bg-blue-100 text-blue-700"
                                      : div.id === "femenino"
                                        ? "bg-pink-100 text-pink-700"
                                        : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {div.icon}
                                </span>
                                <span>{div.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <form.Field name="maxTeams">
                    {(field) => (
                      <Field
                        label="Maximo de Parejas"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <Select
                          value={String(field.state.value ?? 16)}
                          onValueChange={(v) =>
                            field.handleChange(Number.parseInt(v))
                          }
                        >
                          <SelectTrigger id="maxTeams">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8">8 parejas</SelectItem>
                            <SelectItem value="16">16 parejas</SelectItem>
                            <SelectItem value="24">24 parejas</SelectItem>
                            <SelectItem value="32">32 parejas</SelectItem>
                            <SelectItem value="64">64 parejas</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="pricePerTeam">
                    {(field) => (
                      <Field
                        label="Inscripcion por Pareja"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            id="pricePerTeam"
                            type="number"
                            className="pl-7"
                            placeholder="0"
                            value={String(field.state.value ?? 0)}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            onBlur={field.handleBlur}
                          />
                        </div>
                      </Field>
                    )}
                  </form.Field>
                </div>

                {/* Selected Category & Division Preview */}
                {(selectedCategory || selectedDivision) && (
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Torneo configurado:
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedCategory && (
                        <Badge variant="secondary" className="text-sm">
                          <span
                            className={`mr-1.5 size-2 rounded-full ${
                              categories.find((c) => c.id === selectedCategory)
                                ?.color
                            }`}
                          />
                          {
                            categories.find((c) => c.id === selectedCategory)
                              ?.name
                          }
                        </Badge>
                      )}
                      {selectedDivision && (
                        <Badge variant="outline" className="text-sm">
                          {
                            divisions.find((d) => d.id === selectedDivision)
                              ?.name
                          }
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <form.Field name="startsAt">
                    {(field) => (
                      <Field
                        label="Fecha de Inicio"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <Input
                          id="startDate"
                          type="date"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="endsAt">
                    {(field) => (
                      <Field
                        label="Fecha de Fin"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <Input
                          id="endDate"
                          type="date"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </Field>
                    )}
                  </form.Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <form.Field name="regStartsAt">
                    {(field) => (
                      <Field
                        label="Apertura de Inscripciones"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <Input
                          id="regStart"
                          type="date"
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="regEndsAt">
                    {(field) => (
                      <Field
                        label="Cierre de Inscripciones"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <Input
                          id="regEnd"
                          type="date"
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </Field>
                    )}
                  </form.Field>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibilidad e Inscripcion</CardTitle>
              <CardDescription>
                Controla quien puede ver e inscribirse en este torneo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.Field name="isPublic">
                {(field) => (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Torneo Publico</Label>
                      <p className="text-sm text-muted-foreground">
                        Cualquiera puede ver e inscribirse en este torneo
                      </p>
                    </div>
                    <Switch
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="requiresApproval">
                {(field) => (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Requiere Aprobacion</Label>
                      <p className="text-sm text-muted-foreground">
                        Las parejas necesitan aprobacion del admin para
                        participar
                      </p>
                    </div>
                    <Switch
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="hasWaitlist">
                {(field) => (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Lista de Espera</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite que parejas se unan a una lista de espera cuando
                        este lleno
                      </p>
                    </div>
                    <Switch
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                  </div>
                )}
              </form.Field>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Format & Rules Tab */}
        <TabsContent value="format" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Formato del Torneo</CardTitle>
              <CardDescription>
                Elige como se estructurara el torneo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <TooltipProvider>
                  <button
                    type="button"
                    className={`cursor-pointer rounded-lg border-2 p-4 text-left transition-all hover:border-primary ${
                      format === "elimination"
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => {
                      setFormat("elimination");
                      form.setFieldValue("format", "elimination");
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">Eliminacion Directa</h3>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Bracket de eliminacion simple. Pierdes una vez y
                            quedas fuera.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bracket de eliminacion desde el inicio hasta el final
                    </p>
                    {format === "elimination" && (
                      <Badge className="mt-2">Seleccionado</Badge>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`cursor-pointer rounded-lg border-2 p-4 text-left transition-all hover:border-primary ${
                      format === "round-robin"
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => {
                      setFormat("round-robin");
                      form.setFieldValue("format", "round-robin");
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">Fase de Grupos</h3>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Los equipos juegan en grupos, los mejores avanzan a
                            eliminacion.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Grupos todos contra todos seguido de eliminacion directa
                    </p>
                    {format === "round-robin" && (
                      <Badge className="mt-2">Seleccionado</Badge>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`cursor-pointer rounded-lg border-2 p-4 text-left transition-all hover:border-primary ${
                      format === "league" ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => {
                      setFormat("league");
                      form.setFieldValue("format", "league");
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">Americano</h3>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Todas las parejas juegan multiples partidos, los
                            puntos determinan el seeding.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Todos contra todos, luego finales de eliminacion
                    </p>
                    {format === "league" && (
                      <Badge className="mt-2">Seleccionado</Badge>
                    )}
                  </button>
                </TooltipProvider>
              </div>

              {format === "round-robin" && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="mb-4 font-medium">Configuracion de Grupos</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <form.Field name="groupCount">
                      {(field) => (
                        <Field
                          label="Numero de Grupos"
                          error={getFieldError(field.state.meta.errors)}
                        >
                          <Select
                            value={String(field.state.value ?? 4)}
                            onValueChange={(v) =>
                              field.handleChange(Number.parseInt(v))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 Grupos</SelectItem>
                              <SelectItem value="4">4 Grupos</SelectItem>
                              <SelectItem value="8">8 Grupos</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    </form.Field>

                    <form.Field name="teamsPerGroup">
                      {(field) => (
                        <Field
                          label="Parejas por Grupo"
                          error={getFieldError(field.state.meta.errors)}
                        >
                          <Select
                            value={String(field.state.value ?? 4)}
                            onValueChange={(v) =>
                              field.handleChange(Number.parseInt(v))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 Parejas</SelectItem>
                              <SelectItem value="4">4 Parejas</SelectItem>
                              <SelectItem value="5">5 Parejas</SelectItem>
                              <SelectItem value="6">6 Parejas</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    </form.Field>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Capacidad total:{" "}
                    {(form.getFieldValue("groupCount") ?? 4) *
                      (form.getFieldValue("teamsPerGroup") ?? 4)}{" "}
                    parejas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reglas de Partido</CardTitle>
              <CardDescription>
                Define como se juegan y puntuan los partidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <form.Field name="setsToWin">
                    {(field) => (
                      <Field
                        label="Sets para Ganar"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <Select
                          value={String(field.state.value ?? 2)}
                          onValueChange={(v) =>
                            field.handleChange(Number.parseInt(v))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Al mejor de 1</SelectItem>
                            <SelectItem value="2">Al mejor de 3</SelectItem>
                            <SelectItem value="3">Al mejor de 5</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="gamesPerSet">
                    {(field) => (
                      <Field
                        label="Games por Set"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <Select
                          value={String(field.state.value ?? 6)}
                          onValueChange={(v) =>
                            field.handleChange(Number.parseInt(v))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4">4 games</SelectItem>
                            <SelectItem value="6">6 games</SelectItem>
                            <SelectItem value="9">
                              9 games (super set)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </form.Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <form.Field name="tiebreakPoints">
                    {(field) => (
                      <Field
                        label="Reglas de Tiebreak"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <Select
                          value={String(field.state.value ?? 7)}
                          onValueChange={(v) =>
                            field.handleChange(Number.parseInt(v))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">
                              Estandar (7 puntos)
                            </SelectItem>
                            <SelectItem value="10">
                              Super tiebreak (10 puntos)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="goldenPoint">
                    {(field) => (
                      <Field
                        label="Punto de Oro"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <Select
                          value={field.state.value ? "yes" : "no"}
                          onValueChange={(v) => field.handleChange(v === "yes")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Habilitado</SelectItem>
                            <SelectItem value="no">Deshabilitado</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </form.Field>
                </div>

                <form.Field name="matchDurationMinutes">
                  {(field) => (
                    <Field
                      label="Duracion del Partido (minutos)"
                      error={getFieldError(field.state.meta.errors)}
                      description="Duracion estimada para propositos de programacion"
                    >
                      <Input
                        type="number"
                        value={String(field.state.value ?? 60)}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        onBlur={field.handleBlur}
                      />
                    </Field>
                  )}
                </form.Field>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule & Courts Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Canchas Disponibles</CardTitle>
              <CardDescription>
                Selecciona que canchas pueden usarse para este torneo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {courts.map((court) => {
                  const currentCourts = form.getFieldValue("courts");
                  const isSelected = currentCourts.some(
                    (c) => c.name === court.name,
                  );

                  return (
                    <button
                      type="button"
                      key={court.id}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 text-left transition-all hover:border-primary ${
                        isSelected ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => toggleCourt(court.id)}
                    >
                      <div>
                        <h4 className="font-medium">{court.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {court.type}
                        </p>
                      </div>
                      <Switch
                        checked={isSelected}
                        onCheckedChange={() => toggleCourt(court.id)}
                      />
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuracion de Horarios</CardTitle>
              <CardDescription>
                Configura las preferencias de programacion de partidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <form.Field name="firstMatchTime">
                    {(field) => (
                      <Field
                        label="Hora del Primer Partido"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <Input
                          type="time"
                          value={field.state.value ?? "09:00"}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="lastMatchTime">
                    {(field) => (
                      <Field
                        label="Hora del Ultimo Partido"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <Input
                          type="time"
                          value={field.state.value ?? "21:00"}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </Field>
                    )}
                  </form.Field>
                </div>

                <form.Field name="breakBetweenMatchesMinutes">
                  {(field) => (
                    <Field
                      label="Descanso Entre Partidos (minutos)"
                      error={getFieldError(field.state.meta.errors)}
                    >
                      <Input
                        type="number"
                        value={String(field.state.value ?? 15)}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        onBlur={field.handleBlur}
                      />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="autoGenerateSchedule">
                  {(field) => (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-generar Horario</Label>
                        <p className="text-sm text-muted-foreground">
                          Crear automaticamente el horario de partidos
                        </p>
                      </div>
                      <Switch
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked)
                        }
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prizes & Fees Tab */}
        <TabsContent value="prizes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cuota de Inscripcion</CardTitle>
              <CardDescription>
                Establece la cuota de entrada para las parejas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <form.Field name="pricePerTeam">
                    {(field) => (
                      <Field
                        label="Cuota por Pareja"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            className="pl-7"
                            value={String(field.state.value ?? 0)}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            onBlur={field.handleBlur}
                          />
                        </div>
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="earlyBirdDiscount">
                    {(field) => (
                      <Field
                        label="Descuento por Inscripcion Anticipada"
                        error={getFieldError(field.state.meta.errors)}
                      >
                        <div className="relative">
                          <Input
                            type="number"
                            value={String(field.state.value ?? 0)}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                            onBlur={field.handleBlur}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            %
                          </span>
                        </div>
                      </Field>
                    )}
                  </form.Field>
                </div>

                <form.Field name="isFreeEntry">
                  {(field) => (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Entrada Gratuita</Label>
                        <p className="text-sm text-muted-foreground">
                          Sin cuota de inscripcion requerida
                        </p>
                      </div>
                      <Switch
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked)
                        }
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bolsa de Premios</CardTitle>
                <CardDescription>
                  Define los premios para los ganadores
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 size-4" />
                Agregar Premio
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {form
                  .getFieldValue("prizes")
                  .map(
                    (
                      item: { place: string; amount: number },
                      index: number,
                    ) => (
                      <div
                        key={`${item.place}-${index}`}
                        className="flex items-center gap-4 rounded-lg border p-4"
                      >
                        <div className="flex-1">
                          <Input defaultValue={item.place} />
                        </div>
                        <div className="relative w-32">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            className="pl-7"
                            defaultValue={String(item.amount)}
                          />
                        </div>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="size-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ),
                  )}
              </div>
              <div className="mt-4 flex justify-between rounded-lg bg-muted p-4">
                <span className="font-medium">Total Bolsa de Premios</span>
                <span className="font-bold">
                  ${totalPrizePool.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
