import { NextRequest, NextResponse } from "next/server";
import { calculateAllPayroll } from "@/lib/payroll";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

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

    // Get payroll data for all employees
    const payrollData = await calculateAllPayroll(month, year);

    if (!payrollData || payrollData.length === 0) {
      return NextResponse.json(
        { error: "No payroll data found for the specified month and year" },
        { status: 404 }
      );
    }

    // Create CSV headers
    const headers = [
      "Employee ID",
      "Employee Name",
      "Designation",
      "Location",
      "Gross Salary",
      "Fuel Entitlement",
      "Fuel Rate",
      "Fuel Amount",
      "Commission Amount",
      "Overtime Hours",
      "Overtime Amount",
      "Sunday Count",
      "Sunday Amount",
      "Sunday Fuel",
      "Leave Count",
      "Leave Deduction",
      "Half Day Count",
      "Half Day Deduction",
      "Loan Deduction",
      "Net Salary",
      "Account",
    ];

    // Create CSV rows
    const rows = payrollData.map((item) => [
      item.id,
      item.name,
      item.designation,
      item.location,
      item.grossSalary,
      item.fuelEntitlement || 0,
      item.fuelRate,
      item.fuelAmount,
      item.commissionAmount,
      item.overtimeHours,
      item.overtimeAmount,
      item.sundayCount,
      item.sundayAmount,
      item.sundayFuel,
      item.leaveCount,
      item.leaveDeduction,
      item.halfDayCount,
      item.halfDayDeduction,
      item.loanDeduction,
      item.netSalary,
      item.account,
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    // Get month name for filename
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[month - 1];
    const filename = `payroll_${monthName}_${year}.csv`;

    // Return CSV as response
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting payroll:", error);
    return NextResponse.json(
      { error: "Internal server error while exporting payroll" },
      { status: 500 }
    );
  }
}