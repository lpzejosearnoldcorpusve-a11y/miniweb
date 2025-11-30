"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useUsuariosAppMutations } from "@/hooks/use-usuarios-app"
import { useTarjetas } from "@/hooks/use-tarjetas"
import { Loader2, CreditCard, X } from "lucide-react"
import type { UsuarioAppWithTarjetas } from "@/types"

interface VincularTarjetaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: UsuarioAppWithTarjetas
}

export function VincularTarjetaDialog({ open, onOpenChange, usuario }: VincularTarjetaDialogProps) {
  const { vincularTarjeta, desvincularTarjeta } = useUsuariosAppMutations()
  const { tarjetas } = useTarjetas()
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")

  // Filter tarjetas not linked to any user
  const availableTarjetas = (tarjetas ?? []).filter((t) => !t.usuarioAppId && t.uid.includes(search.toUpperCase()))

  const handleVincular = async (tarjetaId: string) => {
    setIsLoading(true)
    try {
      await vincularTarjeta(usuario.id, tarjetaId)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDesvincular = async (tarjetaId: string) => {
    setIsLoading(true)
    try {
      await desvincularTarjeta(tarjetaId, usuario.id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Gestionar Tarjetas
          </DialogTitle>
          <DialogDescription>
            Vincule o desvincule tarjetas RFID para{" "}
            <strong>
              {usuario.nombres} {usuario.apellidoPaterno}
            </strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {usuario.tarjetas && usuario.tarjetas.length > 0 && (
            <div className="space-y-2">
              <Label>Tarjetas Vinculadas</Label>
              <div className="space-y-2">
                {usuario.tarjetas.map((tarjeta) => (
                  <div key={tarjeta.id} className="flex items-center justify-between rounded-lg border bg-muted/30 p-2">
                    <div className="flex items-center gap-2">
                      <code className="text-sm">{tarjeta.uid}</code>
                      <Badge variant="outline">Bs. {tarjeta.montoBs.toFixed(2)}</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDesvincular(tarjeta.id)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="search">Buscar Tarjeta Disponible</Label>
            <Input
              id="search"
              placeholder="Buscar por UID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-48 space-y-2 overflow-y-auto">
            {availableTarjetas.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No hay tarjetas disponibles</p>
            ) : (
              availableTarjetas.map((tarjeta) => (
                <div key={tarjeta.id} className="flex items-center justify-between rounded-lg border p-2">
                  <div>
                    <code className="text-sm">{tarjeta.uid}</code>
                    <p className="text-xs text-muted-foreground">{tarjeta.nombre}</p>
                  </div>
                  <Button size="sm" onClick={() => handleVincular(tarjeta.id)} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Vincular"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
