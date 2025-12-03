import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type {
  users,
  tokens,
  telefericos,
  estaciones,
  transportes,
  rutas,
  tarjetasRfid,
  usuariosApp,
  tokensApp,
} from "@/db/schema"

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type Token = InferSelectModel<typeof tokens>
export type NewToken = InferInsertModel<typeof tokens>

export type Teleferico = InferSelectModel<typeof telefericos>
export type NewTeleferico = InferInsertModel<typeof telefericos>

export type Estacion = InferSelectModel<typeof estaciones>
export type NewEstacion = InferInsertModel<typeof estaciones>

export type Transporte = InferSelectModel<typeof transportes>
export type NewTransporte = InferInsertModel<typeof transportes>

export type Ruta = InferSelectModel<typeof rutas>
export type NewRuta = InferInsertModel<typeof rutas>

export interface RoutePoint {
  lat: number
  lng: number
  order: number
}

export type TarjetaRfid = InferSelectModel<typeof tarjetasRfid>
export type NewTarjetaRfid = InferInsertModel<typeof tarjetasRfid>

export type UsuarioApp = InferSelectModel<typeof usuariosApp>
export type NewUsuarioApp = InferInsertModel<typeof usuariosApp>

export type TokenApp = InferSelectModel<typeof tokensApp>
export type NewTokenApp = InferInsertModel<typeof tokensApp>

export interface UsuarioAppWithTarjetas extends UsuarioApp {
  tarjetas?: TarjetaRfid[]
  tokensActivos?: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export * from "./users"
export * from "./transport"
export * from "./tarjetas"
export * from "./usuarios-app"
export * from "./api"
export * from "./gps"
export * from "./alertas"
