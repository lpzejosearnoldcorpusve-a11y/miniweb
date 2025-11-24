import { TarjetasHeader } from "@/components/tarjetas/tarjetas-header"
import { TarjetasTable } from "@/components/tarjetas/tarjetas-table"

export default function TarjetasPage() {
  return (
    <div className="space-y-6">
      <TarjetasHeader />
      <TarjetasTable />
    </div>
  )
}
