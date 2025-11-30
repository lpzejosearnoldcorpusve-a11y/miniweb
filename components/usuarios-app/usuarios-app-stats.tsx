"use client"

import { Users, Smartphone, CreditCard, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { UsuarioAppWithTarjetas } from "@/types"

interface UsuariosAppStatsProps {
  usuarios: UsuarioAppWithTarjetas[]
}

export function UsuariosAppStats({ usuarios }: UsuariosAppStatsProps) {
  const totalUsuarios = usuarios.length
  const usuariosActivos = usuarios.filter((u) => u.estado === "activo").length
  const totalTarjetas = usuarios.reduce((acc, u) => acc + (u.tarjetas?.length || 0), 0)
  const totalTokens = usuarios.reduce((acc, u) => acc + (u.tokensActivos || 0), 0)

  const stats = [
    {
      title: "Total Usuarios",
      value: totalUsuarios,
      icon: Users,
      color: "from-primary to-primary/70",
      description: "Registrados en la app",
    },
    {
      title: "Usuarios Activos",
      value: usuariosActivos,
      icon: ShieldCheck,
      color: "from-green-500 to-green-600",
      description: "Con estado activo",
    },
    {
      title: "Tarjetas Vinculadas",
      value: totalTarjetas,
      icon: CreditCard,
      color: "from-accent to-accent/70",
      description: "RFID asociadas",
    },
    {
      title: "Sesiones Activas",
      value: totalTokens,
      icon: Smartphone,
      color: "from-orange-500 to-orange-600",
      description: "Tokens válidos",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="overflow-hidden border-0 shadow-md">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 p-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
