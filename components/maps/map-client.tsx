"use client"

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useState } from "react"

// Fix for default Leaflet icons in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
})

interface Point {
  lat: number
  lng: number
  order?: number
}

interface MapClientProps {
  center?: [number, number]
  zoom?: number
  points?: Point[] // For stations or generic markers
  route?: Point[] // For route lines (minibuses)
  onMapClick?: (lat: number, lng: number, routeSegment?: Point[]) => void
  mode?: "view" | "edit"
  transportType?: "teleferico" | "minibus"
  color?: string
}

function MapEvents({
  onClick,
  transportType,
  lastPoint,
}: {
  onClick?: (lat: number, lng: number, routeSegment?: Point[]) => void
  transportType?: "teleferico" | "minibus"
  lastPoint?: Point
}) {
  const [isFetching, setIsFetching] = useState(false)

  useMapEvents({
    async click(e) {
      if (onClick && !isFetching) {
        if (transportType === "minibus" && lastPoint) {
          setIsFetching(true)
          try {
            const response = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${lastPoint.lng},${lastPoint.lat};${e.latlng.lng},${e.latlng.lat}?overview=full&geometries=geojson`,
            )
            const data = await response.json()
            if (data.routes && data.routes[0]) {
              const coordinates = data.routes[0].geometry.coordinates
              const segment = coordinates.map((c: number[]) => ({
                lat: c[1],
                lng: c[0],
              }))
              onClick(e.latlng.lat, e.latlng.lng, segment)
            } else {
              onClick(e.latlng.lat, e.latlng.lng)
            }
          } catch (error) {
            console.error("Error fetching OSRM route:", error)
            onClick(e.latlng.lat, e.latlng.lng)
          } finally {
            setIsFetching(false)
          }
        } else {
          onClick(e.latlng.lat, e.latlng.lng)
        }
      }
    },
  })
  return null
}

export default function MapClient({
  center = [-16.5, -68.1193], // La Paz, Bolivia
  zoom = 13,
  points = [],
  route = [],
  onMapClick,
  mode = "view",
  transportType = "teleferico",
  color = "blue",
}: MapClientProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%", minHeight: "400px", borderRadius: "0.5rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {mode === "edit" && (
        <MapEvents
          onClick={onMapClick}
          transportType={transportType}
          lastPoint={route.length > 0 ? route[route.length - 1] : undefined}
        />
      )}

      {/* Render Points (Stations) */}
      {points.map((p, idx) => (
        <Marker key={idx} position={[p.lat, p.lng]} icon={defaultIcon}>
          {p.order !== undefined && <Popup>Estación {p.order}</Popup>}
        </Marker>
      ))}

      {/* Render Route (Minibuses) */}
      {route.length > 1 && (
        <Polyline positions={route.map((p) => [p.lat, p.lng])} pathOptions={{ color, weight: 4 }} />
      )}

      {/* Render Route Points while editing */}
      {route.map((p, idx) => (
        <Marker key={`route-${idx}`} position={[p.lat, p.lng]} icon={defaultIcon} opacity={0.6}></Marker>
      ))}
    </MapContainer>
  )
}
