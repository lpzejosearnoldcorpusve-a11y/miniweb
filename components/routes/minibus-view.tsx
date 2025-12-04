"use client"

import { useState, useMemo, memo, useCallback } from "react"
import { useMinibuses } from "@/hooks/use-transport"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Plus, Bus, MapPin, Activity, Navigation, Users, Clock, ArrowRight, TrendingUp, Map, Route } from "lucide-react"
import { MinibusForm } from "./minibus-form"
import MapWrapper from "@/components/maps/map-wrapper"
import { motion } from "framer-motion"

// Componente optimizado para stats
const StatCard = memo(({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-gradient-to-br from-card via-card to-card/80 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{title}</p>
        <h3 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {value}
        </h3>
        {trend && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-2 font-medium">
            <TrendingUp className="w-3 h-3 mr-1"/> {trend}
          </p>
        )}
      </div>
      <div className={`p-3.5 rounded-xl ${color} bg-opacity-10 backdrop-blur-sm relative overflow-hidden`}> 
        <div className={`absolute inset-0 ${color} opacity-10`} />
        <Icon className={`w-6 h-6 relative z-10`} style={{ color: color.replace('bg-', '').replace('-500', '') }} />
      </div>
    </div>
  </div>
))

StatCard.displayName = "StatCard"

// Visualización simplificada de la ruta con inicio y fin
const RoutePreview = memo(({ ruta, linea }: any) => {
  if (!ruta || ruta.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <div className="text-center">
          <Navigation className="h-12 w-12 opacity-20 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Sin ruta definida</p>
        </div>
      </div>
    )
  }

  const startPoint = ruta[0]
  const endPoint = ruta[ruta.length - 1]

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-950 dark:via-indigo-950 dark:to-blue-900 overflow-hidden">
      {/* Patrón de grid sutil */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(to right, currentColor 1px, transparent 1px),
          linear-gradient(to bottom, currentColor 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }} />
      
      {/* Línea de ruta decorativa */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative w-full h-1">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 rounded-full opacity-40 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full" />
          
          {/* Punto de inicio */}
          <div className="absolute -left-2 -top-3 w-7 h-7 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          
          {/* Punto de fin */}
          <div className="absolute -right-2 -top-3 w-7 h-7 bg-purple-500 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          
          {/* Puntos intermedios */}
          {ruta.length > 2 && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 flex gap-1">
              {[...Array(Math.min(3, ruta.length - 2))].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" 
                     style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info de puntos */}
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
        <div className="bg-white/95 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          Inicio
        </div>
        
        <div className="bg-white/95 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <Route className="w-3 h-3 text-blue-500" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{ruta.length} pts</span>
          </div>
        </div>
        
        <div className="bg-white/95 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg border border-purple-200 dark:border-purple-800 text-[10px] font-bold text-purple-600 dark:text-purple-400">
          Final
        </div>
      </div>
    </div>
  )
})

RoutePreview.displayName = "RoutePreview"

