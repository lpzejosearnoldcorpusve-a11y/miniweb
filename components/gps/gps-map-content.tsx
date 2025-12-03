"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { GpsMapView } from "./gps-map-view"
import { GpsVehiculosList } from "./gps-vehiculos-list"
import { GpsTransaccionesList } from "./gps-transacciones-list"
import { GpsEstadisticas } from "./gps-estadisticas"
import { GpsAlertasPanel } from "./gps-alertas-panel"
import { GpsAsignacionDialog } from "./gps-asignacion-dialog"
import { GpsAsignacionesList } from "./gps-asignaciones-list"
import { Plus } from "lucide-react"
import type { AlertaConDetalles } from "@/types/alertas"

export function GpsMapContent() {
  const [selectedVehiculo, setSelectedVehiculo] = useState<string | null>(null)
  const [alertaFocus, setAlertaFocus] = useState<{ lat: number; lng: number } | null>(null)
  const [showAsignacionDialog, setShowAsignacionDialog] = useState(false)

  const handleAlertaClick = (alerta: AlertaConDetalles) => {
    // Focus map on alert location
    setAlertaFocus({ lat: alerta.latitud, lng: alerta.longitud })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Main Map Area - 3 columns */}
      <div className="lg:col-span-3 space-y-4">
        <GpsEstadisticas />
        <GpsMapView
          selectedVehiculo={selectedVehiculo}
          onSelectVehiculo={setSelectedVehiculo}
          focusLocation={alertaFocus}
        />
      </div>

      {/* Side Panel - 1 column */}
      <div className="space-y-4">
        {/* Alerts Panel */}
        <GpsAlertasPanel onAlertaClick={handleAlertaClick} />

        {/* Tabs for other content */}
        <Tabs defaultValue="vehiculos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
            <TabsTrigger value="asignaciones">Rutas</TabsTrigger>
            <TabsTrigger value="transacciones">Pagos</TabsTrigger>
          </TabsList>

          <TabsContent value="vehiculos" className="mt-4">
            <GpsVehiculosList selectedVehiculo={selectedVehiculo} onSelectVehiculo={setSelectedVehiculo} />
          </TabsContent>

          <TabsContent value="asignaciones" className="mt-4 space-y-4">
            <Button onClick={() => setShowAsignacionDialog(true)} className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Asignar Ruta a Vehículo
            </Button>
            <GpsAsignacionesList />
          </TabsContent>

          <TabsContent value="transacciones" className="mt-4">
            <GpsTransaccionesList vehiculoId={selectedVehiculo} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Assignment Dialog */}
      <GpsAsignacionDialog open={showAsignacionDialog} onOpenChange={setShowAsignacionDialog} />
    </div>
  )
}
