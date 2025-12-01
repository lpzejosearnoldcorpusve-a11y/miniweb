CREATE TABLE "estadisticas_viaje" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehiculo_id" uuid NOT NULL,
	"total_pasajeros" integer DEFAULT 0,
	"total_recaudado" double precision DEFAULT 0,
	"pagos_normales" integer DEFAULT 0,
	"pagos_estudiante" integer DEFAULT 0,
	"pagos_tercera_edad" integer DEFAULT 0,
	"fecha_inicio" timestamp DEFAULT now() NOT NULL,
	"fecha_fin" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transacciones_rfid" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tarjeta_id" uuid,
	"vehiculo_id" uuid,
	"rfid_uid" varchar(20) NOT NULL,
	"pasajero_id" varchar(20),
	"monto" double precision NOT NULL,
	"tipo_pago" text DEFAULT 'normal' NOT NULL,
	"descuento" integer DEFAULT 0,
	"estado" text DEFAULT 'pendiente' NOT NULL,
	"saldo_restante" double precision DEFAULT 0,
	"latitud" double precision,
	"longitud" double precision,
	"fecha_hora" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ubicaciones_gps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehiculo_id" uuid NOT NULL,
	"latitud" double precision NOT NULL,
	"longitud" double precision NOT NULL,
	"velocidad" double precision DEFAULT 0,
	"direccion" double precision DEFAULT 0,
	"satelites" integer DEFAULT 0,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehiculos_gps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"placa" varchar(20) NOT NULL,
	"linea" text NOT NULL,
	"transporte_id" uuid,
	"tipo_vehiculo" text DEFAULT 'minibus' NOT NULL,
	"estado" text DEFAULT 'activo' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vehiculos_gps_placa_unique" UNIQUE("placa")
);
--> statement-breakpoint
ALTER TABLE "estadisticas_viaje" ADD CONSTRAINT "estadisticas_viaje_vehiculo_id_vehiculos_gps_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos_gps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones_rfid" ADD CONSTRAINT "transacciones_rfid_tarjeta_id_tarjetas_rfid_id_fk" FOREIGN KEY ("tarjeta_id") REFERENCES "public"."tarjetas_rfid"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones_rfid" ADD CONSTRAINT "transacciones_rfid_vehiculo_id_vehiculos_gps_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos_gps"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ubicaciones_gps" ADD CONSTRAINT "ubicaciones_gps_vehiculo_id_vehiculos_gps_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos_gps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehiculos_gps" ADD CONSTRAINT "vehiculos_gps_transporte_id_transportes_id_fk" FOREIGN KEY ("transporte_id") REFERENCES "public"."transportes"("id") ON DELETE set null ON UPDATE no action;