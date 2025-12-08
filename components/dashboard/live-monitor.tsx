'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useVehiculos } from '@/hooks/use-gps'
import { useTelefericos } from '@/hooks/use-transport'

const COLORS = ['#3b82f6', '#f97316', '#8b5cf6']

export function LiveMonitor() {
  const { vehiculos = [], isLoading: vehiculosLoading } = useVehiculos() as any || {}
  const { telefericos = [], isLoading: telefericsLoading } = useTelefericos() as any || {}

  // Calcular distribución de vehículos
  const minibusCount = vehiculos?.length || 0
  const telefericoCount = telefericos?.length || 0
  const total = minibusCount + telefericoCount || 1

  const vehicleDistribution = [
    { 
      name: 'Minibuses', 
      value: Math.round((minibusCount / total) * 100) || 0, 
      fill: '#3b82f6' 
    },
    { 
      name: 'Teleféricos', 
      value: Math.round((telefericoCount / total) * 100) || 0, 
      fill: '#f97316' 
    },
  ].filter(v => v.value > 0)

  // Generar datos de pasajeros por hora
  const generateHourlyData = () => {
    const data = []
    const now = new Date()
    const basePassengers = 150

    for (let i = 6; i <= 20; i++) {
      const hour = `${String(i).padStart(2, '0')}:00`
      // Simular variación de pasajeros con pico en horas de punta
      const isPeakHour = i === 8 || i === 12 || i === 18
      const pasajeros = isPeakHour ? 
        basePassengers + Math.floor(Math.random() * 200) + 150 :
        basePassengers + Math.floor(Math.random() * 100)
      
      data.push({ hour, pasajeros })
    }
    return data
  }

  const hourlyPassengers = generateHourlyData()

  const isLoading = vehiculosLoading || telefericsLoading

  return (
    <div className="grid gap-4 md:grid-cols-2 col-span-1 md:col-span-2 lg:col-span-3">
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base">Distribución de Vehículos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              Cargando datos...
            </div>
          ) : vehicleDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vehicleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              No hay vehículos disponibles
            </div>
          )}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Minibuses:</span>
              <span className="font-semibold">{minibusCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Teleféricos:</span>
              <span className="font-semibold">{telefericoCount}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold">{total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base">Pasajeros por Hora</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              Cargando datos...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyPassengers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
                <Bar dataKey="pasajeros" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
