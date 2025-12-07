"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useReportesEstadisticas } from "@/hooks/use-reportes"
import { FileText, Clock, CheckCircle, XCircle, AlertTriangle, DollarSign } from "lucide-react"

export function ReportesEstadisticas() {
  const { estadisticas, isLoading } = useReportesEstadisticas()

  const stats = [
    {
      label: "Total Reportes",
      value: estadisticas.totalReportes,
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Pendientes",
      value: estadisticas.pendientes,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      label: "En Revisión",
      value: estadisticas.enRevision,
      icon: AlertTriangle,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Verificados",
      value: estadisticas.verificados,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Rechazados",
      value: estadisticas.rechazados,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      label: "Multas (Bs.)",
      value: estadisticas.montoTotalInfracciones.toLocaleString(),
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold">{isLoading ? "-" : stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
