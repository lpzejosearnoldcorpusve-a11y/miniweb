CREATE TABLE "alertas_gps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehiculo_id" uuid NOT NULL,
	"transporte_id" uuid,
	"ruta_id" uuid,
	"tipo_alerta" text NOT NULL,
	"severidad" text DEFAULT 'media' NOT NULL,
	"mensaje" text NOT NULL,
	"latitud" double precision NOT NULL,
	"longitud" double precision NOT NULL,
	"distancia_desvio" double precision,
	"estado" text DEFAULT 'activa' NOT NULL,
	"revisado_por" uuid,
	"notas_resolucion" text,
	"fecha_alerta" timestamp DEFAULT now() NOT NULL,
	"fecha_resolucion" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asignaciones_ruta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehiculo_id" uuid NOT NULL,
	"transporte_id" uuid NOT NULL,
	"ruta_id" uuid NOT NULL,
	"tolerancia_metros" integer DEFAULT 100,
	"activa" text DEFAULT 'activa' NOT NULL,
	"fecha_inicio" timestamp DEFAULT now() NOT NULL,
	"fecha_fin" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "alertas_gps" ADD CONSTRAINT "alertas_gps_vehiculo_id_vehiculos_gps_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos_gps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alertas_gps" ADD CONSTRAINT "alertas_gps_transporte_id_transportes_id_fk" FOREIGN KEY ("transporte_id") REFERENCES "public"."transportes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alertas_gps" ADD CONSTRAINT "alertas_gps_ruta_id_rutas_id_fk" FOREIGN KEY ("ruta_id") REFERENCES "public"."rutas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alertas_gps" ADD CONSTRAINT "alertas_gps_revisado_por_users_id_fk" FOREIGN KEY ("revisado_por") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asignaciones_ruta" ADD CONSTRAINT "asignaciones_ruta_vehiculo_id_vehiculos_gps_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos_gps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asignaciones_ruta" ADD CONSTRAINT "asignaciones_ruta_transporte_id_transportes_id_fk" FOREIGN KEY ("transporte_id") REFERENCES "public"."transportes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asignaciones_ruta" ADD CONSTRAINT "asignaciones_ruta_ruta_id_rutas_id_fk" FOREIGN KEY ("ruta_id") REFERENCES "public"."rutas"("id") ON DELETE cascade ON UPDATE no action;