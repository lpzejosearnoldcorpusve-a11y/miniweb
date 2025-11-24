CREATE TABLE "estaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teleferico_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"orden" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rutas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transporte_id" uuid NOT NULL,
	"puntos" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telefericos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"color" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transportes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sindicato" text NOT NULL,
	"linea" text NOT NULL,
	"ruta_nombre" text NOT NULL,
	"tipo" text DEFAULT 'minibus',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "estaciones" ADD CONSTRAINT "estaciones_teleferico_id_telefericos_id_fk" FOREIGN KEY ("teleferico_id") REFERENCES "public"."telefericos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_transporte_id_transportes_id_fk" FOREIGN KEY ("transporte_id") REFERENCES "public"."transportes"("id") ON DELETE cascade ON UPDATE no action;