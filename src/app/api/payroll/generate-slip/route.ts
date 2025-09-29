import { NextRequest, NextResponse } from "next/server";
import { calculatePayroll } from "@/lib/payroll";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { employeeId, month, year } = await request.json();

    if (!employeeId || !month || !year) {
      return NextResponse.json(
        { message: "Employee ID, month, and year are required" },
        { status: 400 }
      );
    }

    // Check if salary slip already exists
    const existingSlip = await prisma.salarySlip.findUnique({
      where: {
        employeeId_month_year: {
          employeeId,
          month: parseInt(month),
          year: parseInt(year),
        },
      },
    });

    if (existingSlip) {
      return NextResponse.json(
        { message: "Salary slip already generated for this month/year" },
        { status: 400 }
      );
    }

    // Calculate payroll
    const payrollData = await calculatePayroll(employeeId, parseInt(month), parseInt(year));

    if (!payrollData) {
      return NextResponse.json(
        { message: "Unable to calculate payroll for this employee" },
        { status: 404 }
      );
    }

    // Create salary slip record in database  
    const salarySlip = await prisma.salarySlip.create({
      data: {
        employeeId,
        month: parseInt(month),
        year: parseInt(year),
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
        netSalary: payrollData.netSalary,
        account: payrollData.account,
      } as any, // Type assertion to bypass Prisma client issues
    });

    // Return payroll data as JSON for frontend PDF generation
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return NextResponse.json({
      success: true,
      data: {
        ...payrollData,
        month: parseInt(month),
        year: parseInt(year),
        monthName: monthNames[parseInt(month) - 1],
        slipId: salarySlip.id,
        generatedDate: new Date().toISOString(),
        companyName: "ZOHA Business Solutions",
        // Calculate totals for frontend
        totalEarnings: payrollData.grossSalary + payrollData.fuelAmount + 
                      payrollData.commissionAmount + payrollData.overtimeAmount + 
                      payrollData.sundayAmount + payrollData.sundayFuel,
        totalDeductions: payrollData.leaveDeduction + payrollData.halfDayDeduction + 
                        payrollData.loanDeduction,
      }
    });
  } catch (error: any) {
    console.error("Error generating salary slip:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { message: error.message || "Internal server error", error: error.toString() },
      { status: 500 }
    );
  }
}