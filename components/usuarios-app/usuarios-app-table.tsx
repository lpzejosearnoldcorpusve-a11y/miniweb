"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Users } from "lucide-react"
import { UsuarioAppActions } from "./usuario-app-actions"
import type { UsuarioAppWithTarjetas } from "@/types"

interface UsuariosAppTableProps {
  usuarios: UsuarioAppWithTarjetas[]
}

export function UsuariosAppTable({ usuarios }: UsuariosAppTableProps) {
  const [search, setSearch] = useState("")

  const filteredUsuarios = usuarios.filter((usuario) => {
    const searchLower = search.toLowerCase()
    return (
      usuario.nombres.toLowerCase().includes(searchLower) ||
      usuario.apellidoPaterno.toLowerCase().includes(searchLower) ||
      usuario.apellidoMaterno.toLowerCase().includes(searchLower) ||
      usuario.carnetIdentidad.includes(search) ||
      usuario.celular.includes(search)
    )
  })

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Activo</Badge>
      case "inactivo":
        return <Badge variant="secondary">Inactivo</Badge>
      case "suspendido":
        return <Badge variant="destructive">Suspendido</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Nunca"
    return new Date(date).toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Lista de Usuarios</CardTitle>
            <Badge variant="secondary" className="ml-2">
              {filteredUsuarios.length}
            </Badge>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, CI o celular..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Nombre Completo</TableHead>
                <TableHead className="font-semibold">C.I.</TableHead>
                <TableHead className="font-semibold">Ciudad</TableHead>
                <TableHead className="font-semibold">Celular</TableHead>
                <TableHead className="font-semibold">Tarjetas</TableHead>
                <TableHead className="font-semibold">Última Conexión</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="h-8 w-8" />
                      <p>No hay usuarios registrados</p>
                      <p className="text-sm">Los usuarios de la app aparecerán aquí</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id} className="group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {usuario.nombres} {usuario.apellidoPaterno}
                        </span>
                        <span className="text-sm text-muted-foreground">{usuario.apellidoMaterno}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-1 text-sm">
                        {usuario.carnetIdentidad}
                        {usuario.complemento && ` ${usuario.complemento}`}
                      </code>
                    </TableCell>
                    <TableCell>{usuario.ciudad}</TableCell>
                    <TableCell>{usuario.celular}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {usuario.tarjetas?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(usuario.ultimaConexion)}
                    </TableCell>
                    <TableCell>{getEstadoBadge(usuario.estado)}</TableCell>
                    <TableCell className="text-right">
                      <UsuarioAppActions usuario={usuario} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
