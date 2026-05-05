"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Plus, Trash2, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
Tooltip,
TooltipContent,
TooltipProvider,
TooltipTrigger,
} from "@/components/ui/tooltip"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

const categories = [
{ id: "1ra", name: "Primera", description: "Nivel profesional/elite", color: "bg-amber-500" },
{ id: "2da", name: "Segunda", description: "Nivel avanzado alto", color: "bg-amber-400" },
{ id: "3ra", name: "Tercera", description: "Nivel avanzado", color: "bg-orange-500" },
{ id: "4ta", name: "Cuarta", description: "Nivel intermedio alto", color: "bg-orange-400" },
{ id: "5ta", name: "Quinta", description: "Nivel intermedio", color: "bg-blue-500" },
{ id: "6ta", name: "Sexta", description: "Nivel intermedio bajo", color: "bg-blue-400" },
{ id: "7ma", name: "Séptima", description: "Nivel principiante alto", color: "bg-green-500" },
{ id: "8va", name: "Octava", description: "Nivel principiante", color: "bg-green-400" },
{ id: "9na", name: "Novena", description: "Nivel iniciación", color: "bg-emerald-500" },
{ id: "open", name: "Open", description: "Todas las categorías", color: "bg-purple-500" },
]

const divisions = [
{ id: "masculino", name: "Masculino", icon: "M", description: "División masculina" },
{ id: "femenino", name: "Femenino", icon: "F", description: "División femenina" },
{ id: "mixto", name: "Mixto", icon: "X", description: "Parejas mixtas" },
]

const courts = [
{ id: "1", name: "Court 1", type: "Indoor" },
{ id: "2", name: "Court 2", type: "Indoor" },
{ id: "3", name: "Court 3", type: "Outdoor" },
{ id: "4", name: "Court 4", type: "Outdoor" },
]

