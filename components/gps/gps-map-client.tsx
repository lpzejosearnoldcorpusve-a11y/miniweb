"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect, useMemo } from "react"
import type { VehiculoEnTiempoReal } from "@/types/gps"

const busIcon = L.divIcon({
  className: "custom-bus-icon",
  html: `<div style="
    background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  ">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})

const selectedBusIcon = L.divIcon({
  className: "custom-bus-icon-selected",
  html: `<div style="
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid white;
    box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.3), 0 2px 12px rgba(0,0,0,0.4);
    animation: pulse 2s infinite;
  ">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
    </svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
})

interface GpsMapClientProps {
  vehiculos: VehiculoEnTiempoReal[]
  selectedVehiculo: string | null
  onSelectVehiculo: (id: string | null) => void
}

function MapUpdater({
  vehiculos,
  selectedVehiculo,
}: { vehiculos: VehiculoEnTiempoReal[]; selectedVehiculo: string | null }) {
  const map = useMap()

  useEffect(() => {
    if (selectedVehiculo) {
      const vehiculo = vehiculos.find((v) => v.id === selectedVehiculo)
      if (vehiculo && vehiculo.latitud !== undefined && vehiculo.longitud !== undefined) {
        map.flyTo([vehiculo.latitud, vehiculo.longitud], 16, { duration: 1 })
      }
    }
  }, [selectedVehiculo, vehiculos, map])

  return null
}

export default function GpsMapClient({ vehiculos, selectedVehiculo, onSelectVehiculo }: GpsMapClientProps) {
  const vehiculosFiltrados = useMemo(() => {
    return vehiculos.filter(v => 
      v.latitud !== undefined && 
      v.longitud !== undefined &&
      !isNaN(v.latitud) && 
      !isNaN(v.longitud)
    )
  }, [vehiculos])

  const center: [number, number] = useMemo(() => {
    if (vehiculosFiltrados.length > 0) {
      const firstVehicle = vehiculosFiltrados[0]
      return [firstVehicle.latitud, firstVehicle.longitud]
    }
    return [-16.5, -68.1193]
  }, [vehiculosFiltrados])

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
      <MapContainer center={center} zoom={13} style={{ height: "500px", width: "100%", borderRadius: "0.75rem" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater vehiculos={vehiculosFiltrados} selectedVehiculo={selectedVehiculo} />

        {vehiculosFiltrados.map((vehiculo) => {
          const velocidadFormateada = vehiculo.velocidad !== undefined && vehiculo.velocidad !== null 
            ? vehiculo.velocidad.toFixed(1)
            : "0.0"
          
          const recaudadoFormateado = vehiculo.recaudadoHoy !== undefined && vehiculo.recaudadoHoy !== null 
            ? vehiculo.recaudadoHoy.toFixed(2)
            : "0.00"

          return (
            <Marker
              key={vehiculo.id}
              position={[vehiculo.latitud, vehiculo.longitud]}
              icon={vehiculo.id === selectedVehiculo ? selectedBusIcon : busIcon}
              eventHandlers={{
                click: () => onSelectVehiculo(vehiculo.id),
              }}
            >
              <Popup>
                <div className="min-w-[200px] p-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {vehiculo.placa || "Sin placa"}
                    </span>
                    <span className="text-xs text-muted-foreground">{vehiculo.linea || "Sin línea"}</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Velocidad:</span>
                      <span className="font-medium">{velocidadFormateada} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pasajeros hoy:</span>
                      <span className="font-medium">{vehiculo.pasajerosHoy ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recaudado:</span>
                      <span className="font-medium text-green-600">Bs {recaudadoFormateado}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Satélites GPS:</span>
                      <span className="font-medium">{vehiculo.satelites ?? 0}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </>
  )
}