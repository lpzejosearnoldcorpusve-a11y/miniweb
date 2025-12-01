"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, DollarSign, GraduationCap, UserCheck, Loader2 } from "lucide-react"
import { useEstadisticasHoy } from "@/hooks/use-gps"

export function GpsEstadisticas() {
  const { estadisticas, isLoading } = useEstadisticasHoy()

  const stats = [
    {
      title: "Pasajeros Hoy",
      value: estadisticas.totalPasajeros,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Recaudado",
      value: `Bs ${estadisticas.totalRecaudado.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Pagos Estudiante",
      value: estadisticas.pagosEstudiante,
      icon: GraduationCap,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Pagos Normal",
      value: estadisticas.pagosNormales,
      icon: UserCheck,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-none shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.title}</p>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
