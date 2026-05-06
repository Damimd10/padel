"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Check,
  Palette,
  Info,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

const predefinedCategories = [
  { id: "1ra", name: "Primera", level: 1, description: "Nivel profesional/elite" },
  { id: "2da", name: "Segunda", level: 2, description: "Nivel avanzado alto" },
  { id: "3ra", name: "Tercera", level: 3, description: "Nivel avanzado" },
  { id: "4ta", name: "Cuarta", level: 4, description: "Nivel intermedio alto" },
  { id: "5ta", name: "Quinta", level: 5, description: "Nivel intermedio" },
  { id: "6ta", name: "Sexta", level: 6, description: "Nivel intermedio bajo" },
  { id: "7ma", name: "Séptima", level: 7, description: "Nivel principiante alto" },
  { id: "8va", name: "Octava", level: 8, description: "Nivel principiante" },
  { id: "9na", name: "Novena", level: 9, description: "Nivel iniciación" },
  { id: "open", name: "Open", level: 0, description: "Todas las categorías" },
]

const divisions = [
  { id: "masculino", name: "Masculino", icon: "M", description: "División masculina" },
  { id: "femenino", name: "Femenino", icon: "F", description: "División femenina" },
  { id: "mixto", name: "Mixto", icon: "X", description: "Parejas mixtas" },
]

const colorOptions = [
  { name: "Azul", value: "bg-blue-500", preview: "bg-blue-500" },
  { name: "Verde", value: "bg-green-500", preview: "bg-green-500" },
  { name: "Amarillo", value: "bg-amber-500", preview: "bg-amber-500" },
  { name: "Naranja", value: "bg-orange-500", preview: "bg-orange-500" },
  { name: "Rojo", value: "bg-red-500", preview: "bg-red-500" },
  { name: "Rosa", value: "bg-pink-500", preview: "bg-pink-500" },
  { name: "Púrpura", value: "bg-purple-500", preview: "bg-purple-500" },
  { name: "Cyan", value: "bg-cyan-500", preview: "bg-cyan-500" },
  { name: "Esmeralda", value: "bg-emerald-500", preview: "bg-emerald-500" },
  { name: "Índigo", value: "bg-indigo-500", preview: "bg-indigo-500" },
]

