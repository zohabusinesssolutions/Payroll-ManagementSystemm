/*
  Warnings:

  - You are about to drop the `PayrollAdjustments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."PayrollAdjustments";

-- CreateTable
CREATE TABLE "public"."payroll_adjustments" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "adjustments" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payroll_adjustments_employeeId_month_year_key" ON "public"."payroll_adjustments"("employeeId", "month", "year");

-- AddForeignKey
ALTER TABLE "public"."payroll_adjustments" ADD CONSTRAINT "payroll_adjustments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
