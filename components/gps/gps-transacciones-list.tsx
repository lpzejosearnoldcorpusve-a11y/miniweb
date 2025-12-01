"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreditCard, Loader2, Clock } from "lucide-react"
import { useTransacciones } from "@/hooks/use-gps"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface GpsTransaccionesListProps {
  vehiculoId?: string | null
}

export function GpsTransaccionesList({ vehiculoId }: GpsTransaccionesListProps) {
  const { transacciones, isLoading } = useTransacciones(vehiculoId ? { vehiculoId } : undefined)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  const getTipoPagoColor = (tipo: string) => {
    switch (tipo) {
      case "estudiante":
        return "bg-purple-500/10 text-purple-600"
      case "tercera_edad":
        return "bg-orange-500/10 text-orange-600"
      default:
        return "bg-blue-500/10 text-blue-600"
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completado":
        return "default"
      case "rechazado":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {transacciones.length} transacción(es)
        {vehiculoId && " del vehículo seleccionado"}
      </p>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {transacciones.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CreditCard className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No hay transacciones</p>
              </CardContent>
            </Card>
          ) : (
            transacciones.map((trans) => (
              <Card key={trans.id} className="transition-all hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium text-foreground">{trans.rfidUid}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(trans.fechaHora), "dd MMM, HH:mm", { locale: es })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">Bs {trans.monto.toFixed(2)}</p>
                      <Badge variant={getEstadoColor(trans.estado)} className="text-xs">
                        {trans.estado}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className={`rounded-full px-2 py-0.5 ${getTipoPagoColor(trans.tipoPago)}`}>
                      {trans.tipoPago === "tercera_edad" ? "3ra Edad" : trans.tipoPago}
                    </span>
                    {(trans.descuento ?? 0) > 0 && (
                      <span className="text-muted-foreground">Descuento: {trans.descuento}%</span>
                    )}
                    <span className="text-muted-foreground">Saldo: Bs {trans.saldoRestante?.toFixed(2) || "0.00"}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
