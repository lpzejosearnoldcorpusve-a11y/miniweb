"use client"

import { useState, useMemo } from "react"
import { useTelefericos } from "@/hooks/use-transport"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Plus, CableCar, MapPin, TrendingUp, Building2, Zap, ArrowRight, CircleDot } from "lucide-react"
import { TelefericoForm } from "./teleferico-form"
import MapWrapper from "@/components/maps/map-wrapper"
import { motion } from "framer-motion"

// Componente de Tarjeta de Estadística (Reutilizable para consistencia visual)
const StatCard = ({ title, value, icon: Icon, color, trend, subtext }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-card border rounded-xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden group"
  >
    <div className={`absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
      <Icon className="w-24 h-24 transform -rotate-12 translate-x-6 -translate-y-2" />
    </div>
    <div className="z-10">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold tracking-tight mt-1">{value}</h3>
      <div className="flex items-center gap-2 mt-1">
        {trend && <span className="text-xs text-green-500 flex items-center bg-green-500/10 px-1.5 py-0.5 rounded"><TrendingUp className="w-3 h-3 mr-1"/> {trend}</span>}
        {subtext && <span className="text-xs text-muted-foreground">{subtext}</span>}
      </div>
    </div>
    <div className={`p-3 rounded-2xl ${color} bg-opacity-10 shadow-inner`}> 
       <Icon className={`w-6 h-6 text-foreground`} />
    </div>
  </motion.div>
)

export function TelefericoView() {
  const { telefericos, isLoading } = useTelefericos()
  const [openForm, setOpenForm] = useState(false)

  // Cálculos rápidos para los stats
  const stats = useMemo(() => {
    if (!telefericos) return { lines: 0, stations: 0 };
    return {
      lines: telefericos.length,
      stations: telefericos.reduce((acc, t) => acc + (t.estaciones?.length || 0), 0),
      avgTime: "14 min" // Valor simulado o calculado si tuvieras datos de tiempo
    };
  }, [telefericos]);

  if (isLoading) {
    return (
      <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[400px] rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-2">
      {/* 1. Header & Stats Dashboard */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-700 to-indigo-500 bg-clip-text text-transparent">
              Red de Teleféricos
            </h2>
            <p className="text-muted-foreground mt-1">Administración de líneas aéreas y estaciones.</p>
          </div>
          
          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-[#6A0DAD] hover:bg-[#580b91] text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95">
                <Plus className="mr-2 h-5 w-5" /> Nueva Línea
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CableCar className="h-5 w-5 text-[#6A0DAD]" /> Crear Línea
                </DialogTitle>
              </DialogHeader>
              <TelefericoForm onSuccess={() => setOpenForm(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Líneas Operativas" value={stats.lines} icon={CableCar} color="bg-purple-500" trend="100% Funcional" />
          <StatCard title="Total Estaciones" value={stats.stations} icon={Building2} color="bg-pink-500" subtext="Interconectadas" />
          <StatCard title="Eficiencia Energética" value="94%" icon={Zap} color="bg-yellow-500" trend="+2.4%" />
        </div>
      </div>

      {/* 2. Grid de Líneas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {telefericos.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="h-full"
          >
            <Card 
                className="group h-full overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-2xl flex flex-col relative"
                // Sombra dinámica basada en el color de la línea
                style={{ boxShadow: `0 4px 20px -5px ${t.color}25` }}
            >
                {/* Borde superior de color */}
                <div className="h-2 w-full" style={{ backgroundColor: t.color }} />

                <CardHeader className="pb-2 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-sm z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div 
                                className="p-2.5 rounded-xl text-white shadow-lg transform group-hover:rotate-12 transition-transform duration-300"
                                style={{ backgroundColor: t.color }}
                            >
                                <CableCar className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold">{t.nombre}</CardTitle>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: t.color }}/>
                                    Operativo
                                </div>
                            </div>
                        </div>
                        {/* Indicador de precio o ID visual */}
                        <Badge variant="outline" className="text-xs font-mono opacity-60">
                            ID: {t.id?.toString().slice(0,4)}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="p-0 flex-grow relative min-h-[220px]">
                    {/* Mapa decorativo */}
                    <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800">
                        <div className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale-[20%] group-hover:grayscale-0">
                             <MapWrapper
                                mode="view"
                                route={t.estaciones.sort((a, b) => a.orden - b.orden).map((e) => ({ lat: e.lat, lng: e.lng }))}
                                center={t.estaciones[0] ? [t.estaciones[0].lat, t.estaciones[0].lng] : undefined}
                                zoom={13}
                                color={t.color} // Pasamos el color al componente del mapa para dibujar la polilínea
                            />
                        </div>
                        {/* Gradiente overlay para que el texto de abajo se lea bien */}
                        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-background to-transparent z-10" />
                    </div>
                    
                    {/* Resumen flotante sobre el mapa */}
                    <div className="absolute bottom-2 left-3 right-3 z-20 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {t.estaciones.slice(0, 3).map((e, i) => (
                             <Badge key={i} variant="secondary" className="bg-white/90 dark:bg-black/80 backdrop-blur shadow-sm border text-[10px] font-normal whitespace-nowrap">
                                <CircleDot className="w-2 h-2 mr-1" style={{color: t.color}}/> {e.nombre}
                             </Badge>
                        ))}
                        {t.estaciones.length > 3 && (
                            <Badge variant="secondary" className="bg-white/90 backdrop-blur text-[10px]">+ {t.estaciones.length - 3}</Badge>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="p-3 bg-background z-20 border-t flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground font-medium">
                        <Building2 className="w-3.5 h-3.5 mr-1.5" />
                        {t.estaciones.length} Estaciones
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-xs font-bold transition-colors hover:bg-opacity-10"
                                style={{ color: t.color }}
                            >
                                Ver Recorrido <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px] z-[9999] overflow-y-auto">
                            <SheetHeader className="mb-6">
                                <SheetTitle className="flex items-center gap-3 text-2xl">
                                    <div className="w-4 h-8 rounded-full" style={{ backgroundColor: t.color }}/>
                                    {t.nombre}
                                </SheetTitle>
                                <SheetDescription>
                                    Vista detallada de la línea y sus interconexiones.
                                </SheetDescription>
                            </SheetHeader>

                            {/* Contenido del Sheet */}
                            <div className="space-y-6">
                                {/* Mapa grande interactivo */}
                                <div className="h-[300px] w-full rounded-2xl overflow-hidden border shadow-inner relative">
                                    <MapWrapper
                                        mode="view" // Podrías cambiar a interactive={true} si el wrapper lo soporta
                                        route={t.estaciones.sort((a, b) => a.orden - b.orden).map((e) => ({ lat: e.lat, lng: e.lng }))}
                                        center={t.estaciones[0] ? [t.estaciones[0].lat, t.estaciones[0].lng] : undefined}
                                        zoom={14}
                                        color={t.color}
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm border">
                                        Tiempo aprox: ~{t.estaciones.length * 4} min
                                    </div>
                                </div>

                                {/* Timeline de Estaciones */}
                                <div className="relative pl-4 space-y-0">
                                    <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                                        <Building2 className="w-4 h-4"/> Lista de Estaciones
                                    </h4>
                                    
                                    {/* Línea vertical conectora */}
                                    <div 
                                        className="absolute left-[29px] top-10 bottom-6 w-0.5 opacity-30"
                                        style={{ backgroundColor: t.color }} 
                                    />

                                    <div className="space-y-4">
                                        {t.estaciones.sort((a, b) => a.orden - b.orden).map((e, idx) => (
                                            <div key={e.id} className="flex items-center gap-4 group/station relative">
                                                <div 
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md z-10 shrink-0 border-2 border-white dark:border-slate-900"
                                                    style={{ backgroundColor: t.color }}
                                                >
                                                    {e.orden}
                                                </div>
                                                <div className="flex-grow p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm">
                                                    <p className="font-medium text-sm">{e.nombre}</p>
                                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="w-3 h-3"/> Lat: {e.lat.toFixed(4)}, Lng: {e.lng.toFixed(4)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
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