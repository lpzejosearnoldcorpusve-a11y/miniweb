"use client"

import { useState } from "react"
import { useTelefericos } from "@/hooks/use-transport"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Plus, CableCar, MapPin } from "lucide-react" 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TelefericoForm } from "./teleferico-form"
import MapWrapper from "@/components/maps/map-wrapper"

export function TelefericoView() {
  const { telefericos, isLoading } = useTelefericos()
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end"><Skeleton className="h-10 w-40" /></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[350px] rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Red de Teleféricos</h2>
          <p className="text-muted-foreground">Administra las líneas y estaciones de Mi Teleférico.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6A0DAD] hover:bg-[#580b91] text-white shadow-md transition-transform hover:scale-105">
              <Plus className="mr-2 h-4 w-4" /> Nueva Línea
            </Button>
          </DialogTrigger>
          {/* SOLUCIÓN Z-INDEX: z-[9999] asegura que el modal tape cualquier mapa */}
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CableCar className="h-5 w-5 text-[#6A0DAD]" />
                Crear Línea de Teleférico
              </DialogTitle>
            </DialogHeader>
            <TelefericoForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {telefericos.map((t) => (
          <Card 
            key={t.id} 
            className="group overflow-hidden border-t-4 transition-all hover:shadow-lg"
            // Aquí aplicamos el color dinámico al borde superior
            style={{ borderColor: t.color || '#ccc' }} 
          >
            <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-lg">
                    {/* El icono también toma el color de la línea */}
                    <div 
                        className="p-2 rounded-full bg-white shadow-sm"
                        style={{ color: t.color }}
                    >
                        <CableCar className="h-5 w-5" />
                    </div>
                    {t.nombre}
                </CardTitle>
                {/* Indicador visual de color */}
                <div 
                    className="h-3 w-3 rounded-full shadow-sm ring-2 ring-white" 
                    style={{ backgroundColor: t.color }} 
                    title={`Color: ${t.color}`}
                />
              </div>
              <CardDescription className="flex items-center gap-1 mt-1">
                 <MapPin className="h-3 w-3" /> {t.estaciones.length} Estaciones registradas
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 relative">
              <div className="h-[200px] w-full bg-slate-100 relative z-0">
              
                 <div className="absolute inset-0 pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
                    <MapWrapper
                    mode="view"
                    route={t.estaciones.sort((a, b) => a.orden - b.orden).map((e) => ({ lat: e.lat, lng: e.lng }))}
                    center={t.estaciones[0] ? [t.estaciones[0].lat, t.estaciones[0].lng] : undefined}
                    zoom={13}
                    color={t.color} 
                    />
                 </div>
              </div>

              <div className="p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Estaciones
                </p>
                <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto custom-scrollbar pr-1">
                  {t.estaciones
                    .sort((a, b) => a.orden - b.orden)
                    .map((e) => (
                      <Badge 
                        key={e.id} 
                        variant="outline"
                        className="bg-white hover:bg-slate-50 text-xs font-normal"
                        // Borde sutil del color de la línea
                        style={{ borderColor: `${t.color}40` }} // 40 añade transparencia al hex
                      >
                        <span 
                            className="mr-1.5 font-bold text-[10px]" 
                            style={{ color: t.color }}
                        >
                            {e.orden}
                        </span>
                        {e.nombre}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-3 bg-slate-50 border-t flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs h-8 hover:text-[#6A0DAD]">
                    Editar Línea
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}