export default function CreateCategoryPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState("bg-blue-500")
  const [categoryName, setCategoryName] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")
  const [skillLevel, setSkillLevel] = useState("")

  const toggleDivision = (divisionId: string) => {
    setSelectedDivisions((prev) =>
      prev.includes(divisionId)
        ? prev.filter((d) => d !== divisionId)
        : [...prev, divisionId]
    )
  }

  const applyTemplate = (template: typeof predefinedCategories[0]) => {
    setSelectedTemplate(template.id)
    setCategoryName(template.name)
    setCategoryDescription(template.description)
    setSkillLevel(template.level.toString())
  }

  const getSelectedDivisionsText = () => {
    if (selectedDivisions.length === 0) return null
    return selectedDivisions
      .map((id) => divisions.find((d) => d.id === id)?.name)
      .join(", ")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Crear Categoría</h1>
          <p className="text-muted-foreground">
            Define una nueva categoría para clasificar jugadores y torneos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/categories">Cancelar</Link>
          </Button>
          <Button>Crear Categoría</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quick Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Plantillas Rápidas</CardTitle>
              <CardDescription>
                Selecciona una categoría predefinida o crea una personalizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {predefinedCategories.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className={`group relative rounded-lg border-2 p-3 text-center transition-all hover:border-primary hover:bg-primary/5 ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                  >
                    {selectedTemplate === template.id && (
                      <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" />
                      </div>
                    )}
                    <span className="text-lg font-bold">{template.id.toUpperCase()}</span>
                    <p className="mt-1 text-xs text-muted-foreground">{template.name}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Details */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Categoría</CardTitle>
              <CardDescription>
                Detalles básicos de la categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="name">Nombre de la Categoría</FieldLabel>
                    <Input
                      id="name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="ej., Primera, Open, etc."
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="shortCode">Código Corto</FieldLabel>
                    <Input
                      id="shortCode"
                      placeholder="ej., 1RA, 2DA, OPEN"
                      maxLength={5}
                      className="uppercase"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="description">Descripción</FieldLabel>
                  <Textarea
                    id="description"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="Describe el nivel de juego y requisitos de esta categoría..."
                    rows={3}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="skillLevel">
                      <span className="flex items-center gap-1">
                        Nivel de Habilidad
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="size-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                El nivel determina el orden de las categorías. 1 es el más alto (profesional), 9 es el más bajo (iniciación).
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                    </FieldLabel>
                    <Select value={skillLevel} onValueChange={setSkillLevel}>
                      <SelectTrigger id="skillLevel">
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Open (Todos los niveles)</SelectItem>
                        <SelectItem value="1">Nivel 1 - Profesional/Elite</SelectItem>
                        <SelectItem value="2">Nivel 2 - Avanzado Alto</SelectItem>
                        <SelectItem value="3">Nivel 3 - Avanzado</SelectItem>
                        <SelectItem value="4">Nivel 4 - Intermedio Alto</SelectItem>
                        <SelectItem value="5">Nivel 5 - Intermedio</SelectItem>
                        <SelectItem value="6">Nivel 6 - Intermedio Bajo</SelectItem>
                        <SelectItem value="7">Nivel 7 - Principiante Alto</SelectItem>
                        <SelectItem value="8">Nivel 8 - Principiante</SelectItem>
                        <SelectItem value="9">Nivel 9 - Iniciación</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Color de la Categoría</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setSelectedColor(color.value)}
                          className={`relative size-8 rounded-full ${color.preview} transition-transform hover:scale-110 ${
                            selectedColor === color.value
                              ? "ring-2 ring-primary ring-offset-2"
                              : ""
                          }`}
                          title={color.name}
                        >
                          {selectedColor === color.value && (
                            <Check className="absolute inset-0 m-auto size-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Divisions */}
          <Card>
            <CardHeader>
              <CardTitle>Divisiones Habilitadas</CardTitle>
              <CardDescription>
                Selecciona en qué divisiones estará disponible esta categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {divisions.map((division) => (
                  <div
                    key={division.id}
                    onClick={() => toggleDivision(division.id)}
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all hover:border-primary ${
                      selectedDivisions.includes(division.id)
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <div
                      className={`flex size-12 items-center justify-center rounded-full text-lg font-bold ${
                        division.id === "masculino"
                          ? "bg-blue-100 text-blue-700"
                          : division.id === "femenino"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {division.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{division.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {division.description}
                      </p>
                    </div>
                    <Switch
                      checked={selectedDivisions.includes(division.id)}
                      onCheckedChange={() => toggleDivision(division.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rules & Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Reglas y Requisitos</CardTitle>
              <CardDescription>
                Define requisitos específicos para esta categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="minRanking">Ranking Mínimo</FieldLabel>
                    <Input
                      id="minRanking"
                      type="number"
                      placeholder="Sin mínimo"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="maxRanking">Ranking Máximo</FieldLabel>
                    <Input
                      id="maxRanking"
                      type="number"
                      placeholder="Sin máximo"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="minAge">Edad Mínima</FieldLabel>
                    <Input
                      id="minAge"
                      type="number"
                      placeholder="Sin mínimo"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="maxAge">Edad Máxima</FieldLabel>
                    <Input
                      id="maxAge"
                      type="number"
                      placeholder="Sin máximo"
                    />
                  </Field>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Requiere Ranking Oficial</Label>
                      <p className="text-sm text-muted-foreground">
                        Los jugadores deben tener ranking oficial para inscribirse
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Permitir Cambio de Categoría</Label>
                      <p className="text-sm text-muted-foreground">
                        Los jugadores pueden subir o bajar de categoría según resultados
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Categoría Activa</Label>
                      <p className="text-sm text-muted-foreground">
                        La categoría estará disponible para nuevos torneos
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Preview */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
              <CardDescription>
                Así se verá la categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <div className={`h-3 ${selectedColor}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold">
                        {categoryName || "Nombre de Categoría"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {categoryDescription || "Descripción de la categoría"}
                      </p>
                    </div>
                    <div className={`size-3 rounded-full ${selectedColor}`} />
                  </div>

                  <div className="mt-4 space-y-3">
                    {skillLevel && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Nivel</span>
                        <Badge variant="secondary">
                          {skillLevel === "0" ? "Open" : `Nivel ${skillLevel}`}
                        </Badge>
                      </div>
                    )}

                    {selectedDivisions.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Divisiones</span>
                        <div className="flex gap-1">
                          {selectedDivisions.map((divId) => {
                            const div = divisions.find((d) => d.id === divId)
                            return (
                              <span
                                key={divId}
                                className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                                  divId === "masculino"
                                    ? "bg-blue-100 text-blue-700"
                                    : divId === "femenino"
                                      ? "bg-pink-100 text-pink-700"
                                      : "bg-purple-100 text-purple-700"
                                }`}
                              >
                                {div?.icon}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Jugadores</span>
                      <span className="font-medium">0</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Parejas</span>
                      <span className="font-medium">0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 space-y-2 rounded-lg bg-muted p-4">
                <h4 className="text-sm font-medium">Resumen</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    Categoría: <span className="font-medium text-foreground">{categoryName || "—"}</span>
                  </li>
                  <li>
                    Nivel: <span className="font-medium text-foreground">
                      {skillLevel ? (skillLevel === "0" ? "Open" : skillLevel) : "—"}
                    </span>
                  </li>
                  <li>
                    Divisiones: <span className="font-medium text-foreground">
                      {getSelectedDivisionsText() || "Ninguna"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/admin/categories">Cancelar</Link>
                </Button>
                <Button className="flex-1">Crear</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
