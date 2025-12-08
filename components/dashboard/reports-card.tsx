'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useReportes } from '@/hooks/use-reportes'

export function ReportsCard() {
  const { reportes = [], isLoading } = useReportes() as any || {}

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'incident':
      case 'incidente':
        return '🚨'
      case 'maintenance':
      case 'mantenimiento':
        return '🔧'
      case 'passenger':
      case 'pasajeros':
        return '👥'
      case 'efficiency':
      case 'eficiencia':
        return '📈'
      default:
        return '📄'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'completado':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
      case 'en_progreso':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending':
      case 'pendiente':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'alta':
        return 'bg-red-500/10 text-red-600 border-red-500/30'
      case 'medium':
      case 'media':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
      case 'low':
      case 'baja':
        return 'bg-green-500/10 text-green-600 border-green-500/30'
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/30'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'alta':
        return 'Alta'
      case 'medium':
      case 'media':
        return 'Media'
      case 'low':
      case 'baja':
        return 'Baja'
      default:
        return priority
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
      case 'completado':
        return 'Completado'
      case 'in-progress':
      case 'en_progreso':
        return 'En progreso'
      case 'pending':
      case 'pendiente':
        return 'Pendiente'
      default:
        return status
    }
  }

  const formatDate = (date: string | Date) => {
    if (!date) return 'Reciente'
    try {
      const d = new Date(date)
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch {
      return 'Reciente'
    }
  }

  const completedReports = reportes?.filter((r: any) => r.estado === 'completed' || r.estado === 'completado')?.length || 0
  const displayReports = reportes?.slice(0, 5) || []

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Reportes Recientes
          </CardTitle>
          <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
            {completedReports} completados
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground text-sm">Cargando reportes...</div>
          ) : displayReports.length > 0 ? (
            displayReports.map((report: any) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">{getTypeIcon(report.tipo)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{report.titulo || report.descripcion || 'Reporte'}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(report.fecha || report.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className={`text-xs ${getPriorityColor(report.prioridad)}`}>
                    {getPriorityLabel(report.prioridad)}
                  </Badge>
                  {getStatusIcon(report.estado)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No hay reportes disponibles
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
