/*
  Warnings:

  - You are about to drop the column `bankAccount` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."employee" DROP COLUMN "bankAccount";

-- CreateTable
CREATE TABLE "public"."bank_account" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNo" TEXT NOT NULL,
    "branchCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bank_account_employeeId_key" ON "public"."bank_account"("employeeId");

-- AddForeignKey
ALTER TABLE "public"."bank_account" ADD CONSTRAINT "bank_account_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