// Card de minibus optimizada
const MinibusCard = memo(({ minibus: m, index }: any) => {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden border hover:border-blue-200 dark:hover:border-blue-800 bg-card hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col relative">
        
        {/* Badge de estado */}
        <div className="absolute top-4 right-4 z-20">
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 border-0 text-white shadow-lg px-3 py-1 font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse"/>
            Activo
          </Badge>
        </div>

        {/* Preview de ruta simplificado */}
        <div className="relative h-52 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 pointer-events-none" />
          
          <RoutePreview ruta={m.ruta} linea={m.linea} />

          {/* Header flotante */}
          <div className="absolute bottom-4 left-4 z-20">
            <Badge className="bg-gradient-to-r from-[#00AEEF] to-blue-600 hover:from-[#00AEEF] hover:to-blue-600 border-0 font-black px-3 py-1 text-sm shadow-xl mb-2">
              LÍNEA {m.linea}
            </Badge>
            <h3 className="font-bold text-xl text-white drop-shadow-2xl leading-tight max-w-[250px]">
              {m.sindicato}
            </h3>
          </div>
        </div>

        <CardContent className="p-5 flex-grow flex flex-col gap-4">
          <div>
            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-blue-500" />
              <span>Recorrido Principal</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground bg-secondary/50 rounded-lg px-3 py-2">
              <MapPin className="h-4 w-4 text-[#00AEEF] flex-shrink-0" />
              <span className="truncate">{m.rutaNombre || "Ruta Estándar"}</span>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex flex-col justify-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-1.5 text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">
                <Navigation className="h-3 w-3" /> Waypoints
              </div>
              <span className="text-lg font-black text-blue-700 dark:text-blue-300">{m.ruta?.length || 0}</span>
            </div>
            <div className="flex flex-col justify-center p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase mb-1">
                <Users className="h-3 w-3" /> Pasajeros
              </div>
              <span className="text-lg font-black text-indigo-700 dark:text-indigo-300">14</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 bg-gradient-to-r from-secondary/30 to-secondary/10 border-t flex justify-between items-center backdrop-blur-sm">
          <div className="flex items-center text-xs text-muted-foreground font-medium">
            <Clock className="mr-1.5 h-3.5 w-3.5" /> 
            <span>Hace 2 horas</span>
          </div>
          
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 text-xs font-bold text-[#00AEEF] hover:text-white hover:bg-gradient-to-r hover:from-[#00AEEF] hover:to-blue-600 px-4 rounded-lg transition-all duration-300 group/btn"
              >
                Ver Mapa <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] z-[9999]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3 text-2xl">
                  <span className="bg-gradient-to-r from-[#00AEEF] to-blue-600 text-white px-3 py-1.5 rounded-lg text-lg font-black shadow-lg">
                    L-{m.linea}
                  </span> 
                  {m.sindicato}
                </SheetTitle>
                <SheetDescription className="text-base">
                  Visualización completa de la ruta y puntos de control.
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Solo cargar el mapa cuando el sheet esté abierto */}
                {sheetOpen && (
                  <div className="h-[350px] w-full rounded-2xl overflow-hidden border-2 border-blue-200 dark:border-blue-800 shadow-2xl relative">
                    {m.ruta && m.ruta.length > 0 && (
                      <MapWrapper 
                        mode="view" 
                        center={[m.ruta[0].lat, m.ruta[0].lng]} 
                        route={m.ruta} 
                        zoom={14} 
                      />
                    )}
                    <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/90 backdrop-blur-md px-4 py-2 rounded-xl font-bold border-2 border-blue-200 dark:border-blue-800 shadow-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">Inicio</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/95 dark:bg-black/90 backdrop-blur-md px-4 py-2 rounded-xl font-bold border-2 border-blue-200 dark:border-blue-800 shadow-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-xs text-purple-600 dark:text-purple-400">Final</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-black/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold border-2 border-blue-200 dark:border-blue-800 shadow-xl">
                      {m.ruta?.length} Puntos de Control
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <Bus className="w-5 h-5 text-[#00AEEF]"/> 
                    Información de Flota
                  </h4>
                  <div className="p-5 border-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-sm font-semibold text-muted-foreground">Capacidad</span>
                      <span className="text-lg font-bold">14 pasajeros</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-sm font-semibold text-muted-foreground">Frecuencia</span>
                      <span className="text-lg font-bold">8-12 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-muted-foreground">Estado</span>
                      <Badge className="bg-emerald-500 text-white">Operativo</Badge>
                    </div>
                  </div>
                </div>

                {/* Coordenadas de inicio y fin */}
                {m.ruta && m.ruta.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#00AEEF]"/> 
                      Coordenadas de Ruta
                    </h4>
                    <div className="grid gap-3">
                      <div className="p-4 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">Punto Inicial</span>
                        </div>
                        <code className="text-xs font-mono text-muted-foreground">
                          {m.ruta[0].lat.toFixed(6)}, {m.ruta[0].lng.toFixed(6)}
                        </code>
                      </div>
                      <div className="p-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500" />
                          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase">Punto Final</span>
                        </div>
                        <code className="text-xs font-mono text-muted-foreground">
                          {m.ruta[m.ruta.length - 1].lat.toFixed(6)}, {m.ruta[m.ruta.length - 1].lng.toFixed(6)}
                        </code>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </CardFooter>
      </Card>
    </motion.div>
  )
})

MinibusCard.displayName = "MinibusCard"

export function MinibusView() {
  const { minibuses, isLoading } = useMinibuses()
  const [openForm, setOpenForm] = useState(false)

  // Calcular estadísticas (memoizado)
  const stats = useMemo(() => {
    if (!minibuses) return { total: 0, active: 0, points: 0 };
    return {
      total: minibuses.length,
      active: minibuses.length,
      points: minibuses.reduce((acc, curr) => acc + (curr.ruta?.length || 0), 0)
    };
  }, [minibuses]);

  const handleFormSuccess = useCallback(() => {
    setOpenForm(false)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6 p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-[400px] rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-blue-700 dark:from-white dark:via-blue-200 dark:to-blue-400 bg-clip-text text-transparent">
              Control de Rutas
            </h2>
            <p className="text-muted-foreground mt-2 text-base">Sistema integral de gestión de transporte público.</p>
          </div>
          
          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-[#00AEEF] to-blue-600 hover:from-[#009bd5] hover:to-blue-700 text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 font-bold px-6 rounded-xl">
                <Plus className="mr-2 h-5 w-5" /> 
                Nueva Ruta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Registrar Nueva Ruta</DialogTitle>
              </DialogHeader>
              <MinibusForm onSuccess={handleFormSuccess} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Rutas Activas" 
            value={stats.total} 
            icon={Bus} 
            color="bg-blue-500" 
            trend="+2 hoy" 
          />
          <StatCard 
            title="Puntos de Control" 
            value={stats.points} 
            icon={MapPin} 
            color="bg-indigo-500" 
          />
          <StatCard 
            title="Flota Operativa" 
            value="98%" 
            icon={Activity} 
            color="bg-emerald-500" 
            trend="Estable" 
          />
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {minibuses.map((m, index) => (
          <MinibusCard key={m.id} minibus={m} index={index} />
        ))}
      </div>
    </div>
  )
}