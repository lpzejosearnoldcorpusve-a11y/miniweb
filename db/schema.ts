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
  deviceInfo: text("device_info"),
  ipAddress: varchar("ip_address", { length: 45 }),
  type: text("type").notNull().default("access"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const vehiculosGps = pgTable("vehiculos_gps", {
  id: uuid("id").defaultRandom().primaryKey(),
  placa: varchar("placa", { length: 20 }).notNull().unique(),
  linea: text("linea").notNull(),
  transporteId: uuid("transporte_id").references(() => transportes.id, { onDelete: "set null" }),
  tipoVehiculo: text("tipo_vehiculo").notNull().default("minibus"), // minibus, teleferico
  estado: text("estado").notNull().default("activo"), // activo, inactivo, mantenimiento
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const ubicacionesGps = pgTable("ubicaciones_gps", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehiculoId: uuid("vehiculo_id")
    .references(() => vehiculosGps.id, { onDelete: "cascade" })
    .notNull(),
  latitud: doublePrecision("latitud").notNull(),
  longitud: doublePrecision("longitud").notNull(),
  velocidad: doublePrecision("velocidad").default(0),
  direccion: doublePrecision("direccion").default(0), // heading in degrees
  satelites: integer("satelites").default(0),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
})

export const transaccionesRfid = pgTable("transacciones_rfid", {
  id: uuid("id").defaultRandom().primaryKey(),
  tarjetaId: uuid("tarjeta_id").references(() => tarjetasRfid.id, { onDelete: "set null" }),
  vehiculoId: uuid("vehiculo_id").references(() => vehiculosGps.id, { onDelete: "set null" }),
  rfidUid: varchar("rfid_uid", { length: 20 }).notNull(),
  pasajeroId: varchar("pasajero_id", { length: 20 }),
  monto: doublePrecision("monto").notNull(),
  tipoPago: text("tipo_pago").notNull().default("normal"), // normal, estudiante, tercera_edad
  descuento: integer("descuento").default(0),
  estado: text("estado").notNull().default("pendiente"), // pendiente, completado, rechazado
  saldoRestante: doublePrecision("saldo_restante").default(0),
  latitud: doublePrecision("latitud"),
  longitud: doublePrecision("longitud"),
  fechaHora: timestamp("fecha_hora").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const estadisticasViaje = pgTable("estadisticas_viaje", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehiculoId: uuid("vehiculo_id")
    .references(() => vehiculosGps.id, { onDelete: "cascade" })
    .notNull(),
  totalPasajeros: integer("total_pasajeros").default(0),
  totalRecaudado: doublePrecision("total_recaudado").default(0),
  pagosNormales: integer("pagos_normales").default(0),
  pagosEstudiante: integer("pagos_estudiante").default(0),
  pagosTerceraEdad: integer("pagos_tercera_edad").default(0),
  fechaInicio: timestamp("fecha_inicio").defaultNow().notNull(),
  fechaFin: timestamp("fecha_fin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
