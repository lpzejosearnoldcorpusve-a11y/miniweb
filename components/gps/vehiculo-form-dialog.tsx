"use client"

import type React from "react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useVehiculos } from "@/hooks/use-gps"
import { Loader2 } from "lucide-react"

interface VehiculoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VehiculoFormDialog({ open, onOpenChange }: VehiculoFormDialogProps) {
  const { createVehiculo } = useVehiculos()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    placa: "",
    linea: "",
    tipoVehiculo: "minibus",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createVehiculo(formData)
      if (result.success) {
        onOpenChange(false)
        setFormData({ placa: "", linea: "", tipoVehiculo: "minibus" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Vehículo</DialogTitle>
          <DialogDescription>Ingresa los datos del nuevo vehículo para el sistema GPS.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="placa">Placa del Vehículo</Label>
              <Input
                id="placa"
                placeholder="Ej: 2718CUD"
                value={formData.placa}
                onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="linea">Línea / Ruta</Label>
              <Input
                id="linea"
                placeholder="Ej: Línea 288"
                value={formData.linea}
                onChange={(e) => setFormData({ ...formData, linea: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo de Vehículo</Label>
              <Select
                value={formData.tipoVehiculo}
                onValueChange={(value) => setFormData({ ...formData, tipoVehiculo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minibus">Minibus</SelectItem>
                  <SelectItem value="micro">Micro</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="teleferico">Teleférico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrar Vehículo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
