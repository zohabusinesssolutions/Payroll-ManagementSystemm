-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."AccessScope" AS ENUM ('SELF', 'ALL');

-- CreateEnum
CREATE TYPE "public"."AccessLevel" AS ENUM ('READ', 'WRITE');

-- CreateEnum
CREATE TYPE "public"."AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LEAVE', 'HALFDAY', 'LATE');

-- CreateEnum
CREATE TYPE "public"."BonusType" AS ENUM ('RAMADAN', 'PERFORMANCE');

-- CreateEnum
CREATE TYPE "public"."LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- CreateEnum
CREATE TYPE "public"."LeaveType" AS ENUM ('HALFDAY', 'FULLDAY');

-- CreateEnum
CREATE TYPE "public"."MaritalStatus" AS ENUM ('MARRIED', 'DIVORCED', 'SEPARATED', 'WIDOWED', 'SINGLE');

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('STARTED', 'INPROGRESS', 'COMPLETED', 'INVOICED', 'RELEASED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SalaryStatus" AS ENUM ('PAID', 'UNPAID');

-- CreateEnum
CREATE TYPE "public"."ProjectMilestoneStatus" AS ENUM ('PLANNED', 'INPROGRESS', 'PAUSED', 'DELAYED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."department_permissions" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "accessScope" "public"."AccessScope" NOT NULL,
    "accessLevel" "public"."AccessLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "maritalStatus" "public"."MaritalStatus" NOT NULL DEFAULT 'SINGLE',
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "address" TEXT,
    "cnicNo" TEXT NOT NULL,
    "image" TEXT,
    "emergencyContactDetails" JSONB NOT NULL DEFAULT '{}',
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "resignDate" TIMESTAMP(3),
    "designation" TEXT NOT NULL,
    "location" TEXT,
    "bankAccount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attendance" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "month" INTEGER NOT NULL,
    "inTime" TIMESTAMP(3),
    "outTime" TIMESTAMP(3),
    "workingHours" TEXT,
    "status" "public"."AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employeeLeaves" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "leavesAvailable" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leavesTaken" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalLeaves" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "employeeLeaves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."leaveApplied" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "leaveType" "public"."LeaveType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "public"."LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "approvedOn" TIMESTAMP(3),
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaveApplied_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."salary" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "grossSalary" DOUBLE PRECISION NOT NULL,
    "fuelEntitlement" DOUBLE PRECISION NOT NULL,
    "fuelAllowance" DOUBLE PRECISION NOT NULL,
    "medicalAllowance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."salarySlip" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "grossSalary" DOUBLE PRECISION NOT NULL,
    "fuelEntitlement" DOUBLE PRECISION NOT NULL,
    "fuelAmount" DOUBLE PRECISION NOT NULL,
    "commissionOrAdditional" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overtimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overtimeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sunday" INTEGER NOT NULL DEFAULT 0,
    "sundayAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sundayFuel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leaveCount" INTEGER NOT NULL DEFAULT 0,
    "halfDayCount" INTEGER NOT NULL DEFAULT 0,
    "leaveDeduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "halfDayDeduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "loanOrOtherDeduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netSalary" DOUBLE PRECISION NOT NULL,
    "bonus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bonusType" "public"."BonusType",
    "account" TEXT,
    "paidOn" TIMESTAMP(3),
    "status" "public"."SalaryStatus" NOT NULL DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "salarySlip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."settings" (
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("title")
);

-- CreateTable
CREATE TABLE "public"."client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNo" TEXT,
    "billingAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."milestone" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "description" TEXT,
    "employeeId" JSONB NOT NULL DEFAULT '[]',
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "status" "public"."ProjectMilestoneStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."expense" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "month" INTEGER NOT NULL,
    "paidOn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "public"."departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "department_permissions_departmentId_model_accessScope_key" ON "public"."department_permissions"("departmentId", "model", "accessScope");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cnicNo_key" ON "public"."users"("cnicNo");

-- CreateIndex
CREATE UNIQUE INDEX "employee_userId_key" ON "public"."employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_employeeId_date_key" ON "public"."attendance"("employeeId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "employeeLeaves_employeeId_key" ON "public"."employeeLeaves"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "leaveApplied_employeeId_date_key" ON "public"."leaveApplied"("employeeId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "salary_employeeId_key" ON "public"."salary"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "salarySlip_employeeId_month_year_key" ON "public"."salarySlip"("employeeId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "client_email_key" ON "public"."client"("email");

-- AddForeignKey
ALTER TABLE "public"."department_permissions" ADD CONSTRAINT "department_permissions_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employeeLeaves" ADD CONSTRAINT "employeeLeaves_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."leaveApplied" ADD CONSTRAINT "leaveApplied_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."salary" ADD CONSTRAINT "salary_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."salarySlip" ADD CONSTRAINT "salarySlip_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project" ADD CONSTRAINT "project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."milestone" ADD CONSTRAINT "milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
