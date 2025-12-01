"use client"

import { MapPin, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUbicacionesEnTiempoReal } from "@/hooks/use-gps"

export function GpsMapHeader() {
  const { refresh, isLoading } = useUbicacionesEnTiempoReal()

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Mapa GPS en Tiempo Real</h1>
          <p className="text-sm text-muted-foreground">Seguimiento de vehículos y transacciones RFID</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-green-600">En vivo</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => refresh()} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>
    </div>
  )
}
