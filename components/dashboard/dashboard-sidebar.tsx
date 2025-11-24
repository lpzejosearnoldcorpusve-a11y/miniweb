"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Bus, MapPin, BarChart3, Settings, LogOut, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Usuarios",
    icon: Users,
    href: "/dashboard/usuarios",
  },
  {
    title: "Rutas",
    icon: Bus,
    href: "/dashboard/rutas",
  },
  {
    title: "Tarjetas RFID",
    icon: CreditCard,
    href: "/dashboard/tarjetas",
  },
  {
    title: "Mapas GPS",
    icon: MapPin,
    href: "/dashboard/mapas",
  },
  {
    title: "Estadísticas",
    icon: BarChart3,
    href: "/dashboard/estadisticas",
  },
  {
    title: "Configuración",
    icon: Settings,
    href: "/dashboard/configuracion",
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Bus className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-sm">GAMLP</h2>
            <p className="text-xs text-muted-foreground">Movilidad Urbana</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  )
}
