# Dashboard Moderno - Documentación

## Descripción General

Se ha implementado un dashboard completamente renovado y moderno con los siguientes componentes:

## Componentes Creados

### 1. **StatsOverview** (`stats-overview.tsx`)
Componente que muestra las estadísticas principales del sistema:
- **Rutas Activas**: 8 de 10 disponibles
- **Usuarios Conectados**: 2,340 usuarios
- **Dispositivos GPS**: 38 conectados (98% disponibilidad)
- **Eficiencia del Sistema**: 94.5%
- Mini estadísticas de alertas críticas, servicios OK y uptime

### 2. **DevicesChart** (`devices-chart.tsx`)
Gráfico interactivo que muestra:
- Monitoreo de dispositivos conectados en tiempo real desde Firebase
- Datos de las últimas 24 horas
- Visualización con gráfico de área
- Estadísticas de dispositivos conectados, pico del día y promedio diario

### 3. **RoutesCard** (`routes-card.tsx`)
Tarjeta que muestra:
- Lista de rutas activas y minibuses
- Teleféricos con estado en tiempo real
- Número de pasajeros en cada ruta
- Estado de servicio (En Servicio, Inactiva, Mantenimiento)

### 4. **AlertsCard** (`alerts-card.tsx`)
Panel de alertas que incluye:
- Alertas críticas, de advertencia e informativas
- Clasificación por severidad
- Ruta afectada y hora del evento
- Indicador visual de alertas críticas activas

### 5. **ReportsCard** (`reports-card.tsx`)
Tarjeta de reportes que muestra:
- Reportes recientes y su estado
- Tipos: Incidentes, Mantenimiento, Pasajeros, Eficiencia
- Prioridad de cada reporte
- Estado: Pendiente, En Progreso, Completado

### 6. **LiveMonitor** (`live-monitor.tsx`)
Monitoreo en vivo con dos gráficos:
- **Gráfico de pastel**: Distribución de vehículos (Minibuses, Teleféricos, Otros)
- **Gráfico de barras**: Pasajeros por hora (Análisis de demanda)

### 7. **ConnectivityStatus** (`connectivity-status.tsx`)
Estado de conectividad del sistema:
- Porcentaje de disponibilidad general
- Dispositivos por tipo (GPS, Sensores IoT, WiFi, Servidores)
- Barras de progreso de conexión
- Estado general del sistema

## Características Principales

✨ **Diseño Moderno**
- Interfaz limpia y profesional
- Colores degradados y sombras suaves
- Responsivo en todos los dispositivos

📊 **Gráficos Interactivos**
- Gráficos de área, barras y pastel con Recharts
- Tooltips informativos
- Leyendas dinámicas

🔔 **Alertas en Tiempo Real**
- Sistema de alertas clasificadas por severidad
- Notificaciones visuales
- Indicadores de estado

📈 **Datos en Vivo**
- Monitoreo de dispositivos GPS desde Firebase
- Estadísticas actualizadas
- Historial de 24 horas

## Instalación

Se agregó la dependencia de gráficos necesaria:

```bash
npm install recharts
```

## Estructura de Grid

```
┌─────────────────────────────────────────────┐
│        Título y Descripción del Panel       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Stats Overview (4 columnas distribuidas)   │
│  - Rutas Activas                            │
│  - Usuarios Conectados                      │
│  - Dispositivos GPS                         │
│  - Eficiencia del Sistema                   │
└─────────────────────────────────────────────┘

┌───────────────────────────┬─────────────────┐
│   Dispositivos            │  Rutas Activas  │
│   Connected (Gráfico)     │  (Card)         │
│   Firebase Monitoring     │                 │
└───────────────────────────┴─────────────────┘

┌─────────────────────────┬─────────────────────┐
│   Alertas (Card)        │   Reportes          │
│   - Críticas            │   - Incidentes      │
│   - Advertencias        │   - Mantenimiento   │
│   - Informativas        │   - Pasajeros       │
└─────────────────────────┴─────────────────────┘

┌───────────────────────────────────────────────┐
│   Conectividad (Status Component)             │
│   - Dispositivos GPS, Sensores, WiFi, etc.   │
└───────────────────────────────────────────────┘

┌───────────────────────────┬────────────────────┐
│  Distribución Vehículos   │  Pasajeros por Hora│
│  (Pie Chart)              │  (Bar Chart)       │
└───────────────────────────┴────────────────────┘
```

## Uso

El dashboard se utiliza automáticamente en la página de control:

```tsx
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default function DashboardPage() {
  return <DashboardContent />
}
```

## Integraciones Futuras

Para conectar con datos reales, los componentes pueden ser actualizados con:
- Hooks personalizados (use-gps, use-reportes, use-alertas)
- Conexión a Firebase Realtime Database
- APIs del backend

## Configuración de Tailwind

Se utilizan las siguientes utilidades de Tailwind:
- Grid system (md:grid-cols-2, lg:grid-cols-3, etc.)
- Colores con opacidades (bg-red-500/10)
- Gradientes (from-slate-900 to-slate-800)
- Transiciones y animaciones

## Paleta de Colores Utilizada

| Color | Uso |
|-------|-----|
| Azul (#3b82f6) | Rutas, Dispositivos |
| Verde (#10b981) | Dispositivos Conectados, Estado OK |
| Rojo (#ef4444) | Alertas Críticas |
| Amarillo (#eab308) | Advertencias |
| Púrpura (#a855f7) | Teleféricos |
| Naranja (#f97316) | Otros datos |

---

**Última actualización**: 18/12/2025
