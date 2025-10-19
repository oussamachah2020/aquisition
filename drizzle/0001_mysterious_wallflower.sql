ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(50) NOT NULL;