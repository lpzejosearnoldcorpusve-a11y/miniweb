"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Map, AlertTriangle } from "lucide-react"
import { useUbicacionesEnTiempoReal } from "@/hooks/use-gps"
import { useAlertasActivas } from "@/hooks/use-alertas"

const GpsMapClient = dynamic(() => import("./gps-map-client").then((mod) => mod.GpsMapClient), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-lg bg-muted">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
})

interface GpsMapViewProps {
  selectedVehiculo: string | null
  onSelectVehiculo: (id: string | null) => void
  focusLocation?: { lat: number; lng: number } | null
}

export function GpsMapView({ selectedVehiculo, onSelectVehiculo, focusLocation }: GpsMapViewProps) {
  const { vehiculosEnMapa, isLoading } = useUbicacionesEnTiempoReal()
  const { alertasActivas } = useAlertasActivas()

  // Get alert locations for map markers
  const alertLocations = alertasActivas.map((alerta) => ({
    id: alerta.id,
    lat: alerta.latitud,
    lng: alerta.longitud,
    severidad: alerta.severidad,
    mensaje: alerta.mensaje,
    placa: alerta.vehiculo?.placa || "Desconocido",
  }))

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Map className="h-4 w-4 text-primary" />
          Mapa de Seguimiento
          <span className="ml-auto flex items-center gap-2">
            {alertasActivas.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {alertasActivas.length} alerta(s)
              </Badge>
            )}
            <span className="text-xs font-normal text-muted-foreground">
              {vehiculosEnMapa.length} vehículo(s) activo(s)
            </span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && vehiculosEnMapa.length === 0 ? (
          <div className="flex h-[500px] items-center justify-center rounded-lg bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <GpsMapClient
            vehiculos={vehiculosEnMapa}
            selectedVehiculo={selectedVehiculo}
            onSelectVehiculo={onSelectVehiculo}
            focusLocation={focusLocation}
            alertLocations={alertLocations}
          />
        )}
      </CardContent>
    </Card>
  )
}
