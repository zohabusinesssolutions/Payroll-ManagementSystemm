import prisma from "./prisma";

export interface PayrollAdjustmentData {
  overtimeHours?: number;
  overtimeAmount?: number;
  sundayCount?: number;
  sundayAmount?: number;
  sundayFuel?: number;
  leaveCount?: number;
  leaveDeduction?: number;
  halfDayCount?: number;
  halfDayDeduction?: number;
  commissionAmount?: number;
  loanDeduction?: number;
}

/**
 * Get payroll adjustments for a specific employee, month, and year
 */
export async function getPayrollAdjustments(
  employeeId: string,
  month: number,
  year: number
): Promise<PayrollAdjustmentData> {
  try {
    // Try to find adjustments - use dynamic query to avoid Prisma client issues
    const adjustmentRecord = await prisma.$queryRaw`
      SELECT adjustments FROM payroll_adjustments 
      WHERE "employeeId" = ${employeeId} AND month = ${month} AND year = ${year}
    ` as any[];

    if (adjustmentRecord && adjustmentRecord.length > 0) {
      return adjustmentRecord[0].adjustments as PayrollAdjustmentData;
    }

    return {};
  } catch (error) {
    console.warn("Could not fetch payroll adjustments:", error);
    return {};
  }
}

/**
 * Upsert payroll adjustments for a specific employee, month, and year
 */
export async function upsertPayrollAdjustments(
  employeeId: string,
  month: number,
  year: number,
  adjustments: PayrollAdjustmentData
): Promise<void> {
  try {
    // First try to get existing adjustments
    const existingRecord = await prisma.$queryRaw`
      SELECT adjustments FROM payroll_adjustments 
      WHERE "employeeId" = ${employeeId} AND month = ${month} AND year = ${year}
    ` as any[];

    let mergedAdjustments = adjustments;

    if (existingRecord && existingRecord.length > 0) {
      // Merge with existing adjustments
      const existing = existingRecord[0].adjustments as PayrollAdjustmentData;
      mergedAdjustments = { ...existing, ...adjustments };
    }

    // Remove adjustments that are zero
    Object.keys(mergedAdjustments).forEach(key => {
      if (mergedAdjustments[key as keyof PayrollAdjustmentData] === 0) {
        delete mergedAdjustments[key as keyof PayrollAdjustmentData];
      }
    });

    if (Object.keys(mergedAdjustments).length === 0) {
      // Delete record if no adjustments left
      await prisma.$executeRaw`
        DELETE FROM payroll_adjustments 
        WHERE "employeeId" = ${employeeId} AND month = ${month} AND year = ${year}
      `;
    } else {
      // Upsert the record
      await prisma.$executeRaw`
        INSERT INTO payroll_adjustments ("id", "employeeId", month, year, adjustments, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${employeeId}, ${month}, ${year}, ${JSON.stringify(mergedAdjustments)}::jsonb, NOW(), NOW())
        ON CONFLICT ("employeeId", month, year)
        DO UPDATE SET adjustments = ${JSON.stringify(mergedAdjustments)}::jsonb, "updatedAt" = NOW()
      `;
    }
  } catch (error) {
    console.error("Error upserting payroll adjustments:", error);
    throw error;
  }
}

/**
 * Apply adjustments to base payroll calculation values
 */
export function applyPayrollAdjustments(
  baseValues: {
    grossSalary: number;
    overtimeHours: number;
    overtimeAmount: number;
    sundayCount: number;
    sundayAmount: number;
    sundayFuel: number;
    leaveCount: number;
    leaveDeduction: number;
    halfDayCount: number;
    halfDayDeduction: number;
    commissionAmount: number;
    loanDeduction: number;
  },
  adjustments: PayrollAdjustmentData
) {
    const perHourSalary = (baseValues.grossSalary * 12) / 365 / 8;
    const perDaySalary = (baseValues.grossSalary * 12) / 365;
    // calculate overtime amount if overtime hours adjustment is provided, the process to calculate overtime amount is: multiply overtime hours with per hour salary which is gross salary * 12 / 365 / 8
    let overtimeAmount = baseValues.overtimeAmount

    if (adjustments.overtimeHours){
        overtimeAmount = overtimeAmount + (adjustments.overtimeHours * perHourSalary)
    }

    // do the same for sunday amount if sunday count adjustment is provided
    let sundayAmount = baseValues.sundayAmount
    if (adjustments.sundayCount){
        sundayAmount = sundayAmount + (adjustments.sundayCount * perDaySalary)
    }

    // do the same for leave deduction if leave count adjustment is provided
    let leaveDeduction = baseValues.leaveDeduction
    if (adjustments.leaveCount){
        leaveDeduction = leaveDeduction + (adjustments.leaveCount * perDaySalary)
    }

    // do the same for half day deduction if half day count adjustment is provided
    let halfDayDeduction = baseValues.halfDayDeduction
    if (adjustments.halfDayCount){
        halfDayDeduction = halfDayDeduction + (adjustments.halfDayCount * (perDaySalary / 2))
    }

  return {
    overtimeHours: baseValues.overtimeHours + (adjustments.overtimeHours || 0),
    overtimeAmount: overtimeAmount,
    sundayCount: baseValues.sundayCount + (adjustments.sundayCount || 0),
    sundayAmount: sundayAmount,
    sundayFuel: baseValues.sundayFuel + (adjustments.sundayFuel || 0),
    leaveCount: baseValues.leaveCount + (adjustments.leaveCount || 0),
    leaveDeduction: leaveDeduction,
    halfDayCount: baseValues.halfDayCount + (adjustments.halfDayCount || 0),
    halfDayDeduction: halfDayDeduction,
    commissionAmount: baseValues.commissionAmount + (adjustments.commissionAmount || 0),
    loanDeduction: baseValues.loanDeduction + (adjustments.loanDeduction || 0),
  };
}