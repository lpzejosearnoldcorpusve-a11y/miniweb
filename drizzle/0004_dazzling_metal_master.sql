CREATE TABLE "tokens_app" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_app_id" uuid NOT NULL,
	"token" text NOT NULL,
	"device_info" text,
	"ip_address" varchar(45),
	"type" text DEFAULT 'access' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tokens_app_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "usuarios_app" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombres" text NOT NULL,
	"apellido_paterno" text NOT NULL,
	"apellido_materno" text NOT NULL,
	"carnet_identidad" varchar(20) NOT NULL,
	"ciudad" text NOT NULL,
	"complemento" varchar(10),
	"fecha_nacimiento" date NOT NULL,
	"celular" varchar(20) NOT NULL,
	"password" text NOT NULL,
	"ultima_conexion" timestamp,
	"estado" text DEFAULT 'activo' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_app_carnet_identidad_unique" UNIQUE("carnet_identidad")
);
--> statement-breakpoint
ALTER TABLE "tarjetas_rfid" ADD COLUMN "usuario_app_id" uuid;--> statement-breakpoint
ALTER TABLE "tokens_app" ADD CONSTRAINT "tokens_app_usuario_app_id_usuarios_app_id_fk" FOREIGN KEY ("usuario_app_id") REFERENCES "public"."usuarios_app"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarjetas_rfid" ADD CONSTRAINT "tarjetas_rfid_usuario_app_id_usuarios_app_id_fk" FOREIGN KEY ("usuario_app_id") REFERENCES "public"."usuarios_app"("id") ON DELETE set null ON UPDATE no action;