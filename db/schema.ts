import { pgTable, text, timestamp, uuid, varchar, doublePrecision, integer, jsonb } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombres: text("nombres").notNull(),
  apellidos: text("apellidos").notNull(),
  email: text("email").notNull().unique(),
  telefono: varchar("telefono", { length: 20 }),
  password: text("password").notNull(),
  rol: text("rol").notNull().default("user"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const tokens = pgTable("tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull(),
  type: text("type").notNull(), 
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const telefericos = pgTable("telefericos", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombre: text("nombre").notNull(), // Línea Roja, Amarilla, etc.
  color: text("color").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const estaciones = pgTable("estaciones", {
  id: uuid("id").defaultRandom().primaryKey(),
  telefericoId: uuid("teleferico_id")
    .references(() => telefericos.id, { onDelete: "cascade" })
    .notNull(),
  nombre: text("nombre").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  orden: integer("orden").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const transportes = pgTable("transportes", {
  id: uuid("id").defaultRandom().primaryKey(),
  sindicato: text("sindicato").notNull(),
  linea: text("linea").notNull(),
  rutaNombre: text("ruta_nombre").notNull(), // e.g., "Villa Salomé - San Pedro"
  tipo: text("tipo").default("minibus"), // minibus, micro, trufi
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const rutas = pgTable("rutas", {
  id: uuid("id").defaultRandom().primaryKey(),
  transporteId: uuid("transporte_id")
    .references(() => transportes.id, { onDelete: "cascade" })
    .notNull(),
  // Storing points as a JSON array of { lat: number, lng: number, order: number }
  puntos: jsonb("puntos").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
