import { calculateAllPayroll, PayrollCalculation } from "@/lib/payroll";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters for month and year
    const searchParams = request.nextUrl.searchParams;
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    // Default to current month and year if not provided
    const currentDate = new Date();
    const month = monthParam ? parseInt(monthParam) : currentDate.getMonth() + 1;
    const year = yearParam ? parseInt(yearParam) : currentDate.getFullYear();

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

    // Calculate payroll for all employees
    const payrollData: PayrollCalculation[] = await calculateAllPayroll(month, year);

    // Return response in the expected format
    return NextResponse.json({
      data: payrollData,
      total: payrollData.length,
      month,
      year,
    });
  } catch (error) {
    console.error("Error fetching payroll summary:", error);
    return NextResponse.json(
      { error: "Internal server error while calculating payroll" },
      { status: 500 }
    );
  }
}