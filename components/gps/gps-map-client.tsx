"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"
import type { VehiculoEnTiempoReal } from "@/types/gps"

// Custom bus icon
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

// Selected bus icon (highlighted)
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

const createAlertIcon = (severidad: string) => {
  const colors: Record<string, { bg: string; border: string }> = {
    baja: { bg: "#3b82f6", border: "#60a5fa" },
    media: { bg: "#eab308", border: "#facc15" },
    alta: { bg: "#f97316", border: "#fb923c" },
    critica: { bg: "#ef4444", border: "#f87171" },
  }
  const color = colors[severidad] || colors.media

  return L.divIcon({
    className: `alert-icon-${severidad}`,
    html: `<div style="
      background: ${color.bg};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid ${color.border};
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3), 0 2px 8px rgba(0,0,0,0.3);
      animation: alertPulse 1s infinite;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
}

// Alert location type
interface AlertLocation {
  id: string
  lat: number
  lng: number
  severidad: string
  mensaje: string
  placa: string
}

interface GpsMapClientProps {
  vehiculos: VehiculoEnTiempoReal[]
  selectedVehiculo: string | null
  onSelectVehiculo: (id: string | null) => void
  focusLocation?: { lat: number; lng: number } | null
  alertLocations?: AlertLocation[]
}

function MapUpdater({
  vehiculos,
  selectedVehiculo,
  focusLocation,
}: {
  vehiculos: VehiculoEnTiempoReal[]
  selectedVehiculo: string | null
  focusLocation?: { lat: number; lng: number } | null
}) {
  const map = useMap()

  useEffect(() => {
    if (focusLocation) {
      map.flyTo([focusLocation.lat, focusLocation.lng], 17, { duration: 1.5 })
    } else if (selectedVehiculo) {
      const vehiculo = vehiculos.find((v) => v.id === selectedVehiculo)
      if (vehiculo) {
        // Verifica que las coordenadas existan
        if (vehiculo.latitud && vehiculo.longitud) {
          map.flyTo([vehiculo.latitud, vehiculo.longitud], 16, { duration: 1 })
        }
      }
    }
  }, [selectedVehiculo, vehiculos, map, focusLocation])

  return null
}

// Función helper para valores seguros
const safeToFixed = (value: number | undefined | null, decimals: number = 1): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return "0".padEnd(decimals + 2, "0") // Ejemplo: "0.0" o "0.00"
  }
  return value.toFixed(decimals)
}

export function GpsMapClient({
  vehiculos = [], // Valor por defecto
  selectedVehiculo,
  onSelectVehiculo,
  focusLocation,
  alertLocations = [],
}: GpsMapClientProps) {
  // Filtra vehículos con coordenadas válidas
  const vehiculosValidos = vehiculos.filter(v => 
    v && v.latitud !== undefined && v.longitud !== undefined && 
    !isNaN(v.latitud) && !isNaN(v.longitud)
  )

  const center: [number, number] =
    vehiculosValidos.length > 0 
      ? [vehiculosValidos[0].latitud, vehiculosValidos[0].longitud] 
      : [-16.5, -68.1193] // La Paz default

  const severidadLabels: Record<string, string> = {
    baja: "Baja",
    media: "Media",
    alta: "Alta",
    critica: "Crítica",
  }

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes alertPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        /* Fix z-index para que los modales/formularios aparezcan sobre el mapa */
        .leaflet-container {
          z-index: 0 !important;
        }
        .leaflet-pane {
          z-index: 400 !important;
        }
        .leaflet-tile-pane {
          z-index: 200 !important;
        }
        .leaflet-overlay-pane {
          z-index: 400 !important;
        }
        .leaflet-shadow-pane {
          z-index: 500 !important;
        }
        .leaflet-marker-pane {
          z-index: 600 !important;
        }
        .leaflet-tooltip-pane {
          z-index: 650 !important;
        }
        .leaflet-popup-pane {
          z-index: 700 !important;
        }
        /* Asegurar que los controles del mapa no interfieran */
        .leaflet-control-container {
          z-index: 800 !important;
        }
      `}</style>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: "500px", width: "100%", borderRadius: "0.75rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater 
          vehiculos={vehiculosValidos} 
          selectedVehiculo={selectedVehiculo} 
          focusLocation={focusLocation} 
        />

        {/* Vehicle markers - solo vehículos válidos */}
        {vehiculosValidos.map((vehiculo) => (
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
                  <span className="text-xs text-muted-foreground">
                    {vehiculo.linea || "Sin línea"}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Velocidad:</span>
                    <span className="font-medium">
                      {safeToFixed(vehiculo.velocidad, 1)} km/h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pasajeros hoy:</span>
                    <span className="font-medium">
                      {vehiculo.pasajerosHoy ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recaudado:</span>
                    <span className="font-medium text-green-600">
                      Bs {safeToFixed(vehiculo.recaudadoHoy, 2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Satélites GPS:</span>
                    <span className="font-medium">
                      {vehiculo.satelites ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Alert markers - solo alertas válidas */}
        {alertLocations
          .filter(alert => alert && alert.lat && alert.lng && !isNaN(alert.lat) && !isNaN(alert.lng))
          .map((alert) => (
            <Marker 
              key={`alert-${alert.id}`} 
              position={[alert.lat, alert.lng]} 
              icon={createAlertIcon(alert.severidad)}
            >
              <Popup>
                <div className="min-w-[220px] p-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold text-white ${
                        alert.severidad === "critica"
                          ? "bg-red-500"
                          : alert.severidad === "alta"
                            ? "bg-orange-500"
                            : alert.severidad === "media"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                      }`}
                    >
                      ALERTA {severidadLabels[alert.severidad]?.toUpperCase() || "DESCONOCIDA"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">{alert.placa || "Sin placa"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {alert.mensaje || "Sin mensaje"}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Alert radius circles for critical alerts */}
        {alertLocations
          .filter((a) => a && a.severidad && (a.severidad === "critica" || a.severidad === "alta") && a.lat && a.lng)
          .map((alert) => (
            <Circle
              key={`circle-${alert.id}`}
              center={[alert.lat, alert.lng]}
              radius={200}
              pathOptions={{
                color: alert.severidad === "critica" ? "#ef4444" : "#f97316",
                fillColor: alert.severidad === "critica" ? "#ef4444" : "#f97316",
                fillOpacity: 0.1,
                weight: 2,
                dashArray: "5, 5",
              }}
            />
          ))}
      </MapContainer>
    </>
  )
}

// Keep default export for backward compatibility
export default GpsMapClient