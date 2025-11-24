CREATE TABLE "tarjetas_rfid" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" varchar(20) NOT NULL,
	"nombre" text NOT NULL,
	"celular" varchar(20) NOT NULL,
	"monto_bs" double precision DEFAULT 0 NOT NULL,
	"estado" text DEFAULT 'activa' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tarjetas_rfid_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
ALTER TABLE "rutas" DROP COLUMN "nombre";