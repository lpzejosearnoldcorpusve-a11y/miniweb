CREATE TABLE "choferes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombres" text NOT NULL,
	"apellido_paterno" text NOT NULL,
	"apellido_materno" text NOT NULL,
	"carnet_identidad" varchar(20) NOT NULL,
	"licencia" varchar(20) NOT NULL,
	"categoria_licencia" varchar(5) NOT NULL,
	"celular" varchar(20),
	"estado" text DEFAULT 'activo' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "choferes_carnet_identidad_unique" UNIQUE("carnet_identidad")
);
--> statement-breakpoint
CREATE TABLE "infracciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"placa_id" uuid NOT NULL,
	"chofer_id" uuid,
	"tipo_infraccion" text NOT NULL,
	"descripcion" text,
	"monto_bs" double precision DEFAULT 100 NOT NULL,
	"estado" text DEFAULT 'pendiente' NOT NULL,
	"fecha_infraccion" timestamp DEFAULT now() NOT NULL,
	"fecha_pago" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"placa" varchar(15) NOT NULL,
	"tipo_placa" text DEFAULT 'moderna' NOT NULL,
	"chofer_id" uuid,
	"linea" text,
	"sindicato" text,
	"estado" text DEFAULT 'activo' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "placas_placa_unique" UNIQUE("placa")
);
--> statement-breakpoint
CREATE TABLE "reportes_trameaje" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"placa" varchar(15) NOT NULL,
	"linea" text NOT NULL,
	"usuario_app_id" uuid,
	"hora_reporte" timestamp DEFAULT now() NOT NULL,
	"hora_suceso" timestamp NOT NULL,
	"latitud" double precision,
	"longitud" double precision,
	"direccion" text,
	"evidencia_imagenes" jsonb DEFAULT '[]'::jsonb,
	"evidencia_videos" jsonb DEFAULT '[]'::jsonb,
	"evidencia_audios" jsonb DEFAULT '[]'::jsonb,
	"mensaje" text,
	"tipo_reporte" text DEFAULT 'trameaje' NOT NULL,
	"estado" text DEFAULT 'pendiente' NOT NULL,
	"prioridad" text DEFAULT 'media' NOT NULL,
	"revisado_por" uuid,
	"notas_revision" text,
	"infraccion_generada" uuid,
	"fecha_resolucion" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "infracciones" ADD CONSTRAINT "infracciones_placa_id_placas_id_fk" FOREIGN KEY ("placa_id") REFERENCES "public"."placas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "infracciones" ADD CONSTRAINT "infracciones_chofer_id_choferes_id_fk" FOREIGN KEY ("chofer_id") REFERENCES "public"."choferes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placas" ADD CONSTRAINT "placas_chofer_id_choferes_id_fk" FOREIGN KEY ("chofer_id") REFERENCES "public"."choferes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reportes_trameaje" ADD CONSTRAINT "reportes_trameaje_usuario_app_id_usuarios_app_id_fk" FOREIGN KEY ("usuario_app_id") REFERENCES "public"."usuarios_app"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reportes_trameaje" ADD CONSTRAINT "reportes_trameaje_revisado_por_users_id_fk" FOREIGN KEY ("revisado_por") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reportes_trameaje" ADD CONSTRAINT "reportes_trameaje_infraccion_generada_infracciones_id_fk" FOREIGN KEY ("infraccion_generada") REFERENCES "public"."infracciones"("id") ON DELETE set null ON UPDATE no action;