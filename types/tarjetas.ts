import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type { tarjetasRfid } from "@/db/schema"

export type TarjetaRfid = InferSelectModel<typeof tarjetasRfid>
export type NewTarjetaRfid = InferInsertModel<typeof tarjetasRfid>
