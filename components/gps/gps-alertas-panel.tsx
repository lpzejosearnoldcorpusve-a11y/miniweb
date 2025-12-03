"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Bell,
  Route,
} from "lucide-react"
import { useAlertasActivas, useEstadisticasAlertas } from "@/hooks/use-alertas"
import type { AlertaConDetalles } from "@/types/alertas"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const severidadColors: Record<string, string> = {
  baja: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  media: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  alta: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  critica: "bg-red-500/20 text-red-600 border-red-500/30 animate-pulse",
}

const tipoAlertaLabels: Record<string, string> = {
  desvio_ruta: "Desvío de Ruta",
  fuera_servicio: "Fuera de Servicio",
  velocidad_excesiva: "Velocidad Excesiva",
  sin_movimiento: "Sin Movimiento",
}

const tipoAlertaIcons: Record<string, React.ReactNode> = {
  desvio_ruta: <Route className="h-4 w-4" />,
  fuera_servicio: <XCircle className="h-4 w-4" />,
  velocidad_excesiva: <AlertTriangle className="h-4 w-4" />,
  sin_movimiento: <Clock className="h-4 w-4" />,
}

interface GpsAlertasPanelProps {
  onAlertaClick?: (alerta: AlertaConDetalles) => void
}

export function GpsAlertasPanel({ onAlertaClick }: GpsAlertasPanelProps) {
  const { alertasActivas, marcarRevisada, resolverAlerta, ignorarAlerta, isLoading } = useAlertasActivas()
  const { estadisticas } = useEstadisticasAlertas()
  const [expanded, setExpanded] = useState(true)
  const [selectedAlerta, setSelectedAlerta] = useState<AlertaConDetalles | null>(null)
  const [dialogAction, setDialogAction] = useState<"resolver" | "ignorar" | null>(null)
  const [notas, setNotas] = useState("")

  const handleAction = async () => {
    if (!selectedAlerta || !dialogAction) return

    if (dialogAction === "resolver") {
      await resolverAlerta(selectedAlerta.id, notas)
    } else {
      await ignorarAlerta(selectedAlerta.id, notas)
    }

    setSelectedAlerta(null)
    setDialogAction(null)
    setNotas("")
  }

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString("es-BO", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <Card className="border-destructive/50 bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell
                className={`h-5 w-5 ${alertasActivas.length > 0 ? "text-destructive animate-bounce" : "text-muted-foreground"}`}
              />
              <span>Centro de Alertas</span>
              {alertasActivas.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {alertasActivas.length}
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>

        {expanded && (
          <CardContent className="pt-0">
            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-center">
              <div className="p-2 rounded-lg bg-muted/50">
                <div className="text-lg font-bold text-destructive">{estadisticas.totalActivas}</div>
                <div className="text-xs text-muted-foreground">Activas</div>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <div className="text-lg font-bold">{estadisticas.totalHoy}</div>
                <div className="text-xs text-muted-foreground">Hoy</div>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <div className="text-lg font-bold text-orange-500">
                  {estadisticas.porSeveridad.alta + estadisticas.porSeveridad.critica}
                </div>
                <div className="text-xs text-muted-foreground">Críticas</div>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <div className="text-lg font-bold text-primary">{estadisticas.porTipo.desvio_ruta}</div>
                <div className="text-xs text-muted-foreground">Desvíos</div>
              </div>
            </div>

            {/* Alerts List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : alertasActivas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mb-2 text-green-500" />
                <p className="text-sm">Sin alertas activas</p>
                <p className="text-xs">Todos los vehículos en ruta</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {alertasActivas.map((alerta) => (
                    <div
                      key={alerta.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${severidadColors[alerta.severidad]}`}
                      onClick={() => onAlertaClick?.(alerta)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {tipoAlertaIcons[alerta.tipoAlerta]}
                          <div>
                            <div className="font-medium text-sm">{alerta.vehiculo?.placa || "Desconocido"}</div>
                            <div className="text-xs opacity-80">{tipoAlertaLabels[alerta.tipoAlerta]}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {alerta.severidad.toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-xs mt-2 line-clamp-2">{alerta.mensaje}</p>

                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(alerta.fechaAlerta)}
                        </div>
                        {alerta.distanciaDesvio && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {Math.round(alerta.distanciaDesvio)}m
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            marcarRevisada(alerta.id)
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Revisar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs flex-1 text-green-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAlerta(alerta)
                            setDialogAction("resolver")
                          }}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolver
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs flex-1 text-muted-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAlerta(alerta)
                            setDialogAction("ignorar")
                          }}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Ignorar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        )}
      </Card>

      {/* Resolution Dialog */}
      <Dialog open={!!dialogAction} onOpenChange={() => setDialogAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogAction === "resolver" ? "Resolver Alerta" : "Ignorar Alerta"}</DialogTitle>
            <DialogDescription>
              {dialogAction === "resolver"
                ? "Indica las acciones tomadas para resolver esta alerta."
                : "Indica el motivo por el cual se ignora esta alerta."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedAlerta && (
              <div className="p-3 rounded-lg bg-muted">
                <div className="font-medium">{selectedAlerta.vehiculo?.placa}</div>
                <div className="text-sm text-muted-foreground">{selectedAlerta.mensaje}</div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                placeholder="Escribe las notas de resolución..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAction(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAction}
              className={dialogAction === "resolver" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {dialogAction === "resolver" ? "Resolver" : "Ignorar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
