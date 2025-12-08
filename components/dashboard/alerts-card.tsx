'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAlertas } from '@/hooks/use-alertas'

export function AlertsCard() {
  const { alertas = [], isLoading } = useAlertas() as any || {}

  const criticalAlerts = alertas?.filter((a: any) => a.severidad === 'critical' || a.severidad === 'crítica') || []
  const warningAlerts = alertas?.filter((a: any) => a.severidad === 'warning' || a.severidad === 'advertencia') || []
  const infoAlerts = alertas?.filter((a: any) => a.severidad === 'info' || a.severidad === 'información') || []

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'crítica':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
      case 'advertencia':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
      case 'información':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'crítica':
        return 'bg-red-500/10 border-red-500/30 text-red-600'
      case 'warning':
      case 'advertencia':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600'
      case 'info':
      case 'información':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-600'
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-600'
    }
  }

  const formatDate = (date: string | Date) => {
    if (!date) return 'Hace poco'
    const d = new Date(date)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    
    if (diff < 60) return 'Ahora mismo'
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)}m`
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`
    return `Hace ${Math.floor(diff / 86400)}d`
  }

  const displayAlerts = alertas.slice(0, 5)

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Alertas
          </CardTitle>
          {criticalAlerts.length > 0 && (
            <Badge className="bg-red-500/10 text-red-600 border-red-500/30">
              {criticalAlerts.length} crítica{criticalAlerts.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground text-sm">Cargando alertas...</div>
          ) : displayAlerts.length > 0 ? (
            displayAlerts.map((alert: any) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getSeverityColor(alert.severidad)} transition-colors hover:opacity-80`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getSeverityIcon(alert.severidad)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{alert.titulo || alert.mensaje || 'Alerta'}</p>
                    {alert.descripcion && (
                      <p className="text-xs mt-1 opacity-75">{alert.descripcion}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      {alert.ruta && (
                        <Badge variant="outline" className="text-xs">
                          {alert.ruta}
                        </Badge>
                      )}
                      <span className="text-xs opacity-60">{formatDate(alert.timestamp || alert.fecha)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              ✓ No hay alertas activas
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
