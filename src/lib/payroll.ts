import prisma from "./prisma";
import { AttendanceStatus } from "@prisma/client";
import { getPayrollAdjustments, applyPayrollAdjustments } from "./payroll-adjustments";

export interface PayrollCalculation {
  id: string;
  name: string;
  designation: string;
  location: string;
  grossSalary: number;
  fuelEntitlement: number | null;
  fuelRate: number;
  fuelAmount: number;
  commissionAmount: number;
  overtimeHours: number;
  overtimeAmount: number;
  sundayCount: number;
  sundayAmount: number;
  sundayFuel: number;
  leaveCount: number;
  leaveDeduction: number;
  halfDayCount: number;
  halfDayDeduction: number;
  loanDeduction: number;
  netSalary: number;
  account: string;
}

/**
 * Calculate payroll for a specific employee for a given month and year
 */
export async function calculatePayroll(
  employeeId: string,
  month: number,
  year: number
): Promise<PayrollCalculation | null> {
  try {
    // Get employee with related data
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        user: true,
        salary: true,
      },
    });

    if (!employee || !employee.salary) {
      return null;
    }

    // Get fuel rate from settings
    let fuelRate = 0;
    try {
      const fuelRateSetting = await prisma.setting.findUnique({
        where: { title: "FUEL_PRICE" },
      });
      fuelRate = fuelRateSetting ? parseFloat(fuelRateSetting.value) : 300; // Default to 300
    } catch (error) {
      fuelRate = 300; // Default fallback
    }

    // Basic salary information
    const grossSalary = employee.salary.grossSalary; 
    const fuelEntitlement = employee.salary.fuelEntitlement || null;
    let fuelAmount = 0;
    if (fuelEntitlement === null) {
      fuelAmount = employee.salary.fuelAllowance || 0;
    } else {
      fuelAmount = fuelEntitlement * fuelRate;
    }

    // Get attendance records for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        employeeId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        status: true,
        workingHours: true,
        inTime: true,
      },
    });

    // Calculate overtime
    let overtimeHours = 0;
    let sundayCount = 0;
    
    // Standard working hours per day (8 hours)
    const standardWorkingHours = 8;
    
    attendanceRecords.forEach((record) => {
      if (record.workingHours && record.status === AttendanceStatus.PRESENT) {
        const workingHours = parseFloat(record.workingHours);
        if (workingHours > standardWorkingHours) {
          overtimeHours += (workingHours - standardWorkingHours);
        }
      }

      // Check if it's Sunday (0 = Sunday in JavaScript)
      if (record.date.getDay() === 0 && record.status === AttendanceStatus.PRESENT) {
        sundayCount++;
      }
    });

    // Calculate hourly and daily rates
    const yearlyGross = grossSalary * 12;
    const dailySalary = yearlyGross / 365;
    const hourlySalary = dailySalary / 8;

    // Calculate overtime amount
    let overtimeAmount = overtimeHours * hourlySalary;

    // Calculate Sunday amount
    let sundayAmount = sundayCount * (dailySalary* 2);

    // Calculate Sunday fuel amount
    let sundayFuel = sundayCount * fuelRate;

    // Get leave records for the month
    const leaveRecords = await prisma.leavesApplied.findMany({
      where: {
        employeeId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: "APPROVED",
      },
      select: {
        leaveType: true,
      },
    });

    // Calculate leave deductions
    let leaveCount = 0;
    let halfDayCount = 0;

    leaveRecords.forEach((leave) => {
      if (leave.leaveType === "FULLDAY") {
        leaveCount++;
      } else if (leave.leaveType === "HALFDAY") {
        halfDayCount++;
      }
    });

    // calculate half day from attendance that if user intime is after 10:15.
    attendanceRecords.forEach((record) => {
      if (record.status === AttendanceStatus.PRESENT) {
        const inTime = record.inTime ? new Date(record.inTime) : null;
        if (inTime && inTime.getHours() > 10 && inTime.getMinutes() > 15) {
          halfDayCount++;
        }
      }
    });
    
    let leaveDeduction = leaveCount * dailySalary;
    let halfDayDeduction = halfDayCount * (dailySalary / 2);

    // For now, commission and loan deduction are set to 0
    // These can be enhanced later with proper models
    let commissionAmount = 0;
    let loanDeduction = 0;

    // Get payroll adjustments for this employee, month, and year
    const adjustments = await getPayrollAdjustments(employeeId, month, year);

    // Apply adjustments to base calculated values
    const baseValues = {
      grossSalary,
      overtimeHours,
      overtimeAmount,
      sundayCount,
      sundayAmount,
      sundayFuel,
      leaveCount,
      leaveDeduction,
      halfDayCount,
      halfDayDeduction,
      commissionAmount,
      loanDeduction,
    };

    const adjustedValues = applyPayrollAdjustments(baseValues, adjustments);

    // Calculate net salary with adjustments
    const netSalary =
      grossSalary +
      fuelAmount +
      adjustedValues.sundayFuel +
      adjustedValues.commissionAmount +
      adjustedValues.overtimeAmount +
      adjustedValues.sundayAmount -
      adjustedValues.leaveDeduction -
      adjustedValues.halfDayDeduction -
      adjustedValues.loanDeduction;

    return {
      id: employee.id,
      name: employee.user.name,
      designation: employee.designation,
      location: (employee as any).location || "Head Office",
      grossSalary,
      fuelEntitlement,
      fuelRate,
      fuelAmount,
      commissionAmount: adjustedValues.commissionAmount,
      overtimeHours: Math.round(adjustedValues.overtimeHours * 100) / 100, // Round to 2 decimal places
      overtimeAmount: Math.round(adjustedValues.overtimeAmount * 100) / 100,
      sundayCount: adjustedValues.sundayCount,
      sundayAmount: Math.round(adjustedValues.sundayAmount * 100) / 100,
      sundayFuel: adjustedValues.sundayFuel,
      leaveCount: adjustedValues.leaveCount,
      leaveDeduction: Math.round(adjustedValues.leaveDeduction * 100) / 100,
      halfDayCount: adjustedValues.halfDayCount,
      halfDayDeduction: Math.round(adjustedValues.halfDayDeduction * 100) / 100,
      loanDeduction: adjustedValues.loanDeduction,
      netSalary: Math.round(netSalary * 100) / 100,
      account: (employee as any).bankAccount || "UBL", // Default account
    };
  } catch (error) {
    console.error("Error calculating payroll:", error);
    return null;
  }
}

/**
 * Calculate payroll for all employees for a given month and year
 */
export const calculateAllPayroll = async(
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear()
): Promise<PayrollCalculation[]> => {
  try {
    // Get all active employees
    const employees = await prisma.employee.findMany({
      where: {
        deletedAt: null,
        resignDate: null, // Only active employees
      },
      select: {
        id: true,
      },
    });

    // Calculate payroll for each employee
    const payrollPromises = employees.map((employee) =>
      calculatePayroll(employee.id, month, year)
    );

    const payrollResults = await Promise.all(payrollPromises);

    // Filter out null results
    return payrollResults.filter(
      (result): result is PayrollCalculation => result !== null
    );
  } catch (error) {
    console.error("Error calculating all payroll:", error);
    return [];
  }
}