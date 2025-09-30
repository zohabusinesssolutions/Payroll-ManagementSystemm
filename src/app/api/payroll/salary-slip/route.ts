import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculatePayroll } from "@/lib/payroll";

interface GenerateSalarySlipRequest {
  employeeId: string;
  month: number;
  year: number;
  bonus?: number;
  bonusType?: "RAMADAN" | "PERFORMANCE";
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateSalarySlipRequest = await request.json();
    const { employeeId, month, year, bonus = 0, bonusType } = body;

    // Validate required fields
    if (!employeeId || !month || !year) {
      return NextResponse.json(
        { error: "Missing required fields: employeeId, month, year" },
        { status: 400 }
      );
    }

    // Validate month and year
    if (month < 1 || month > 12) {
      return NextResponse.json(
        { error: "Invalid month. Must be between 1 and 12." },
        { status: 400 }
      );
    }

    if (year < 2000 || year > 9999) {
      return NextResponse.json(
        { error: "Invalid year. Must be between 2000 and 9999." },
        { status: 400 }
      );
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        user: true,
        salary: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Calculate payroll with adjustments (merged values)
    const payrollData = await calculatePayroll(employeeId, month, year);
    if (!payrollData) {
      return NextResponse.json(
        { error: "Could not calculate payroll for this employee" },
        { status: 500 }
      );
    }

    // Calculate final net salary including bonus
    const finalNetSalary = payrollData.netSalary + bonus;

    // Calculate total earnings and deductions for PDF
    const totalEarnings = payrollData.grossSalary + 
                         payrollData.fuelAmount + 
                         payrollData.sundayFuel + 
                         payrollData.commissionAmount + 
                         payrollData.overtimeAmount + 
                         payrollData.sundayAmount + 
                         bonus;

    const totalDeductions = payrollData.leaveDeduction + 
                           payrollData.halfDayDeduction + 
                           payrollData.loanDeduction;

    // Get month name for PDF
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Check if salary slip already exists for this employee, month, and year
    const existingSalarySlip = await prisma.salarySlip.findUnique({
      where: {
        employeeId_month_year: {
          employeeId,
          month,
          year,
        },
      },
    });

    let salarySlip;

    if (existingSalarySlip) {
      // Update existing salary slip with current calculated values
      salarySlip = await prisma.salarySlip.update({
        where: {
          employeeId_month_year: {
            employeeId,
            month,
            year,
          },
        },
        data: {
          grossSalary: payrollData.grossSalary,
          fuelEntitlement: payrollData.fuelEntitlement || 0,
          fuelAmount: payrollData.fuelAmount,
          commissionOrAdditional: payrollData.commissionAmount,
          overtimeHours: payrollData.overtimeHours,
          overtimeAmount: payrollData.overtimeAmount,
          sunday: payrollData.sundayCount,
          sundayAmount: payrollData.sundayAmount,
          sundayFuel: payrollData.sundayFuel,
          leaveCount: payrollData.leaveCount,
          halfDayCount: payrollData.halfDayCount,
          leaveDeduction: payrollData.leaveDeduction,
          halfDayDeduction: payrollData.halfDayDeduction,
          loanOrOtherDeduction: payrollData.loanDeduction,
          netSalary: finalNetSalary,
          bonus: bonus,
          bonusType: bonusType || null,
          account: payrollData.account,
          updatedAt: new Date(),
        },
        include: {
          employee: {
            include: {
              user: true,
            },
          },
        },
      });
    } else {
      // Create new salary slip with calculated values
      salarySlip = await prisma.salarySlip.create({
        data: {
          employeeId,
          month,
          year,
          grossSalary: payrollData.grossSalary,
          fuelEntitlement: payrollData.fuelEntitlement || 0,
          fuelAmount: payrollData.fuelAmount,
          commissionOrAdditional: payrollData.commissionAmount,
          overtimeHours: payrollData.overtimeHours,
          overtimeAmount: payrollData.overtimeAmount,
          sunday: payrollData.sundayCount,
          sundayAmount: payrollData.sundayAmount,
          sundayFuel: payrollData.sundayFuel,
          leaveCount: payrollData.leaveCount,
          halfDayCount: payrollData.halfDayCount,
          leaveDeduction: payrollData.leaveDeduction,
          halfDayDeduction: payrollData.halfDayDeduction,
          loanOrOtherDeduction: payrollData.loanDeduction,
          netSalary: finalNetSalary,
          bonus: bonus,
          bonusType: bonusType || null,
          account: payrollData.account,
          status: "UNPAID",
        },
        include: {
          employee: {
            include: {
              user: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      // Return data in SalarySlipData format for PDF generation
      name: salarySlip.employee.user.name,
      designation: salarySlip.employee.designation,
      location: salarySlip.employee.location || "Head Office",
      account: salarySlip.account || "UBL",
      grossSalary: salarySlip.grossSalary,
      fuelEntitlement: salarySlip.fuelEntitlement,
      fuelRate: payrollData.fuelRate,
      fuelAmount: salarySlip.fuelAmount,
      commissionAmount: salarySlip.commissionOrAdditional,
      overtimeHours: salarySlip.overtimeHours,
      overtimeAmount: salarySlip.overtimeAmount,
      sundayCount: salarySlip.sunday,
      sundayAmount: salarySlip.sundayAmount,
      sundayFuel: salarySlip.sundayFuel,
      leaveCount: salarySlip.leaveCount,
      leaveDeduction: salarySlip.leaveDeduction,
      halfDayCount: salarySlip.halfDayCount,
      halfDayDeduction: salarySlip.halfDayDeduction,
      loanDeduction: salarySlip.loanOrOtherDeduction,
      netSalary: salarySlip.netSalary,
      totalEarnings: totalEarnings,
      totalDeductions: totalDeductions,
      monthName: monthNames[month - 1],
      year: year,
      companyName: "Payroll Management System", // You can make this configurable
      generatedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      id: salarySlip.id,
      month: month,
    });

  } catch (error) {
    console.error("Error generating salary slip:", error);
    return NextResponse.json(
      { error: "Internal server error while generating salary slip" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get("employeeId");
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    // If specific employee, month, and year are provided
    if (employeeId && monthParam && yearParam) {
      const month = parseInt(monthParam);
      const year = parseInt(yearParam);

      const salarySlip = await prisma.salarySlip.findUnique({
        where: {
          employeeId_month_year: {
            employeeId,
            month,
            year,
          },
        },
        include: {
          employee: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!salarySlip) {
        return NextResponse.json(
          { error: "Salary slip not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        data: {
          id: salarySlip.id,
          employeeId: salarySlip.employeeId,
          employeeName: salarySlip.employee.user.name,
          designation: salarySlip.employee.designation,
          month: salarySlip.month,
          year: salarySlip.year,
          grossSalary: salarySlip.grossSalary,
          fuelEntitlement: salarySlip.fuelEntitlement,
          fuelAmount: salarySlip.fuelAmount,
          commissionAmount: salarySlip.commissionOrAdditional,
          overtimeHours: salarySlip.overtimeHours,
          overtimeAmount: salarySlip.overtimeAmount,
          sundayCount: salarySlip.sunday,
          sundayAmount: salarySlip.sundayAmount,
          sundayFuel: salarySlip.sundayFuel,
          leaveCount: salarySlip.leaveCount,
          halfDayCount: salarySlip.halfDayCount,
          leaveDeduction: salarySlip.leaveDeduction,
          halfDayDeduction: salarySlip.halfDayDeduction,
          loanDeduction: salarySlip.loanOrOtherDeduction,
          bonus: salarySlip.bonus,
          bonusType: salarySlip.bonusType,
          netSalary: salarySlip.netSalary,
          account: salarySlip.account,
          status: salarySlip.status,
          paidOn: salarySlip.paidOn,
          createdAt: salarySlip.createdAt,
          updatedAt: salarySlip.updatedAt,
        },
      });
    }

    // Otherwise, get all salary slips with optional filters
    const month = monthParam ? parseInt(monthParam) : undefined;
    const year = yearParam ? parseInt(yearParam) : undefined;

    const whereClause: any = {};
    if (month) whereClause.month = month;
    if (year) whereClause.year = year;

    const salarySlips = await prisma.salarySlip.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
        { employee: { user: { name: 'asc' } } },
      ],
    });

    return NextResponse.json({
      data: salarySlips.map(slip => ({
        id: slip.id,
        employeeId: slip.employeeId,
        employeeName: slip.employee.user.name,
        designation: slip.employee.designation,
        month: slip.month,
        year: slip.year,
        grossSalary: slip.grossSalary,
        netSalary: slip.netSalary,
        status: slip.status,
        paidOn: slip.paidOn,
        createdAt: slip.createdAt,
      })),
      total: salarySlips.length,
    });

  } catch (error) {
    console.error("Error fetching salary slips:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching salary slips" },
      { status: 500 }
    );
  }
}