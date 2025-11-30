import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type { telefericos, estaciones, transportes, rutas } from "@/db/schema"

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
