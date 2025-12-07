"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useReportes } from "@/hooks/use-reportes"
import { Eye, CheckCircle, XCircle, Search, Filter, ImageIcon, Video, Mic, MessageSquare } from "lucide-react"
import { ReporteDetailDialog } from "./reporte-detail-dialog"
import { VerificarReporteDialog } from "./verificar-reporte-dialog"
import type { ReporteTrameajeWithDetails } from "@/types/reportes"

const estadoColors: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  en_revision: "bg-blue-100 text-blue-800",
  verificado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800",
  resuelto: "bg-gray-100 text-gray-800",
}

const prioridadColors: Record<string, string> = {
  baja: "bg-gray-100 text-gray-800",
  media: "bg-yellow-100 text-yellow-800",
  alta: "bg-orange-100 text-orange-800",
  urgente: "bg-red-100 text-red-800",
}

export function ReportesTable() {
  const [filters, setFilters] = useState<{
    estado?: string
    prioridad?: string
    placa?: string
  }>({})
  const [selectedReporte, setSelectedReporte] = useState<ReporteTrameajeWithDetails | null>(null)
  const [verificarReporte, setVerificarReporte] = useState<ReporteTrameajeWithDetails | null>(null)

  const { reportes, isLoading, updateReporte, refresh } = useReportes(filters)

  const handleFilterChange = (key: string, value: string) => {
    if (value === "all") {
      const newFilters = { ...filters }
      delete newFilters[key as keyof typeof filters]
      setFilters(newFilters)
    } else {
      setFilters({ ...filters, [key]: value })
    }
  }

  const handleRechazar = async (id: string) => {
    await updateReporte(id, { estado: "rechazado" })
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const hasEvidence = (reporte: ReporteTrameajeWithDetails) => {
    const imgs = reporte.evidenciaImagenes as string[] | null
    const vids = reporte.evidenciaVideos as string[] | null
    const auds = reporte.evidenciaAudios as string[] | null
    return {
      imagenes: (imgs?.length || 0) > 0,
      videos: (vids?.length || 0) > 0,
      audios: (auds?.length || 0) > 0,
      mensaje: !!reporte.mensaje,
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Reportes Activos
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar placa..."
                  className="w-40 pl-8"
                  value={filters.placa || ""}
                  onChange={(e) => handleFilterChange("placa", e.target.value || "all")}
                />
              </div>
              <Select value={filters.estado || "all"} onValueChange={(v) => handleFilterChange("estado", v)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_revision">En Revisión</SelectItem>
                  <SelectItem value="verificado">Verificado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.prioridad || "all"} onValueChange={(v) => handleFilterChange("prioridad", v)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Línea</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Hora Suceso</TableHead>
                  <TableHead>Reportado</TableHead>
                  <TableHead>Evidencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Cargando reportes...
                    </TableCell>
                  </TableRow>
                ) : reportes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No hay reportes registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  reportes.map((reporte) => {
                    const evidence = hasEvidence(reporte)
                    return (
                      <TableRow key={reporte.id}>
                        <TableCell className="font-mono font-medium">{reporte.placa}</TableCell>
                        <TableCell>{reporte.linea}</TableCell>
                        <TableCell className="capitalize">{reporte.tipoReporte}</TableCell>
                        <TableCell className="text-sm">{formatDate(reporte.horaSuceso)}</TableCell>
                        <TableCell className="text-sm">{formatDate(reporte.horaReporte)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {evidence.imagenes && <ImageIcon className="h-4 w-4 text-blue-500" />}
                            {evidence.videos && <Video className="h-4 w-4 text-purple-500" />}
                            {evidence.audios && <Mic className="h-4 w-4 text-orange-500" />}
                            {evidence.mensaje && <MessageSquare className="h-4 w-4 text-green-500" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={estadoColors[reporte.estado]} variant="secondary">
                            {reporte.estado.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={prioridadColors[reporte.prioridad]} variant="secondary">
                            {reporte.prioridad}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedReporte(reporte)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {reporte.estado === "pendiente" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() => setVerificarReporte(reporte)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleRechazar(reporte.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ReporteDetailDialog
        reporte={selectedReporte}
        open={!!selectedReporte}
        onOpenChange={(open) => !open && setSelectedReporte(null)}
      />

      <VerificarReporteDialog
        reporte={verificarReporte}
        open={!!verificarReporte}
        onOpenChange={(open) => !open && setVerificarReporte(null)}
        onSuccess={refresh}
      />
    </>
  )
}
