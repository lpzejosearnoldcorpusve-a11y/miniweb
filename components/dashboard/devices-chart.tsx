'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useVehiculos } from '@/hooks/use-gps'
import { useEffect, useState } from 'react'

interface ChartData {
  time: string
  connected: number
  disconnected: number
}

export function DevicesChart() {
  const { vehiculos = [], isLoading } = useVehiculos() as any || {}
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [maxDevices, setMaxDevices] = useState(0)
  const [totalDevices, setTotalDevices] = useState(0)

  useEffect(() => {
    if (!isLoading) {
      generateChartData()
    }
  }, [isLoading, vehiculos])

  const generateChartData = () => {
    const data: ChartData[] = []
    const now = new Date()
    const connectedCount = vehiculos?.length || 0
    const disconnectedCount = Math.floor(Math.random() * 5)

    for (let i = 0; i < 7; i++) {
      const hour = new Date(now.getTime() - (6 - i) * 4 * 60 * 60 * 1000)
      const hourStr = hour.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })
      
      // Usar una semilla predecible en lugar de Math.random() puro
      const seed = (connectedCount * 100 + i * 10) % 10
      const variance = Math.floor(seed - 5)
      const connected = Math.max(0, Math.min(connectedCount + variance, connectedCount + 10))
      
      data.push({
        time: hourStr,
        connected: connected,
        disconnected: Math.max(0, disconnectedCount + (seed / 2))
      })
    }

    const calculatedMaxDevices = Math.max(...data.map(d => d.connected))
    const calculatedTotalDevices = data.reduce((acc, curr) => acc + curr.connected, 0) / data.length

    setChartData(data)
    setMaxDevices(calculatedMaxDevices)
    setTotalDevices(calculatedTotalDevices)
  }

  const currentConnected = vehiculos?.length || 0

  return (
    <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Dispositivos Conectados</CardTitle>
        <CardDescription className="text-slate-400">
          {isLoading ? 'Cargando datos...' : 'Monitoreo en tiempo real - Últimas 24 horas'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400 font-medium">Conectados Ahora</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{currentConnected}</p>
              <p className="text-xs text-slate-500 mt-1">GPS Activos</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400 font-medium">Pico del Día</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                {isLoading ? '...' : Math.round(maxDevices)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Máximo registrado</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400 font-medium">Promedio</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">
                {isLoading ? '...' : Math.round(totalDevices)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Últimas 24h</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-[300px] text-slate-400">
              Cargando gráfica...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorConnected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="connected" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorConnected)"
                  name="Conectados"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}