export default function CreateTournamentPage() {
const [format, setFormat] = useState<string>("")
const [groupCount, setGroupCount] = useState(4)
const [teamsPerGroup, setTeamsPerGroup] = useState(4)
const [selectedCourts, setSelectedCourts] = useState<string[]>([])
const [selectedCategory, setSelectedCategory] = useState<string>("")
const [selectedDivision, setSelectedDivision] = useState<string>("")

const toggleCourt = (courtId: string) => {
setSelectedCourts((prev) =>
prev.includes(courtId)
? prev.filter((id) => id !== courtId)
: [...prev, courtId]
)
}

return (
<div className="space-y-6">
{/_ Header _/}
<div className="flex items-center gap-4">
<Button variant="ghost" size="icon" asChild>
<Link href="/admin/tournaments">
<ArrowLeft className="size-4" />
</Link>
</Button>
<div className="flex-1">
<h1 className="text-3xl font-bold tracking-tight">Create Tournament</h1>
<p className="text-muted-foreground">
Set up a new tournament for your club
</p>
</div>
<Button variant="outline">Save as Draft</Button>
<Button>
<Save className="mr-2 size-4" />
Create Tournament
</Button>
</div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="format">Formato y Reglas</TabsTrigger>
          <TabsTrigger value="schedule">Horarios y Canchas</TabsTrigger>
          <TabsTrigger value="prizes">Premios e Inscripción</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Torneo</CardTitle>
              <CardDescription>
                Detalles básicos de tu torneo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nombre del Torneo</FieldLabel>
                  <Input
                    id="name"
                    placeholder="ej., Torneo de Verano 2024"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">Descripción</FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Describe tu torneo, reglas e información especial..."
                    rows={4}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor="category">Categoría</FieldLabel>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <div className="flex items-center gap-2">
                              <span className={`size-2 rounded-full ${cat.color}`} />
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

                  <Field>
                    <FieldLabel htmlFor="division">División</FieldLabel>
                    <Select value={selectedDivision} onValueChange={setSelectedDivision}>
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="maxTeams">Máximo de Parejas</FieldLabel>
                    <Select defaultValue="16">
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

                  <Field>
                    <FieldLabel htmlFor="pricePerTeam">Inscripción por Pareja</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input id="pricePerTeam" type="number" className="pl-7" placeholder="0" />
                    </div>
                  </Field>
                </div>

                {/* Selected Category & Division Preview */}
                {(selectedCategory || selectedDivision) && (
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Torneo configurado:</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedCategory && (
                        <Badge variant="secondary" className="text-sm">
                          <span className={`mr-1.5 size-2 rounded-full ${categories.find(c => c.id === selectedCategory)?.color}`} />
                          {categories.find(c => c.id === selectedCategory)?.name}
                        </Badge>
                      )}
                      {selectedDivision && (
                        <Badge variant="outline" className="text-sm">
                          {divisions.find(d => d.id === selectedDivision)?.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="startDate">Fecha de Inicio</FieldLabel>
                    <Input id="startDate" type="date" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="endDate">Fecha de Fin</FieldLabel>
                    <Input id="endDate" type="date" />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="regStart">Apertura de Inscripciones</FieldLabel>
                    <Input id="regStart" type="date" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="regEnd">Cierre de Inscripciones</FieldLabel>
                    <Input id="regEnd" type="date" />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibilidad e Inscripción</CardTitle>
              <CardDescription>
                Controla quién puede ver e inscribirse en este torneo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Torneo Público</Label>
                  <p className="text-sm text-muted-foreground">
                    Cualquiera puede ver e inscribirse en este torneo
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Requiere Aprobación</Label>
                  <p className="text-sm text-muted-foreground">
                    Las parejas necesitan aprobación del admin para participar
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lista de Espera</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que parejas se unan a una lista de espera cuando esté lleno
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Format & Rules Tab */}
        <TabsContent value="format" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Formato del Torneo</CardTitle>
              <CardDescription>
                Elige cómo se estructurará el torneo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <TooltipProvider>
                  <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary ${
                      format === "knockout" ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setFormat("knockout")}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">Eliminación Directa</h3>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Bracket de eliminación simple. Pierdes una vez y quedas fuera.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bracket de eliminación desde el inicio hasta el final
                    </p>
                    {format === "knockout" && (
                      <Badge className="mt-2">Seleccionado</Badge>
                    )}
                  </div>

                  <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary ${
                      format === "groups" ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setFormat("groups")}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">Fase de Grupos</h3>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Los equipos juegan en grupos, los mejores avanzan a eliminación.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Grupos todos contra todos seguido de eliminación directa
                    </p>
                    {format === "groups" && (
                      <Badge className="mt-2">Seleccionado</Badge>
                    )}
                  </div>

                  <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary ${
                      format === "american" ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setFormat("american")}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">Americano</h3>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Todas las parejas juegan múltiples partidos, los puntos determinan el seeding.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Todos contra todos, luego finales de eliminación
                    </p>
                    {format === "american" && (
                      <Badge className="mt-2">Seleccionado</Badge>
                    )}
                  </div>
                </TooltipProvider>
              </div>

              {format === "groups" && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="mb-4 font-medium">Configuración de Grupos</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Número de Grupos</FieldLabel>
                      <Select
                        value={groupCount.toString()}
                        onValueChange={(v) => setGroupCount(parseInt(v))}
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
                    <Field>
                      <FieldLabel>Parejas por Grupo</FieldLabel>
                      <Select
                        value={teamsPerGroup.toString()}
                        onValueChange={(v) => setTeamsPerGroup(parseInt(v))}
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
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Capacidad total: {groupCount * teamsPerGroup} parejas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reglas de Partido</CardTitle>
              <CardDescription>
                Define cómo se juegan y puntúan los partidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Sets para Ganar</FieldLabel>
                    <Select defaultValue="2">
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
                  <Field>
                    <FieldLabel>Games por Set</FieldLabel>
                    <Select defaultValue="6">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 games</SelectItem>
                        <SelectItem value="6">6 games</SelectItem>
                        <SelectItem value="9">9 games (súper set)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Reglas de Tiebreak</FieldLabel>
                    <Select defaultValue="7">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Estándar (7 puntos)</SelectItem>
                        <SelectItem value="10">Súper tiebreak (10 puntos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Punto de Oro</FieldLabel>
                    <Select defaultValue="no">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Habilitado</SelectItem>
                        <SelectItem value="no">Deshabilitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Duración del Partido (minutos)</FieldLabel>
                  <Input type="number" defaultValue="60" />
                  <p className="text-sm text-muted-foreground">
                    Duración estimada para propósitos de programación
                  </p>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule & Courts Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Canchas Disponibles</CardTitle>
              <CardDescription>
                Selecciona qué canchas pueden usarse para este torneo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {courts.map((court) => (
                  <div
                    key={court.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:border-primary ${
                      selectedCourts.includes(court.id)
                        ? "border-primary bg-primary/5"
                        : ""
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
                      checked={selectedCourts.includes(court.id)}
                      onCheckedChange={() => toggleCourt(court.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de Horarios</CardTitle>
              <CardDescription>
                Configura las preferencias de programación de partidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Hora del Primer Partido</FieldLabel>
                    <Input type="time" defaultValue="09:00" />
                  </Field>
                  <Field>
                    <FieldLabel>Hora del Último Partido</FieldLabel>
                    <Input type="time" defaultValue="21:00" />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Descanso Entre Partidos (minutos)</FieldLabel>
                  <Input type="number" defaultValue="15" />
                </Field>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-generar Horario</Label>
                    <p className="text-sm text-muted-foreground">
                      Crear automáticamente el horario de partidos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prizes & Fees Tab */}
        <TabsContent value="prizes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cuota de Inscripción</CardTitle>
              <CardDescription>
                Establece la cuota de entrada para las parejas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Cuota por Pareja</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input type="number" className="pl-7" defaultValue="50" />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Descuento por Inscripción Anticipada</FieldLabel>
                    <div className="relative">
                      <Input type="number" defaultValue="10" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        %
                      </span>
                    </div>
                  </Field>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Entrada Gratuita</Label>
                    <p className="text-sm text-muted-foreground">
                      Sin cuota de inscripción requerida
                    </p>
                  </div>
                  <Switch />
                </div>
              </FieldGroup>
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
                {[
                  { place: "1er Lugar", prize: "$2,500" },
                  { place: "2do Lugar", prize: "$1,500" },
                  { place: "3er Lugar", prize: "$750" },
                  { place: "4to Lugar", prize: "$250" },
                ].map((item, index) => (
                  <div
                    key={index}
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
                        defaultValue={item.prize.replace("$", "").replace(",", "")}
                      />
                    </div>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between rounded-lg bg-muted p-4">
                <span className="font-medium">Total Bolsa de Premios</span>
                <span className="font-bold">$5,000</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

)
}
