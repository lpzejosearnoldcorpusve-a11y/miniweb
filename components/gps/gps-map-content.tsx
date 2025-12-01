"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GpsMapView } from "./gps-map-view"
import { GpsVehiculosList } from "./gps-vehiculos-list"
import { GpsTransaccionesList } from "./gps-transacciones-list"
import { GpsEstadisticas } from "./gps-estadisticas"

export function GpsMapContent() {
  const [selectedVehiculo, setSelectedVehiculo] = useState<string | null>(null)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Map Area */}
      <div className="lg:col-span-2 space-y-4">
        <GpsEstadisticas />
        <GpsMapView selectedVehiculo={selectedVehiculo} onSelectVehiculo={setSelectedVehiculo} />
      </div>

      {/* Side Panel */}
      <div className="space-y-4">
        <Tabs defaultValue="vehiculos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
            <TabsTrigger value="transacciones">Transacciones</TabsTrigger>
          </TabsList>
          <TabsContent value="vehiculos" className="mt-4">
            <GpsVehiculosList selectedVehiculo={selectedVehiculo} onSelectVehiculo={setSelectedVehiculo} />
          </TabsContent>
          <TabsContent value="transacciones" className="mt-4">
            <GpsTransaccionesList vehiculoId={selectedVehiculo} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
