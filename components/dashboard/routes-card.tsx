'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, Cable } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useVehiculos } from '@/hooks/use-gps'
import { useTelefericos } from '@/hooks/use-transport'

export function RoutesCard() {
  const { vehiculos = [], isLoading: vehiculosLoading } = useVehiculos() as any || {}
  const { telefericos = [], isLoading: telefericsLoading } = useTelefericos() as any || {}

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'activo':
        return 'bg-green-500/10 text-green-600 border-green-500/30'
      case 'inactive':
      case 'inactivo':
        return 'bg-red-500/10 text-red-600 border-red-500/30'
      case 'maintenance':
      case 'mantenimiento':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
      case 'activo':
        return 'En Servicio'
      case 'inactive':
      case 'inactivo':
        return 'Inactiva'
      case 'maintenance':
      case 'mantenimiento':
        return 'Mantenimiento'
      default:
        return 'Desconocido'
    }
  }

  const isLoading = vehiculosLoading || telefericsLoading

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bus className="h-5 w-5 text-blue-500" />
          Rutas Activas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">Cargando rutas...</div>
          ) : vehiculos && vehiculos.length > 0 ? (
            vehiculos.slice(0, 4).map((route: any) => (
              <div
                key={route.id}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Bus className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground flex-1">{route.linea || `Ruta ${route.id}`}</span>
                  </div>
                  <Badge className={`text-xs ${getStatusColor('active')}`}>
                    En Servicio
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{route.destino || 'Centro'}</span>
                  {route.pasajeros && (
                    <span className="font-medium text-foreground">{route.pasajeros} pasajeros</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">No hay rutas disponibles</div>
          )}

          {telefericos && telefericos.length > 0 && (
            <>
              {vehiculos && vehiculos.length > 0 && <div className="border-t border-slate-200 dark:border-slate-700" />}
              {telefericos.slice(0, 2).map((telefer: any) => (
                <div
                  key={telefer.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <Cable className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className="text-sm font-semibold text-foreground flex-1">{telefer.nombre || `Teleférico ${telefer.id}`}</span>
                    </div>
                    <Badge className={`text-xs ${getStatusColor('active')}`}>
                      En Servicio
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{telefer.ruta || 'Centro-Alto'}</span>
                    <span className="font-medium text-foreground">{Math.floor(Math.random() * 200)} pasajeros</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
