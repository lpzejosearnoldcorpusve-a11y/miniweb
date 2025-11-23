import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type { users, tokens } from "@/db/schema"

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type Token = InferSelectModel<typeof tokens>
export type NewToken = InferInsertModel<typeof tokens>
