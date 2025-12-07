import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type { choferes, placas, infracciones, reportesTrameaje } from "@/db/schema"

// Choferes
export type Chofer = InferSelectModel<typeof choferes>
export type NewChofer = InferInsertModel<typeof choferes>

// Placas
export type Placa = InferSelectModel<typeof placas>
export type NewPlaca = InferInsertModel<typeof placas>

export interface PlacaWithChofer extends Placa {
  chofer?: Chofer | null
}

// Infracciones
export type Infraccion = InferSelectModel<typeof infracciones>
export type NewInfraccion = InferInsertModel<typeof infracciones>

export interface InfraccionWithDetails extends Infraccion {
  placa?: Placa | null
  chofer?: Chofer | null
}

// Reportes Trameaje
export type ReporteTrameaje = InferSelectModel<typeof reportesTrameaje>
export type NewReporteTrameaje = InferInsertModel<typeof reportesTrameaje>

export interface ReporteTrameajeWithDetails extends ReporteTrameaje {
  usuarioApp?: {
    id: string
    nombres: string
    apellidoPaterno: string
    apellidoMaterno: string
    celular: string
  } | null
  revisadoPorUsuario?: {
    id: string
    nombres: string
    apellidos: string
  } | null
  infraccion?: Infraccion | null
}

// API Types
export interface CreateReporteRequest {
  placa: string
  linea: string
  usuarioAppId?: string
  horaSuceso: string
  latitud?: number
  longitud?: number
  direccion?: string
  evidenciaImagenes?: string[]
  evidenciaVideos?: string[]
  evidenciaAudios?: string[]
  mensaje?: string
  tipoReporte?: string
  prioridad?: string
}

export interface UpdateReporteRequest {
  estado?: string
  prioridad?: string
  notasRevision?: string
  revisadoPor?: string
}

export interface ReporteEstadisticas {
  totalReportes: number
  pendientes: number
  enRevision: number
  verificados: number
  rechazados: number
  resueltos: number
  infraccionesGeneradas: number
  montoTotalInfracciones: number
}

export interface HistorialReporte {
  id: string
  placa: string
  linea: string
  tipoReporte: string
  estado: string
  prioridad: string
  horaReporte: string
  horaSuceso: string
  usuarioReportador?: string
  tieneEvidencia: boolean
}
