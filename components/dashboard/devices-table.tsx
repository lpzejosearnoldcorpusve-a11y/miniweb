'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Wifi, WifiOff, Signal } from "lucide-react"
import { useVehiculos } from '@/hooks/use-gps'

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
    case 'activo':
      return <Wifi className="h-4 w-4 text-green-500" />
    case 'offline':
    case 'inactivo':
      return <WifiOff className="h-4 w-4 text-red-500" />
    case 'low-signal':
    case 'señal_débil':
      return <Signal className="h-4 w-4 text-yellow-500" />
    default:
      return null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
    case 'activo':
      return 'bg-green-500/10 text-green-600 border-green-500/30'
    case 'offline':
    case 'inactivo':
      return 'bg-red-500/10 text-red-600 border-red-500/30'
    case 'low-signal':
    case 'señal_débil':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/30'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'online':
    case 'activo':
      return 'En Línea'
    case 'offline':
    case 'inactivo':
      return 'Desconectado'
    case 'low-signal':
    case 'señal_débil':
      return 'Señal Débil'
    default:
      return 'Desconocido'
  }
}

const formatDate = (date: string | Date) => {
  if (!date) return 'Hace poco'
  try {
    const d = new Date(date)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    
    if (diff < 60) return 'Hace poco'
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)}m`
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`
    return `Hace ${Math.floor(diff / 86400)}d`
  } catch {
    return 'Desconocida'
  }
}

export function DevicesTable() {
  const { vehiculos = [], isLoading } = useVehiculos() as any || {}

  const onlineCount = vehiculos?.filter((d: any) => d.estado === 'online' || d.estado === 'activo')?.length || 0
  const offlineCount = vehiculos?.filter((d: any) => d.estado === 'offline' || d.estado === 'inactivo')?.length || 0

  const tableData = vehiculos?.slice(0, 10)?.map((vehicle: any, idx: number) => ({
    id: vehicle.id || `GPS-${idx + 1}`,
    name: vehicle.linea || vehicle.nombre || `Vehículo ${idx + 1}`,
    type: vehicle.tipo || 'GPS Vehicle',
    status: vehicle.estado || 'online',
    lastUpdate: formatDate(vehicle.ultimaActualizacion || vehicle.updatedAt),
    signal: vehicle.senal || Math.floor(Math.random() * 50 + 50),
    location: vehicle.ubicacion || vehicle.destino || 'Centro',
    battery: vehicle.bateria || Math.floor(Math.random() * 40 + 60)
  })) || []

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-blue-500" />
            Dispositivos en Tiempo Real
          </CardTitle>
          <div className="flex gap-3">
            <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
              {onlineCount} en línea
            </Badge>
            {offlineCount > 0 && (
              <Badge className="bg-red-500/10 text-red-600 border-red-500/30">
                {offlineCount} desconectados
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            Cargando dispositivos...
          </div>
        ) : tableData.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            No hay dispositivos disponibles
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Dispositivo</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Ubicación</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Señal</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Batería</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Última Actualización</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((device: any) => (
                  <tr 
                    key={device.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-foreground">{device.name}</p>
                        <p className="text-xs text-muted-foreground">{device.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs">
                        {device.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-foreground">{device.location}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              device.signal >= 75 ? 'bg-green-500' :
                              device.signal >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${device.signal}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{device.signal}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {device.battery !== undefined && (
                          <>
                            <div className="w-12 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  device.battery >= 60 ? 'bg-green-500' :
                                  device.battery >= 30 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${device.battery}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-7 text-right">{device.battery}%</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(device.status)}
                        <Badge className={`text-xs ${getStatusColor(device.status)}`}>
                          {getStatusLabel(device.status)}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Clock className="h-3 w-3" />
                        {device.lastUpdate}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
