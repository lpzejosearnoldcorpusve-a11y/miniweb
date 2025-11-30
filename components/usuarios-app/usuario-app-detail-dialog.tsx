"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, CreditCard, Calendar, Phone, MapPin, Shield, Clock } from "lucide-react"
import type { UsuarioAppWithTarjetas } from "@/types"

interface UsuarioAppDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: UsuarioAppWithTarjetas
}

export function UsuarioAppDetailDialog({ open, onOpenChange, usuario }: UsuarioAppDetailDialogProps) {
  const formatDate = (date: Date | string | null) => {
    if (!date) return "No disponible"
    return new Date(date).toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return <Badge className="bg-green-500/10 text-green-600">Activo</Badge>
      case "inactivo":
        return <Badge variant="secondary">Inactivo</Badge>
      case "suspendido":
        return <Badge variant="destructive">Suspendido</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Detalles del Usuario
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {usuario.nombres} {usuario.apellidoPaterno} {usuario.apellidoMaterno}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    C.I.: {usuario.carnetIdentidad}
                    {usuario.complemento && ` ${usuario.complemento}`}
                  </p>
                </div>
                {getEstadoBadge(usuario.estado)}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Ciudad</p>
                <p className="font-medium">{usuario.ciudad}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Celular</p>
                <p className="font-medium">{usuario.celular}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Fecha de Nacimiento</p>
                <p className="font-medium">
                  {usuario.fechaNacimiento
                    ? new Date(usuario.fechaNacimiento).toLocaleDateString("es-BO")
                    : "No disponible"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Sesiones Activas</p>
                <p className="font-medium">{usuario.tokensActivos || 0} tokens</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold">
              <CreditCard className="h-4 w-4" />
              Tarjetas Vinculadas ({usuario.tarjetas?.length || 0})
            </h4>
            {usuario.tarjetas && usuario.tarjetas.length > 0 ? (
              <div className="space-y-2">
                {usuario.tarjetas.map((tarjeta) => (
                  <div key={tarjeta.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <code className="rounded bg-muted px-2 py-1 text-sm">{tarjeta.uid}</code>
                      <p className="mt-1 text-sm text-muted-foreground">{tarjeta.nombre}</p>
                    </div>
                    <Badge variant="outline">Bs. {tarjeta.montoBs.toFixed(2)}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay tarjetas vinculadas</p>
            )}
          </div>

          <Separator />

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Última conexión: {formatDate(usuario.ultimaConexion)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Registrado: {formatDate(usuario.createdAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
