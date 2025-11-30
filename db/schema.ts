import { pgTable, text, timestamp, uuid, varchar, doublePrecision, integer, jsonb, date } from "drizzle-orm/pg-core"

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
  nombre: text("nombre").notNull(),
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
  rutaNombre: text("ruta_nombre").notNull(),
  tipo: text("tipo").default("minibus"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const rutas = pgTable("rutas", {
  id: uuid("id").defaultRandom().primaryKey(),
  transporteId: uuid("transporte_id")
    .references(() => transportes.id, { onDelete: "cascade" })
    .notNull(),
  puntos: jsonb("puntos").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const tarjetasRfid = pgTable("tarjetas_rfid", {
  id: uuid("id").defaultRandom().primaryKey(),
  uid: varchar("uid", { length: 20 }).notNull().unique(),
  nombre: text("nombre").notNull(),
  celular: varchar("celular", { length: 20 }).notNull(),
  montoBs: doublePrecision("monto_bs").notNull().default(0),
  estado: text("estado").notNull().default("activa"),
  usuarioAppId: uuid("usuario_app_id").references(() => usuariosApp.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const usuariosApp = pgTable("usuarios_app", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombres: text("nombres").notNull(),
  apellidoPaterno: text("apellido_paterno").notNull(),
  apellidoMaterno: text("apellido_materno").notNull(),
  carnetIdentidad: varchar("carnet_identidad", { length: 20 }).notNull().unique(),
  ciudad: text("ciudad").notNull(),
  complemento: varchar("complemento", { length: 10 }), // CI complement (optional)
  fechaNacimiento: date("fecha_nacimiento").notNull(),
  celular: varchar("celular", { length: 20 }).notNull(),
  password: text("password").notNull(),
  ultimaConexion: timestamp("ultima_conexion"),
  estado: text("estado").notNull().default("activo"), // activo, inactivo, suspendido
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const tokensApp = pgTable("tokens_app", {
  id: uuid("id").defaultRandom().primaryKey(),
  usuarioAppId: uuid("usuario_app_id")
    .references(() => usuariosApp.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull().unique(),
  deviceInfo: text("device_info"), // Device/platform info
  ipAddress: varchar("ip_address", { length: 45 }),
  type: text("type").notNull().default("access"), // access, refresh
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
