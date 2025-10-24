import { expenseSchema } from "@/app/adminspace/finance/expenses/dto";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const month = req.nextUrl.searchParams.get("month");
    const monthNumber = month ? parseInt(month, 10) : undefined;
    
    const [expenses, count] = await prisma.$transaction([
      prisma.expense.findMany({
        where: monthNumber !== undefined
          ? {
              month: monthNumber,
            }
          : undefined,
      }),
      prisma.expense.count({
        where: monthNumber !== undefined
          ? {
              month: monthNumber,
            }
          : undefined,
      }),
    ]);
    return NextResponse.json({
      message: "Expense Fetched",
      data: expenses,
      count: count,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// Create a new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = expenseSchema.parse(body);
    
    // Convert month string to number
    const expenseData = {
      ...data,
      month: parseInt(data.month, 10),
    };
    
    const expense = await prisma.expense.create({ data: expenseData });

    return NextResponse.json({
      message: "expense Created",
      data: expense,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
