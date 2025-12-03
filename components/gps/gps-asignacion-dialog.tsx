"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAsignacionesRuta } from "@/hooks/use-alertas"
import { useToast } from "@/hooks/use-toast"
import { useVehiculos } from "@/hooks/use-gps"
import { useTransportes } from "@/hooks/use-transport"
import { MapPin, AlertTriangle } from "lucide-react"

interface GpsAsignacionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GpsAsignacionDialog({ open, onOpenChange }: GpsAsignacionDialogProps) {
  const { crearAsignacion } = useAsignacionesRuta()
  const { toast } = useToast()
  
  // 1. Cargamos TODOS los datos necesarios aquí
  const { vehiculos } = useVehiculos()
  const { transportes, isLoading: isLoadingTransportes } = useTransportes()

  const [formData, setFormData] = useState({
    vehiculoId: "",
    transporteId: "",
    rutaId: "",
    toleranciaMetros: 100,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Obtener el transporte seleccionado con su información de ruta
  const transporteSeleccionado = transportes.find((t) => t.id === formData.transporteId)
  
  // SOLUCIÓN ELEGANTE: Usamos el rutaId que ya viene de la API de minibuses
  // Esto evita problemas de sincronización y fetches innecesarios
  const tieneRuta = transporteSeleccionado?.rutaId != null
  const rutaIdDelTransporte = transporteSeleccionado?.rutaId || ""

  // 2. Cuando seleccionas un transporte, automáticamente usamos su rutaId
  useEffect(() => {
    if (formData.transporteId && transporteSeleccionado) {
      // Usamos el rutaId que ya viene del transporte (de la API /api/minibuses)
      const rutaId = transporteSeleccionado.rutaId || ""
      setFormData((prev) => ({ ...prev, rutaId }))
      
      if (!rutaId) {
        console.warn(`Transporte ${formData.transporteId} no tiene ruta definida`)
      }
    } else {
      setFormData((prev) => ({ ...prev, rutaId: "" }))
    }
  }, [formData.transporteId, transporteSeleccionado])

  const handleSubmit = async () => {
    if (!formData.vehiculoId || !formData.transporteId || !formData.rutaId) return

    setIsSubmitting(true)
    try {
      const result = await crearAsignacion(formData)
      if (result.success) {
        onOpenChange(false)
        toast({
          title: "Asignación creada",
          description: "La ruta fue asignada correctamente",
        })
        // Resetear formulario
        setFormData({
          vehiculoId: "",
          transporteId: "",
          rutaId: "",
          toleranciaMetros: 100,
        })
      } else {
        toast({
          title: "Error al asignar ruta",
          description: result.error || "Error desconocido",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al asignar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Asignar Ruta a Vehículo
          </DialogTitle>
          <DialogDescription>
            Vincula un vehículo GPS a una línea de transporte específica.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* 1. SELECCIÓN DE VEHÍCULO */}
          <div className="space-y-2">
            <Label htmlFor="vehiculo">Vehículo (Placa)</Label>
            <Select
              value={formData.vehiculoId}
              onValueChange={(value) => setFormData({ ...formData, vehiculoId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar placa..." />
              </SelectTrigger>
              <SelectContent>
                {vehiculos.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.placa} {v.linea ? `- (Actual: ${v.linea})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. SELECCIÓN DE SINDICATO/LÍNEA */}
          <div className="space-y-2">
            <Label htmlFor="transporte">Línea de Transporte</Label>
            <Select
              value={formData.transporteId}
              onValueChange={(value) => setFormData({ ...formData, transporteId: value, rutaId: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingTransportes ? "Cargando..." : "Seleccionar Línea"} />
              </SelectTrigger>
              <SelectContent>
                {transportes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.sindicato} - Línea {t.linea}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. INFORMACIÓN DE RUTA (Automática) */}
          <div className="space-y-2">
            <Label>Recorrido / Ruta</Label>
            {!formData.transporteId ? (
              <div className="p-3 bg-slate-50 rounded-md border text-sm text-muted-foreground">
                Primero selecciona una línea de transporte
              </div>
            ) : tieneRuta ? (
              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                  ✓ Ruta vinculada automáticamente
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {transporteSeleccionado?.rutaNombre || "Recorrido principal"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  ID: {rutaIdDelTransporte.slice(0, 8)}...
                </p>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
                <p className="text-sm font-medium text-amber-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Sin ruta definida
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Este transporte no tiene un recorrido dibujado. 
                  Primero define la ruta en "Rutas de Transporte".
                </p>
              </div>
            )}
          </div>

          {/* 4. TOLERANCIA */}
          <div className="space-y-2">
            <div className="flex justify-between">
                <Label htmlFor="tolerancia">Tolerancia (Metros)</Label>
                <span className="text-xs text-muted-foreground">{formData.toleranciaMetros}m</span>
            </div>
            <Input
              id="tolerancia"
              type="number"
              min={50}
              max={500}
              value={formData.toleranciaMetros}
              onChange={(e) => setFormData({ ...formData, toleranciaMetros: Number(e.target.value) || 100 })}
            />
            <p className="text-xs text-muted-foreground">
              Distancia máxima permitida antes de generar alerta de desvío.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting || !formData.vehiculoId || !formData.rutaId || !tieneRuta}
          >
            {isSubmitting ? "Guardando..." : !tieneRuta && formData.transporteId ? "⚠ Sin ruta disponible" : "Asignar Ruta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}