"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useInfracciones } from "@/hooks/use-reportes"
import { Receipt, CreditCard, CheckCircle } from "lucide-react"

export function InfraccionesPanel() {
  const { infracciones, isLoading, pagarInfraccion } = useInfracciones()

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handlePagar = async (id: string) => {
    await pagarInfraccion(id)
  }

  const totalPendiente = infracciones
    .filter((i) => i.estado === "pendiente")
    .reduce((sum, i) => sum + (i.montoBs || 0), 0)

  const totalPagado = infracciones.filter((i) => i.estado === "pagada").reduce((sum, i) => sum + (i.montoBs || 0), 0)

  return (
    <div className="space-y-4">
      {/* Resumen */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <Receipt className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-xl font-bold text-yellow-600">Bs. {totalPendiente.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recaudado</p>
              <p className="text-xl font-bold text-green-600">Bs. {totalPagado.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Infracciones</p>
              <p className="text-xl font-bold">{infracciones.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Registro de Infracciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Chofer</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Cargando infracciones...
                    </TableCell>
                  </TableRow>
                ) : infracciones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No hay infracciones registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  infracciones.map((infraccion) => (
                    <TableRow key={infraccion.id}>
                      <TableCell className="font-mono font-medium">{infraccion.placa?.placa || "-"}</TableCell>
                      <TableCell>
                        {infraccion.chofer ? `${infraccion.chofer.nombres} ${infraccion.chofer.apellidoPaterno}` : "-"}
                      </TableCell>
                      <TableCell className="capitalize">{infraccion.tipoInfraccion}</TableCell>
                      <TableCell className="font-medium">Bs. {infraccion.montoBs?.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{formatDate(infraccion.fechaInfraccion)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={infraccion.estado === "pagada" ? "default" : "secondary"}
                          className={
                            infraccion.estado === "pagada"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {infraccion.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {infraccion.estado === "pendiente" && (
                          <Button variant="outline" size="sm" onClick={() => handlePagar(infraccion.id)}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pagar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
