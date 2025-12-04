"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"
import type { TarjetaRfid } from "@/types"

interface TarjetaValidacionPanelProps {
  tarjeta: TarjetaRfid | null
}

export function TarjetaValidacionPanel({ tarjeta }: TarjetaValidacionPanelProps) {
  if (!tarjeta) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex h-24 items-center justify-center text-center">
          <p className="text-sm text-muted-foreground">Selecciona una tarjeta para ver los detalles</p>
        </CardContent>
      </Card>
    )
  }

  const isActive = tarjeta.estado === "activa"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Validación de Tarjeta</span>
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Activa" : tarjeta.estado}
          </Badge>
        </CardTitle>
        <CardDescription>Información de la tarjeta seleccionada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Nombre</p>
            <p className="font-semibold">{tarjeta.nombre}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Celular</p>
            <p className="font-semibold">{tarjeta.celular}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Monto</p>
            <p className="text-lg font-bold text-green-600">Bs. {tarjeta.montoBs.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Estado</p>
            <div className="flex items-center gap-1">
              {isActive ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="capitalize">{tarjeta.estado}</span>
            </div>
          </div>
        </div>

        {!isActive && (
          <div className="rounded-lg bg-red-50 p-2 text-xs text-red-800">
            <p className="font-medium">⚠️ Tarjeta no disponible</p>
            <p>Esta tarjeta no está activa y no puede vincularse.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
