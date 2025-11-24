"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateTarjeta, useUpdateTarjeta, useTarjetas } from "@/hooks/use-tarjetas"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Scan, CheckCircle, AlertCircle } from "lucide-react"
import type { TarjetaRfid } from "@/types"

interface TarjetaFormDialogProps {
  tarjeta?: TarjetaRfid
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function TarjetaFormDialog({ tarjeta, open, onOpenChange, onSuccess }: TarjetaFormDialogProps) {
  const { createTarjeta, isCreating } = useCreateTarjeta()
  const { updateTarjeta, isUpdating } = useUpdateTarjeta()
  const { mutate } = useTarjetas()
  const { toast } = useToast()

  const [uid, setUid] = useState("")
  const [nombre, setNombre] = useState("")
  const [celular, setCelular] = useState("")
  const [montoBs, setMontoBs] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "found" | "exists">("idle")

  // Cleanup scanning when dialog closes
  useEffect(() => {
    if (!open) {
      setIsScanning(false)
      setScanStatus("idle")
    }
  }, [open])

  useEffect(() => {
    if (tarjeta) {
      setUid(tarjeta.uid)
      setNombre(tarjeta.nombre)
      setCelular(tarjeta.celular)
      setMontoBs(tarjeta.montoBs.toString())
      setScanStatus("idle")
    } else {
      // Reset form for new card
      setUid("")
      setNombre("")
      setCelular("")
      setMontoBs("0")
      setScanStatus("idle")

      // Auto-start scanning for new cards
      setTimeout(() => {
        if (open && !tarjeta) {
          scanCard()
        }
      }, 500) // Small delay to allow dialog to render
    }
  }, [tarjeta, open])

  // Función para escanear tarjeta desde ESP8266
  const scanCard = async () => {
    setIsScanning(true)
    setScanStatus("scanning")

    console.log("🔄 Iniciando escaneo de tarjetas...")

    try {
      // Hacer polling cada 1.5 segundos por máximo 60 segundos
      for (let i = 0; i < 40; i++) {
        console.log(`🔍 Intento ${i + 1}/40 - Consultando pendientes...`)

        const response = await fetch("/api/tarjetas?action=pending")
        const data = await response.json()

        console.log("📨 Respuesta del servidor:", data)

        if (data.uid) {
          console.log(`✅ UID encontrado: ${data.uid}`)

          // Verificar si la tarjeta ya está registrada
          const checkResponse = await fetch(`/api/tarjetas?uid=${data.uid}`)
          const checkData = await checkResponse.json()

          console.log("🔍 Estado de registro:", checkData)

          if (checkData.registered) {
            setScanStatus("exists")
            toast({
              title: "Tarjeta ya registrada",
              description: `La tarjeta ${data.uid} ya pertenece a ${checkData.data.nombre}`,
              variant: "destructive",
            })
            setIsScanning(false)
            // Continue scanning for another card
            setTimeout(() => scanCard(), 2000)
            return
          }

          // Tarjeta nueva encontrada
          setUid(data.uid)
          setScanStatus("found")
          toast({
            title: "Tarjeta detectada",
            description: `UID: ${data.uid}`,
          })
          setIsScanning(false)
          return
        }

        // Esperar 1.5 segundos antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      // Timeout - restart scanning
      setScanStatus("idle")
      toast({
        title: "Tiempo agotado",
        description: "Reiniciando escaneo... Acerca la tarjeta al lector.",
        variant: "destructive",
      })
      setTimeout(() => scanCard(), 2000)
    } catch (error) {
      console.error("❌ Error scanning card:", error)
      setScanStatus("idle")
      toast({
        title: "Error de conexión",
        description: "Verifica la conexión con el servidor. Reintentando...",
        variant: "destructive",
      })
      setTimeout(() => scanCard(), 3000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      uid,
      nombre,
      celular,
      monto_bs: Number.parseFloat(montoBs) || 0,
    }

    let result
    if (tarjeta) {
      result = await updateTarjeta(tarjeta.id, data)
    } else {
      result = await createTarjeta(data)
    }

    if (result.success) {
      toast({
        title: tarjeta ? "Tarjeta actualizada" : "Tarjeta creada",
        description: tarjeta ? "La tarjeta se actualizó correctamente" : "La tarjeta se registró correctamente",
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {tarjeta ? "Editar Tarjeta" : isScanning ? "Escaneando Tarjeta..." : scanStatus === "found" ? "Tarjeta Detectada" : "Nueva Tarjeta RFID"}
            {isScanning && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
            {scanStatus === "found" && <CheckCircle className="h-5 w-5 text-green-500" />}
          </DialogTitle>
        </DialogHeader>

        {/* Scanning overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-blue-50/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <div className="text-center space-y-4 p-6 bg-white rounded-lg shadow-lg border">
              <div className="flex justify-center">
                <div className="relative">
                  <Scan className="h-16 w-16 text-blue-500 animate-pulse" />
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-700">Escaneando tarjeta RFID</h3>
                <p className="text-sm text-blue-600">Acerca la tarjeta al lector ESP8266</p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo UID con funcionalidad de escaneo automático */}
          <div className="space-y-2">
            <Label htmlFor="uid">UID de la Tarjeta</Label>
            <div className="relative">
              <Input
                id="uid"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder={isScanning ? "Escaneando tarjeta..." : "04A36F1CF2"}
                required
                disabled={!!tarjeta || isScanning || scanStatus === "found"}
                className={`pr-10 ${
                  scanStatus === "found" 
                    ? "border-green-500 bg-green-50" 
                    : scanStatus === "exists" 
                      ? "border-red-500 bg-red-50" 
                      : isScanning 
                        ? "border-blue-500 bg-blue-50" 
                        : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isScanning ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                ) : scanStatus === "found" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : scanStatus === "exists" ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Scan className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
            
            {/* Status messages */}
            {isScanning && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded border border-blue-200">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Esperando detección de tarjeta RFID...</span>
              </div>
            )}
            
            {scanStatus === "found" && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                <CheckCircle className="h-4 w-4" />
                <span>Tarjeta detectada correctamente. Completa los datos para registrar.</span>
              </div>
            )}
            
            {scanStatus === "exists" && (
              <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded border border-orange-200">
                <AlertCircle className="h-4 w-4" />
                <span>Tarjeta ya registrada. Esperando nueva tarjeta...</span>
              </div>
            )}

            {!isScanning && scanStatus === "idle" && !tarjeta && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                <Scan className="h-4 w-4" />
                <span>Verifica que el ESP8266 esté conectado y funcionando.</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Carlos Mendoza"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="celular">Celular</Label>
            <Input
              id="celular"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              placeholder="71234567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto">Monto Inicial (Bs)</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              value={montoBs}
              onChange={(e) => setMontoBs(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={
                isCreating || 
                isUpdating || 
                isScanning || 
                (!tarjeta && scanStatus !== "found") ||
                !uid.trim() ||
                !nombre.trim() ||
                !celular.trim()
              } 
              className="bg-primary hover:bg-primary/90"
            >
              {(isCreating || isUpdating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {tarjeta ? "Actualizar" : "Registrar Tarjeta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
