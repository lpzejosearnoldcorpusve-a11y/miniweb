import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, Users, MapPin, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Rutas Activas",
    value: "0",
    icon: Bus,
    description: "Rutas de transporte público",
  },
  {
    title: "Usuarios Registrados",
    value: "0",
    icon: Users,
    description: "Total de usuarios en el sistema",
  },
  {
    title: "Puntos GPS",
    value: "0",
    icon: MapPin,
    description: "Puntos de geolocalización",
  },
  {
    title: "Eficiencia",
    value: "0%",
    icon: TrendingUp,
    description: "Mejora en tiempos de viaje",
  },
]

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel de Control</h1>
        <p className="text-muted-foreground mt-2">
          Sistema de Movilidad Urbana - Gobierno Autónomo Municipal de La Paz
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>No hay actividades registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 text-muted-foreground">Sin datos disponibles</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rutas Monitoreadas</CardTitle>
            <CardDescription>Estado de las rutas en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 text-muted-foreground">Sin rutas configuradas</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
