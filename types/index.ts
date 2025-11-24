import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type { users, tokens, telefericos, estaciones, transportes, rutas, tarjetasRfid } from "@/db/schema"

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
