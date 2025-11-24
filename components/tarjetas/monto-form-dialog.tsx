"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateTarjeta, useTarjetas } from "@/hooks/use-tarjetas"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Minus } from "lucide-react"
import type { TarjetaRfid } from "@/types"

interface MontoFormDialogProps {
  tarjeta: TarjetaRfid
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function MontoFormDialog({ tarjeta, open, onOpenChange, onSuccess }: MontoFormDialogProps) {
  const { updateTarjeta, isUpdating } = useUpdateTarjeta()
  const { mutate } = useTarjetas()
  const { toast } = useToast()

  const [monto, setMonto] = useState("")

  useEffect(() => {
    setMonto("")
  }, [open])

  const handleSubmit = async (e: React.FormEvent, tipo: "agregar" | "restar") => {
    e.preventDefault()

    const montoNum = Number.parseFloat(monto) || 0
    if (montoNum <= 0) {
      toast({
        title: "Error",
        description: "El monto debe ser mayor a 0",
        variant: "destructive",
      })
      return
    }

    const nuevoMonto = tipo === "agregar" ? tarjeta.montoBs + montoNum : tarjeta.montoBs - montoNum

    if (nuevoMonto < 0) {
      toast({
        title: "Error",
        description: "El saldo no puede ser negativo",
        variant: "destructive",
      })
      return
    }

    const result = await updateTarjeta(tarjeta.id, { monto_bs: nuevoMonto })

    if (result.success) {
      toast({
        title: "Monto actualizado",
        description: `Nuevo saldo: Bs ${nuevoMonto.toFixed(2)}`,
      })
      mutate()
      onSuccess?.()
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestionar Saldo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Saldo actual</p>
            <p className="text-2xl font-bold">Bs {tarjeta.montoBs.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">{tarjeta.nombre}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto">Monto (Bs)</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={(e) => handleSubmit(e, "restar")}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Minus className="h-4 w-4 mr-2" />}
              Restar
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, "agregar")}
              disabled={isUpdating}
              className="bg-primary hover:bg-primary/90"
            >
              {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Agregar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
