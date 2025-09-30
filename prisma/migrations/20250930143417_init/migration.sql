-- DropIndex
DROP INDEX "public"."users_email_key";

-- AlterTable
ALTER TABLE "public"."salary" ALTER COLUMN "medicalAllowance" DROP NOT NULL;
