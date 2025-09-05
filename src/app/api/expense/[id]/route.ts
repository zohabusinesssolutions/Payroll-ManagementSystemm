import { expenseSchema } from "@/app/adminspace/finance/expenses/dto";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const data = expenseSchema.parse(body);

        const expense_exists = await prisma.expense.findFirst({
            where: { id: params.id }
        });

        if (!expense_exists) {
            return NextResponse.json(
                { message: "expense does not exists", success: false },
                { status: 404 }
            );
        }

        await prisma.expense.update({ where: { id: params.id }, data })
        return NextResponse.json({
            message: "Project Updated",
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {

        const expense_exists = await prisma.expense.findFirst({
            where: { id: params.id }
        });

        if (!expense_exists) {
            return NextResponse.json(
                { message: "expense does not exists", success: false },
                { status: 404 }
            );
        }
        await prisma.expense.delete({ where: { id: params.id } });
        return NextResponse.json({
            message: "expense DELETED",
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}