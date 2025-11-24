"use client"

import { useTarjetas } from "@/hooks/use-tarjetas"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { TarjetaActions } from "./tarjeta-actions"

export function TarjetasTable() {
  const { tarjetas, isLoading } = useTarjetas()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!tarjetas || tarjetas.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No hay tarjetas registradas. Agrega una nueva tarjeta para comenzar.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Celular</TableHead>
            <TableHead>Saldo (Bs)</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tarjetas.map((tarjeta) => (
            <TableRow key={tarjeta.id}>
              <TableCell className="font-mono">{tarjeta.uid}</TableCell>
              <TableCell>{tarjeta.nombre}</TableCell>
              <TableCell>{tarjeta.celular}</TableCell>
              <TableCell className="font-semibold">{tarjeta.montoBs.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={tarjeta.estado === "activa" ? "default" : "secondary"}>{tarjeta.estado}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <TarjetaActions tarjeta={tarjeta} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
