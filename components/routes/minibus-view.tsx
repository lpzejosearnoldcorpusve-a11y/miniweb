"use client"

import { useState } from "react"
import { useMinibuses } from "@/hooks/use-transport"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Bus, MapPin, Info } from "lucide-react"
import { MinibusForm } from "./minibus-form"
import MapWrapper from "@/components/maps/map-wrapper"

export function MinibusView() {
  const { minibuses, isLoading } = useMinibuses()
  const [open, setOpen] = useState(false)

  // Estado de carga (Skeleton UI) para mejor percepción de velocidad
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[300px] rounded-xl border bg-card text-card-foreground shadow" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-1">
      {/* Header con acción principal destacada */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Rutas</h2>
          <p className="text-muted-foreground">Administra las líneas y recorridos de los sindicatos.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00AEEF] hover:bg-[#009bd5] text-white shadow-md transition-all hover:scale-105">
              <Plus className="mr-2 h-4 w-4" /> 
              Nuevo Sindicato/Ruta
            </Button>
          </DialogTrigger>
          {/* Z-index alto para asegurar que el modal cubra los mapas */}
          <DialogContent className="max-w-4xl max-h-[90vh] w-full overflow-y-auto z-[9999]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Bus className="h-5 w-5 text-[#00AEEF]" />
                Registrar Nueva Ruta
              </DialogTitle>
            </DialogHeader>
            <MinibusForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {minibuses.map((m) => (
          <Card key={m.id} className="group overflow-hidden border-muted/60 hover:border-[#00AEEF]/50 transition-colors shadow-sm hover:shadow-md flex flex-col">
            <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    Linea {m.linea}
                  </CardTitle>
                  <Badge variant="secondary" className="font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
                    {m.sindicato}
                  </Badge>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                   <Bus className="h-4 w-4 text-slate-500" />
                </div>
              </div>
              <CardDescription className="flex items-center gap-1 mt-2 text-xs line-clamp-1">
                 <MapPin className="h-3 w-3" /> {m.rutaNombre || "Ruta principal"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0 flex-grow relative min-h-[200px]">
              {/* Contenedor del mapa con z-index controlado y overflow hidden */}
              <div className="absolute inset-0 w-full h-full bg-slate-100 z-0">
                {/* Renderizado condicional: Si no hay ruta, mostrar placeholder */}
                {m.ruta && m.ruta.length > 0 ? (
                    <div className="w-full h-full pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
                    
                        <MapWrapper
                        mode="view" 
                        center={[m.ruta[0].lat, m.ruta[0].lng]}
                        route={m.ruta}
                        zoom={13}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        Sin ruta trazada
                    </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="p-3 border-t bg-white dark:bg-background z-10 relative text-xs text-muted-foreground flex justify-between">
                <span>{m.ruta?.length || 0} puntos de control</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs hover:text-[#00AEEF]">
                    Ver detalles
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}