import { NextRequest, NextResponse } from "next/server";
import { calculatePayroll, calculateAllPayroll } from "@/lib/payroll";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get("employeeId");
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");
    const bankName = searchParams.get("bankName");

    // Validate required parameters
    if (!monthParam || !yearParam) {
      return NextResponse.json(
        { error: "Month and year parameters are required" },
        { status: 400 }
      );
    }

    const month = parseInt(monthParam);
    const year = parseInt(yearParam);

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

    // If employeeId is provided, get payroll for specific employee
    if (employeeId) {
      // Validate employee exists
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        include: {
          user: true,
        },
      });

      if (!employee) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      // Calculate payroll for specific employee
      const payrollData = await calculatePayroll(employeeId, month, year);

      if (!payrollData) {
        return NextResponse.json(
          { error: "Could not calculate payroll for this employee" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        data: [payrollData], // Return as array for consistency
        total: 1,
        month,
        year,
        employeeId,
      });
    }

    // If no employeeId, get payroll for all employees
    let payrollData = await calculateAllPayroll(month, year);

    // Filter by bank name if provided
    if (bankName && bankName.trim()) {
      payrollData = payrollData.filter((payroll) => {
        const bankNameLower = bankName.toLowerCase().trim();
        // Check if the payroll has bank details and bank name contains the search term
        return payroll.bankDetails && 
               payroll.bankDetails.toLowerCase().includes(bankNameLower);
      });
    }

    return NextResponse.json({
      data: payrollData,
      total: payrollData.length,
      month,
      year,
      ...(bankName && { bankName }),
    });
  } catch (error) {
    console.error("Error fetching payroll:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching payroll" },
      { status: 500 }
    );
  }
}