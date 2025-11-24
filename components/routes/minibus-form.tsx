"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MapWrapper from "@/components/maps/map-wrapper"
import { createTransport, createRoute } from "@/lib/actions/transport"
import { useRouter } from "next/navigation"
import { Undo2, Trash2 } from "lucide-react"

// Definimos la constante aquí para fácil configuración
const MAX_POINTS = 2500

interface Point {
  lat: number
  lng: number
  order?: number
}

interface MinibusFormProps {
  onSuccess?: () => void
}

export function MinibusForm({ onSuccess }: MinibusFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sindicato, setSindicato] = useState("")
  const [linea, setLinea] = useState("")
  const [routePoints, setRoutePoints] = useState<Point[]>([])

  const handleMapClick = (lat: number, lng: number, routeSegment?: Point[]) => {
    setRoutePoints((prev) => {
      // Verificamos contra el nuevo límite de 2500
      if (prev.length >= MAX_POINTS) {
        alert(`Máximo ${MAX_POINTS} puntos alcanzado. No se pueden agregar más puntos.`)
        return prev
      }
      
      if (routeSegment) {
        const newPoints = [...prev, ...routeSegment]
        // Si el segmento hace que se pase del límite, no lo agregamos (o podrías cortarlo)
        if (newPoints.length > MAX_POINTS) {
            alert(`No se puede agregar el tramo completo. El límite es ${MAX_POINTS} puntos.`)
            return prev
        }
        return newPoints
      } else {
        return [...prev, { lat, lng }]
      }
    })
  }

  const handleUndo = () => {
    setRoutePoints((prev) => prev.slice(0, -1))
  }

  const handleClear = () => {
    setRoutePoints([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (routePoints.length < 2) {
      alert("La ruta debe tener al menos 2 puntos.")
      return
    }

    setLoading(true)
    try {
      const transport = await createTransport({
        tipo: "minibus",
        sindicato: sindicato,
        linea: linea,
        rutaNombre: `Sindicato ${sindicato} - Línea ${linea}`,
      })

      if (!transport?.id) throw new Error("Error creating transport")

      await createRoute({
        transporte_id: transport.id,
        nombre: `Ruta Principal`,
        puntos: routePoints,
      })

      router.refresh()
      onSuccess?.()
      setSindicato("")
      setLinea("")
      setRoutePoints([])
    } catch (error) {
      console.error(error)
      alert("Error al guardar la ruta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 h-full">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Datos del Minibus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form id="minibus-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sindicato">Sindicato</Label>
              <Input
                id="sindicato"
                placeholder="Ej. Eduardo Avaroa"
                value={sindicato}
                onChange={(e) => setSindicato(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linea">Línea</Label>
              <Input
                id="linea"
                placeholder="Ej. 265"
                value={linea}
                onChange={(e) => setLinea(e.target.value)}
                required
              />
            </div>
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Puntos de Ruta: {routePoints.length}</div>
                {/* Ajusté la validación visual para que sea proporcional si quieres, o dejarlo en 30 como mínimo */}
                <div className={`text-xs font-bold ${routePoints.length >= 30 ? "text-green-600" : "text-amber-600"}`}>
                  {routePoints.length >= 30 ? "Válido" : "Mínimo 30"}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Haga clic en el mapa para trazar la ruta. Se acoplará automáticamente a las calles.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUndo}
                  disabled={routePoints.length === 0}
                >
                  <Undo2 className="mr-2 h-4 w-4" /> Deshacer
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleClear}
                  disabled={routePoints.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Limpiar
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <div className="p-6 mt-auto">
          <div className="mb-4 text-sm text-gray-600">
            {/* Actualizado visualmente el límite en el texto */}
            Puntos en la ruta: {routePoints.length} / 2-{MAX_POINTS} puntos
          </div>
          <Button type="submit" form="minibus-form" className="w-full" disabled={loading || routePoints.length < 2}>
            {loading ? "Guardando..." : "Guardar Ruta"}
          </Button>
        </div>
      </Card>

      <Card className="h-full overflow-hidden">
        <div className="h-full w-full">
          <MapWrapper mode="edit" route={routePoints} onMapClick={handleMapClick} zoom={14} transportType="minibus" />
        </div>
      </Card>
    </div>
  )
}