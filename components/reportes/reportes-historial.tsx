"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useHistorialReportes } from "@/hooks/use-reportes"
import { History, ChevronLeft, ChevronRight, ImageIcon, Video, Mic } from "lucide-react"

export function ReportesHistorial() {
  const [page, setPage] = useState(1)
  const { historial, pagination, isLoading } = useHistorialReportes(page, 15)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historial de Reportes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Línea</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Evidencia</TableHead>
                <TableHead>Reportador</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Cargando historial...
                  </TableCell>
                </TableRow>
              ) : historial.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No hay registros en el historial
                  </TableCell>
                </TableRow>
              ) : (
                historial.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono font-medium">{item.placa}</TableCell>
                    <TableCell>{item.linea}</TableCell>
                    <TableCell className="capitalize">{item.tipoReporte}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.estado.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.prioridad}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.tieneEvidencia ? (
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4 text-blue-500" />
                          <Video className="h-4 w-4 text-purple-500" />
                          <Mic className="h-4 w-4 text-orange-500" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{item.usuarioReportador || "Anónimo"}</TableCell>
                    <TableCell className="text-sm">{formatDate(item.horaReporte)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {historial.length} de {pagination.total} registros
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {page} de {pagination.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
