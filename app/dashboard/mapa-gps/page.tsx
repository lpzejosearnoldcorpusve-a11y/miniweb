import { GpsMapHeader } from "@/components/gps/gps-map-header"
import { GpsMapContent } from "@/components/gps/gps-map-content"

export default function MapaGpsPage() {
  return (
    <div className="flex flex-col gap-6">
      <GpsMapHeader />
      <GpsMapContent />
    </div>
  )
}
