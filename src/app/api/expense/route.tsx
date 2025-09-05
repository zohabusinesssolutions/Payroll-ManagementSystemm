import { expenseSchema } from "@/app/adminspace/finance/expenses/dto";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const month = req.nextUrl.searchParams.get("month");
    const [expenses, count] = await prisma.$transaction([
      prisma.expense.findMany({
        where: month
          ? {
              month: { equals: month, mode: "insensitive" },
            }
          : undefined,
      }),
      prisma.expense.count({
        where: month
          ? {
              month: { equals: month, mode: "insensitive" },
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

// Create a new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = expenseSchema.parse(body);
    const expense = await prisma.expense.create({ data });

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
