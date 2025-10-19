ALTER TABLE "users" DROP CONSTRAINT "users_role_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE varchar(255);