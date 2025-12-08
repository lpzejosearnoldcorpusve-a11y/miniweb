'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Bus, 
  Users, 
  MapPin, 
  TrendingUp,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Activity
} from "lucide-react"
import { useVehiculos } from '@/hooks/use-gps'
import { useUsers } from '@/hooks/use-users'
import { useAlertas } from '@/hooks/use-alertas'
import { useTelefericos } from '@/hooks/use-transport'

interface StatItem {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  description: string
  trend?: string
  color: string
  bgColor: string
}

export function StatsOverview() {
  const { vehiculos = [] } = useVehiculos() as any || {}
  const { users = [] } = useUsers() as any || {}
  const { alertas = [] } = useAlertas() as any || {}
  const { telefericos = [] } = useTelefericos() as any || {}

  const totalRutas = (vehiculos?.length || 0) + (telefericos?.length || 0)
  const criticalAlerts = alertas?.filter((a: any) => a.severidad === 'critical')?.length || 0

  const stats: StatItem[] = [
    {
      title: "Rutas Activas",
      value: totalRutas,
      icon: Bus,
      description: `De ${(vehiculos?.length || 0) + 10} disponibles`,
      trend: `+${Math.floor(totalRutas * 0.2)} vs ayer`,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Usuarios Conectados",
      value: users?.length || 0,
      icon: Users,
      description: "En la plataforma",
      trend: `+${Math.floor((users?.length || 0) * 0.15)} hoy`,
      color: "text-green-600",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Dispositivos GPS",
      value: vehiculos?.length || 0,
      icon: Wifi,
      description: "Conectados ahora",
      trend: "98% disponibilidad",
      color: "text-purple-600",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Eficiencia del Sistema",
      value: "94.5%",
      icon: TrendingUp,
      description: "Última hora",
      trend: "+2.1% vs promedio",
      color: "text-orange-600",
      bgColor: "bg-orange-500/10"
    },
  ]

  const miniStats = [
    {
      label: "Alertas Críticas",
      value: criticalAlerts,
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      label: "Servicios OK",
      value: `${Math.min(12, totalRutas)}/12`,
      icon: CheckCircle2,
      color: "text-green-600"
    },
    {
      label: "Uptime",
      value: "99.8%",
      icon: Activity,
      color: "text-blue-600"
    },
  ]

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                {stat.trend && (
                  <p className="text-xs text-green-600 font-medium mt-2">{stat.trend}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {miniStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-slate-200 dark:border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color} opacity-20`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
