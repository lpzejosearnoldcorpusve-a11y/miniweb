"use client"

import { useState, useMemo } from "react"
import { useMinibuses } from "@/hooks/use-transport"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Plus, Bus, MapPin, Activity, Navigation, Users, Clock, ArrowRight, TrendingUp } from "lucide-react"
import { MinibusForm } from "./minibus-form"
import MapWrapper from "@/components/maps/map-wrapper"
import { motion } from "framer-motion"

// Componente para los contadores superiores
const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card border rounded-xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden group"
  >
    <div className={`absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
      <Icon className="w-24 h-24 transform rotate-12 -translate-y-4 translate-x-4" />
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold tracking-tight mt-1">{value}</h3>
      {trend && <p className="text-xs text-green-500 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1"/> {trend}</p>}
    </div>
    <div className={`p-3 rounded-full ${color} bg-opacity-10 text-white`}> 
       <Icon className={`w-5 h-5 text-foreground`} />
    </div>
  </motion.div>
)

export function MinibusView() {
  const { minibuses, isLoading } = useMinibuses()
  const [openForm, setOpenForm] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null)

  // Calcular estadísticas rápidas
  const stats = useMemo(() => {
    if (!minibuses) return { total: 0, active: 0, points: 0 };
    return {
      total: minibuses.length,
      active: minibuses.length, // Aquí podrías filtrar por estado real
      points: minibuses.reduce((acc, curr) => acc + (curr.ruta?.length || 0), 0)
    };
  }, [minibuses]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[320px] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-2">
      {/* 1. Encabezado y Estadísticas */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Control de Rutas
            </h2>
            <p className="text-muted-foreground mt-1">Gestión estratégica de transporte urbano.</p>
          </div>
          
          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-[#00AEEF] hover:bg-[#009bd5] text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                <Plus className="mr-2 h-5 w-5" /> 
                Nueva Ruta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Ruta</DialogTitle>
              </DialogHeader>
              <MinibusForm onSuccess={() => setOpenForm(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Dashboard de Contadores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Rutas Activas" value={stats.total} icon={Bus} color="bg-blue-500" trend="+2 nuevas hoy" />
          <StatCard title="Puntos de Control" value={stats.points} icon={MapPin} color="bg-indigo-500" />
          <StatCard title="Flota Operativa" value="98%" icon={Activity} color="bg-emerald-500" trend="Estable" />
        </div>
      </div>

      {/* 2. Grid de Tarjetas Modernas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {minibuses.map((m, index) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="h-full"
          >
            <Card className="group h-full overflow-hidden border-border/50 bg-gradient-to-b from-card to-card/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col relative">
              
              {/* Badge Flotante de Estado */}
              <div className="absolute top-3 right-3 z-20">
                <Badge variant="outline" className="bg-white/90 dark:bg-black/50 backdrop-blur text-xs font-semibold border-green-500 text-green-600 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"/>
                  En Servicio
                </Badge>
              </div>

              {/* Área del Mapa (Header Visual) */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {m.ruta && m.ruta.length > 0 ? (
                    <div className="w-full h-full pointer-events-none grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out">
                        <MapWrapper
                          mode="view" 
                          center={[m.ruta[0].lat, m.ruta[0].lng]}
                          route={m.ruta}
                          zoom={13}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/50">
                        <Navigation className="h-10 w-10 opacity-20" />
                    </div>
                )}

                {/* Título sobre la imagen */}
                <div className="absolute bottom-3 left-3 z-20 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-[#00AEEF] hover:bg-[#00AEEF] border-0 font-bold px-2 py-0.5 text-[10px]">
                      LINEA {m.linea}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg leading-none shadow-black drop-shadow-md">
                    {m.sindicato}
                  </h3>
                </div>
              </div>

              <CardContent className="p-4 flex-grow flex flex-col gap-3">
                <div className="flex items-start justify-between">
                   <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Recorrido Principal</p>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-[#00AEEF]" />
                        {m.rutaNombre || "Ruta Estándar"}
                      </div>
                   </div>
                </div>

                {/* Métricas pequeñas dentro de la card */}
                <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-dashed">
                    <div className="flex flex-col justify-center p-2 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                            <Navigation className="h-3 w-3" /> Puntos
                        </div>
                        <span className="text-sm font-bold">{m.ruta?.length || 0}</span>
                    </div>
                    <div className="flex flex-col justify-center p-2 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                            <Users className="h-3 w-3" /> Capacidad
                        </div>
                        <span className="text-sm font-bold">14 Pas.</span>
                    </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-3 bg-secondary/10 border-t flex justify-between items-center group-hover:bg-[#00AEEF]/5 transition-colors">
                 <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" /> Actualizado hoy
                 </div>
                 
                 <Sheet>
                   <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-[#00AEEF] hover:text-[#00AEEF] hover:bg-[#00AEEF]/10 px-3 group/btn">
                        Ver Detalles <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                   </SheetTrigger>
                   <SheetContent className="w-[400px] sm:w-[540px] z-[9999]">
                     <SheetHeader>
                       <SheetTitle className="flex items-center gap-2 text-2xl">
                          <span className="bg-[#00AEEF] text-white px-2 py-1 rounded text-lg">L-{m.linea}</span> 
                          {m.sindicato}
                       </SheetTitle>
                       <SheetDescription>
                         Detalle completo de la ruta y paradas.
                       </SheetDescription>
                     </SheetHeader>
                     
                     <div className="mt-6 space-y-6">
                        <div className="h-[300px] w-full rounded-xl overflow-hidden border relative">
                           {/* Aquí iría el mapa interactivo completo */}
                           {m.ruta && <MapWrapper mode="view" center={[m.ruta[0].lat, m.ruta[0].lng]} route={m.ruta} zoom={14} />}
                           <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-mono border">
                              {m.ruta?.length} Waypoints
                           </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2"><Bus className="w-4 h-4"/> Flota Asignada</h4>
                            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                <p className="text-sm text-muted-foreground">Información detallada de los vehículos y choferes asignados a esta línea...</p>
                                {/* Aquí podrías poner una lista de placas o choferes */}
                            </div>
                        </div>
                     </div>
                   </SheetContent>
                 </Sheet>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}