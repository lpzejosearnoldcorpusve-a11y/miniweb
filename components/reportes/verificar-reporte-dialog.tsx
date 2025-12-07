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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useReportes } from "@/hooks/use-reportes"
import { AlertTriangle, CheckCircle } from "lucide-react"
import type { ReporteTrameajeWithDetails } from "@/types/reportes"

interface VerificarReporteDialogProps {
  reporte: ReporteTrameajeWithDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function VerificarReporteDialog({ reporte, open, onOpenChange, onSuccess }: VerificarReporteDialogProps) {
  const [generarInfraccion, setGenerarInfraccion] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { verificarReporte } = useReportes()

  if (!reporte) return null

  const handleVerificar = async () => {
    setIsLoading(true)
    try {
      // TODO: Get actual user ID from session
      const result = await verificarReporte(reporte.id, "system-user", generarInfraccion)
      if (result.success) {
        onSuccess()
        onOpenChange(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Verificar Reporte
          </DialogTitle>
          <DialogDescription>
            Confirma la verificación del reporte de trameaje para la placa{" "}
            <span className="font-mono font-bold">{reporte.placa}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Información del Reporte</p>
                <ul className="mt-2 space-y-1 text-sm text-yellow-700">
                  <li>
                    <strong>Placa:</strong> {reporte.placa}
                  </li>
                  <li>
                    <strong>Línea:</strong> {reporte.linea}
                  </li>
                  <li>
                    <strong>Tipo:</strong> {reporte.tipoReporte}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="generar-infraccion"
              checked={generarInfraccion}
              onCheckedChange={(checked) => setGenerarInfraccion(checked as boolean)}
            />
            <Label htmlFor="generar-infraccion" className="text-sm">
              Generar infracción automática (Bs. 100)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleVerificar} disabled={isLoading}>
            {isLoading ? "Verificando..." : "Verificar Reporte"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
