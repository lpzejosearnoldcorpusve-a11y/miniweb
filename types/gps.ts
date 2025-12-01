import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type { vehiculosGps, ubicacionesGps, transaccionesRfid, estadisticasViaje } from "@/db/schema"

// Vehicle GPS Types
export type VehiculoGps = InferSelectModel<typeof vehiculosGps>
export type NewVehiculoGps = InferInsertModel<typeof vehiculosGps>

// GPS Location Types
export type UbicacionGps = InferSelectModel<typeof ubicacionesGps>
export type NewUbicacionGps = InferInsertModel<typeof ubicacionesGps>

// RFID Transaction Types
export type TransaccionRfid = InferSelectModel<typeof transaccionesRfid>
export type NewTransaccionRfid = InferInsertModel<typeof transaccionesRfid>

// Trip Statistics Types
export type EstadisticaViaje = InferSelectModel<typeof estadisticasViaje>
export type NewEstadisticaViaje = InferInsertModel<typeof estadisticasViaje>

// Hardware JSON payload from ESP8266/GPS device
export interface HardwareGpsPayload {
  placa: string
  linea: string
  latitud: number
  longitud: number
  transacciones: HardwareTransaccion[]
  estadisticas: HardwareEstadisticas
  timestamp: string
  velocidad: number
  direccion: number
  satelites: number
}

export interface HardwareTransaccion {
  rfid_id: string
  pasajero_id: string
  monto: number
  tipo_pago: "normal" | "estudiante" | "tercera_edad"
  descuento?: number
  fecha_hora: string
  estado: "completado" | "pendiente" | "rechazado"
  saldo_restante: number
}

export interface HardwareEstadisticas {
  total_pasajeros: number
  total_recaudado: number
  pagos_normales: number
  pagos_estudiante: number
  pagos_tercera_edad: number
}

// Real-time tracking data for UI
export interface VehiculoEnTiempoReal {
  id: string
  placa: string
  linea: string
  tipoVehiculo: string
  latitud: number
  longitud: number
  velocidad: number
  direccion: number
  satelites: number
  ultimaActualizacion: string
  pasajerosHoy: number
  recaudadoHoy: number
}

// Payment verification response
export interface VerificacionPagoResponse {
  success: boolean
  message: string
  transaccionId?: string
  saldoRestante?: number
  tipoPago?: string
  descuento?: number
}

// Route with active vehicles
export interface RutaConVehiculos {
  rutaId: string
  linea: string
  puntos: { lat: number; lng: number }[]
  vehiculos: VehiculoEnTiempoReal[]
}
