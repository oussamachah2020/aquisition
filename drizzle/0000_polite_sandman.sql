CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) DEFAULT 'user' NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_role_unique" UNIQUE("role")
);
