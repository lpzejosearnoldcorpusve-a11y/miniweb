import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type { usuariosApp, tokensApp } from "@/db/schema"
import type { TarjetaRfid } from "./tarjetas"

export type UsuarioApp = InferSelectModel<typeof usuariosApp>
export type NewUsuarioApp = InferInsertModel<typeof usuariosApp>

export type TokenApp = InferSelectModel<typeof tokensApp>
export type NewTokenApp = InferInsertModel<typeof tokensApp>

export interface UsuarioAppWithTarjetas extends UsuarioApp {
  tarjetas?: TarjetaRfid[]
  tokensActivos?: number
}
