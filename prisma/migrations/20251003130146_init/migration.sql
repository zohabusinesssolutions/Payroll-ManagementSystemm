/*
  Warnings:

  - Made the column `accountTitle` on table `bank_account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."bank_account" ALTER COLUMN "accountTitle" SET NOT NULL;
