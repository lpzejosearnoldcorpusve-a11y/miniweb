"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Route, Trash2, MapPin, Bus } from "lucide-react"
import { useAsignacionesRuta } from "@/hooks/use-alertas"

export function GpsAsignacionesList() {
  const { asignaciones, finalizarAsignacion, isLoading } = useAsignacionesRuta()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Route className="h-5 w-5 text-primary" />
          Asignaciones Activas
          <Badge variant="secondary" className="ml-auto">
            {asignaciones.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {asignaciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <Bus className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm">Sin asignaciones activas</p>
            <p className="text-xs">Asigna rutas a vehículos para monitorear</p>
          </div>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {asignaciones.map((item) => (
                <div
                  key={item.asignacion.id}
                  className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {item.vehiculo?.placa || "---"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Línea {item.vehiculo?.linea}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.transporte?.sindicato} - {item.transporte?.rutaNombre}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        Tolerancia: {item.asignacion.toleranciaMetros}m
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => finalizarAsignacion(item.asignacion.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
