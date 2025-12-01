"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bus, MapPin, Gauge, Wifi, Plus, Loader2 } from "lucide-react"
import { useVehiculos } from "@/hooks/use-gps"
import { useState } from "react"
import { VehiculoFormDialog } from "./vehiculo-form-dialog"
import { cn } from "@/lib/utils"

interface GpsVehiculosListProps {
  selectedVehiculo: string | null
  onSelectVehiculo: (id: string | null) => void
}

export function GpsVehiculosList({ selectedVehiculo, onSelectVehiculo }: GpsVehiculosListProps) {
  const { vehiculos, isLoading } = useVehiculos()
  const [showForm, setShowForm] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{vehiculos.length} vehículo(s) registrado(s)</p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Agregar
        </Button>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {vehiculos.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Bus className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No hay vehículos registrados</p>
                <Button variant="link" size="sm" onClick={() => setShowForm(true)}>
                  Agregar primer vehículo
                </Button>
              </CardContent>
            </Card>
          ) : (
            vehiculos.map((vehiculo) => (
              <Card
                key={vehiculo.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedVehiculo === vehiculo.id && "ring-2 ring-primary",
                )}
                onClick={() => onSelectVehiculo(vehiculo.id === selectedVehiculo ? null : vehiculo.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Bus className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{vehiculo.placa}</p>
                        <p className="text-xs text-muted-foreground">{vehiculo.linea}</p>
                      </div>
                    </div>
                    <Badge variant={vehiculo.estado === "activo" ? "default" : "secondary"} className="text-xs">
                      {vehiculo.estado}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>GPS</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Gauge className="h-3 w-3" />
                      <span>0 km/h</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Wifi className="h-3 w-3" />
                      <span>Online</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <VehiculoFormDialog open={showForm} onOpenChange={setShowForm} />
    </div>
  )
}
