import { pgTable, text, timestamp, uuid, varchar, doublePrecision, integer, jsonb } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombres: text("nombres").notNull(),
  apellidos: text("apellidos").notNull(),
  email: text("email").notNull().unique(),
  telefono: varchar("telefono", { length: 20 }),
  password: text("password").notNull(),
  rol: text("rol").notNull().default("user"), // admin, user, chofer, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const tokens = pgTable("tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull(),
  type: text("type").notNull(), // reset_password, email_verification, etc.
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const telefericos = pgTable("telefericos", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombre: text("nombre").notNull(), // Línea Roja, Amarilla, etc.
  color: text("color").notNull(), // Hex code
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
  rutaNombre: text("ruta_nombre").notNull(), 
  tipo: text("tipo").default("minibus"),
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

export const tarjetasRfid = pgTable("tarjetas_rfid", {
  id: uuid("id").defaultRandom().primaryKey(),
  uid: varchar("uid", { length: 20 }).notNull().unique(), 
  nombre: text("nombre").notNull(), // Nombre del titular
  celular: varchar("celular", { length: 20 }).notNull(),
  montoBs: doublePrecision("monto_bs").notNull().default(0), 
  estado: text("estado").notNull().default("activa"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
