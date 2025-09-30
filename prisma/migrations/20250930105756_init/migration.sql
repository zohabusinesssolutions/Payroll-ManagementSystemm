-- CreateTable
CREATE TABLE "public"."PayrollAdjustments" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "adjustments" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayrollAdjustments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PayrollAdjustments_employeeId_month_year_key" ON "public"."PayrollAdjustments"("employeeId", "month", "year");
