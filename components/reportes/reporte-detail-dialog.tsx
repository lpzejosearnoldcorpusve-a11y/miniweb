"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, User, Car, ImageIcon, Video, Mic, MessageSquare, AlertTriangle } from "lucide-react"
import type { ReporteTrameajeWithDetails } from "@/types/reportes"

interface ReporteDetailDialogProps {
  reporte: ReporteTrameajeWithDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReporteDetailDialog({ reporte, open, onOpenChange }: ReporteDetailDialogProps) {
  if (!reporte) return null

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("es-BO", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const imagenes = reporte.evidenciaImagenes as string[] | null
  const videos = reporte.evidenciaVideos as string[] | null
  const audios = reporte.evidenciaAudios as string[] | null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Detalle del Reporte
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Principal */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Car className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Placa</p>
                  <p className="font-mono text-lg font-bold">{reporte.placa}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">{reporte.linea}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Línea</p>
                  <p className="font-medium">{reporte.linea}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estado y Prioridad */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {reporte.estado.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prioridad</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {reporte.prioridad}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {reporte.tipoReporte}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Fechas */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Hora del suceso</p>
                <p className="font-medium">{formatDate(reporte.horaSuceso)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Hora del reporte</p>
                <p className="font-medium">{formatDate(reporte.horaReporte)}</p>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          {(reporte.latitud || reporte.direccion) && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ubicación</p>
                  {reporte.direccion && <p className="font-medium">{reporte.direccion}</p>}
                  {reporte.latitud && reporte.longitud && (
                    <p className="text-sm text-muted-foreground">
                      {reporte.latitud.toFixed(6)}, {reporte.longitud.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Usuario Reportador */}
          {reporte.usuarioApp && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Reportado por</p>
                  <p className="font-medium">
                    {reporte.usuarioApp.nombres} {reporte.usuarioApp.apellidoPaterno}{" "}
                    {reporte.usuarioApp.apellidoMaterno}
                  </p>
                  <p className="text-sm text-muted-foreground">{reporte.usuarioApp.celular}</p>
                </div>
              </div>
            </>
          )}

          {/* Mensaje */}
          {reporte.mensaje && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Descripción</p>
                  <p className="mt-1 rounded-lg bg-muted p-3 text-sm">{reporte.mensaje}</p>
                </div>
              </div>
            </>
          )}

          {/* Evidencia */}
          {((imagenes?.length || 0) > 0 || (videos?.length || 0) > 0 || (audios?.length || 0) > 0) && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-medium">Evidencia</p>
                <div className="flex flex-wrap gap-3">
                  {(imagenes?.length || 0) > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-700">{imagenes?.length} imagen(es)</span>
                    </div>
                  )}
                  {(videos?.length || 0) > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2">
                      <Video className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-purple-700">{videos?.length} video(s)</span>
                    </div>
                  )}
                  {(audios?.length || 0) > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2">
                      <Mic className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-700">{audios?.length} audio(s)</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Infracción generada */}
          {reporte.infraccion && (
            <>
              <Separator />
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-green-800">Infracción Generada</p>
                  <p className="mt-1 text-2xl font-bold text-green-700">Bs. {reporte.infraccion.montoBs}</p>
                  <p className="text-sm text-green-600">Estado: {reporte.infraccion.estado}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
