"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createTeleferico } from "@/lib/actions/transport"
import { toast } from "sonner"
import MapWrapper from "@/components/maps/map-wrapper"
import { Trash2 } from "lucide-react"

interface Station {
  nombre: string
  lat: number
  lng: number
  orden: number
}

export function TelefericoForm({ onSuccess }: { onSuccess: () => void }) {
  const [nombre, setNombre] = useState("")
  const [color, setColor] = useState("#000000")
  const [stations, setStations] = useState<Station[]>([])
  const [isPending, startTransition] = useTransition()

  // Temporary state for adding a station
  const [tempStationName, setTempStationName] = useState("")
  const [tempStationPoint, setTempStationPoint] = useState<{ lat: number; lng: number } | null>(null)

  const handleMapClick = (lat: number, lng: number) => {
    setTempStationPoint({ lat, lng })
  }

  const addStation = () => {
    if (!tempStationName || !tempStationPoint) return

    const newStation: Station = {
      nombre: tempStationName,
      lat: tempStationPoint.lat,
      lng: tempStationPoint.lng,
      orden: stations.length + 1,
    }

    setStations([...stations, newStation])
    setTempStationName("")
    setTempStationPoint(null)
  }

  const removeStation = (index: number) => {
    const newStations = stations.filter((_, i) => i !== index)
    // Reorder
    newStations.forEach((s, i) => (s.orden = i + 1))
    setStations(newStations)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (stations.length < 2) {
      toast.error("Debe agregar al menos 2 estaciones")
      return
    }

    startTransition(async () => {
      const result = await createTeleferico({ nombre, color }, stations)

      if (result.success) {
        toast.success("Línea de teleférico creada correctamente")
        onSuccess()
      } else {
        toast.error("Error al crear la línea")
      }
    })
  }

  return (
    <div className="grid gap-6 py-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la Línea</Label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Línea Roja"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Color Identificativo</Label>
          <div className="flex gap-2">
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="#000000" />
          </div>
        </div>

        <div className="space-y-2 border p-4 rounded-md bg-slate-50">
          <h3 className="font-semibold text-sm">Agregar Estación</h3>
          <p className="text-xs text-muted-foreground">
            1. Seleccione un punto en el mapa. 2. Ingrese nombre. 3. Agregar.
          </p>

          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Nombre de la estación"
              value={tempStationName}
              onChange={(e) => setTempStationName(e.target.value)}
            />
            <Button onClick={addStation} disabled={!tempStationName || !tempStationPoint}>
              Agregar
            </Button>
          </div>
          {tempStationPoint && (
            <p className="text-xs text-green-600">
              Punto seleccionado: {tempStationPoint.lat.toFixed(4)}, {tempStationPoint.lng.toFixed(4)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Estaciones Agregadas ({stations.length})</Label>
          <div className="max-h-[200px] overflow-y-auto space-y-2 border rounded-md p-2">
            {stations.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border text-sm">
                <span>
                  {s.orden}. {s.nombre}
                </span>
                <Button variant="ghost" size="icon" onClick={() => removeStation(idx)} className="h-6 w-6 text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {stations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No hay estaciones</p>
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isPending || !nombre}
          className="w-full bg-[#6A0DAD] hover:bg-[#580b91]"
        >
          {isPending ? "Guardando..." : "Guardar Línea Completa"}
        </Button>
      </div>

      <div className="h-[400px] lg:h-auto rounded-md overflow-hidden border">
        <MapWrapper
          mode="edit"
          onMapClick={handleMapClick}
          points={stations.map((s) => ({ lat: s.lat, lng: s.lng, order: s.orden }))}
          // Also show the temporary point if selected
          route={[]}
          center={tempStationPoint ? [tempStationPoint.lat, tempStationPoint.lng] : [-16.5, -68.1193]}
        />
        {tempStationPoint && <div className="hidden">marker at temp point</div>}
      </div>
    </div>
  )
}
