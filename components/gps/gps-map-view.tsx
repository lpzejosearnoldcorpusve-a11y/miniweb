"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Map } from "lucide-react"
import { useUbicacionesEnTiempoReal } from "@/hooks/use-gps"

const GpsMapClient = dynamic(() => import("./gps-map-client"), {
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
}

export function GpsMapView({ selectedVehiculo, onSelectVehiculo }: GpsMapViewProps) {
  const { vehiculosEnMapa, isLoading } = useUbicacionesEnTiempoReal()

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Map className="h-4 w-4 text-primary" />
          Mapa de Seguimiento
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {vehiculosEnMapa.length} vehículo(s) activo(s)
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
          />
        )}
      </CardContent>
    </Card>
  )
}
