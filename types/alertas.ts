import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type { alertasGps, asignacionesRuta } from "@/db/schema"

// Alert Types
export type AlertaGps = InferSelectModel<typeof alertasGps>
export type NewAlertaGps = InferInsertModel<typeof alertasGps>

// Route Assignment Types
export type AsignacionRuta = InferSelectModel<typeof asignacionesRuta>
export type NewAsignacionRuta = InferInsertModel<typeof asignacionesRuta>

// Alert type enum
export type TipoAlerta = "desvio_ruta" | "fuera_servicio" | "velocidad_excesiva" | "sin_movimiento"

// Severity enum
export type SeveridadAlerta = "baja" | "media" | "alta" | "critica"

// Alert status enum
export type EstadoAlerta = "activa" | "revisada" | "resuelta" | "ignorada"

// Extended alert with vehicle info
export interface AlertaConDetalles extends AlertaGps {
  vehiculo?: {
    placa: string
    linea: string
    tipoVehiculo: string
  }
  transporte?: {
    sindicato: string
    linea: string
    rutaNombre: string
  }
}

// Route deviation check result
export interface ResultadoVerificacionRuta {
  enRuta: boolean
  distanciaDesvio: number // in meters
  puntoMasCercano: { lat: number; lng: number }
  alertaGenerada: boolean
  alertaId?: string
}

// Alert statistics
export interface EstadisticasAlertas {
  totalActivas: number
  totalHoy: number
  porTipo: {
    desvio_ruta: number
    fuera_servicio: number
    velocidad_excesiva: number
    sin_movimiento: number
  }
  porSeveridad: {
    baja: number
    media: number
    alta: number
    critica: number
  }
}
