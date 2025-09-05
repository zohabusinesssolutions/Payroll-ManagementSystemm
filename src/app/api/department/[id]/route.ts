import { employeeSchema } from "@/app/adminspace/human-resources/employees/dto";
import prisma from "@/lib/prisma";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const data = employeeSchema.parse(body);

        const {
            name,
            email,
            phoneNo,
            cnicNo,
            dateOfBirth,
            maritalStatus,
            address,
            department,
            designation,
            startDate,
            resignDate,
            basicSalary,
            fuelAllowance,
            medicalAllowance,
        } = data;

        const user_exists = await prisma.user.findFirst({
            where: { id: params.id, deletedAt: null },
            select: { employee: { select: { id: true } } }
        });

        const employeeId = user_exists?.employee?.id;

        if (!employeeId) {
            return NextResponse.json(
                { error: "Employee with this ID does not exist" },
                { status: 404 }
            );
        }

        await prisma.user.update({
            where: { id: params.id },
            data: {
                name,
                email,
                phoneNo,
                cnicNo,
                dateOfBirth: moment(dateOfBirth).toDate(),
                maritalStatus,
                address,
                department: {
                    connect: { id: department },
                },
            },
        });

        await prisma.employee.update({
            where: { id: employeeId },
            data: {
                designation,
                joiningDate: moment(startDate).toDate(),
                resignDate: resignDate ? moment(resignDate).toDate() : null,
                salary: {
                    update: {
                        where: { employeeId },
                        data: {
                            basicSalary,
                            fuelAllowance,
                            medicalAllowance,
                            perDaySalary: basicSalary / 30,
                        },
                    },
                },
            },
            include: {
                user: { include: { department: true } },
            },
        });

        return NextResponse.json({
            message: "Employee Updated",
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
        
        const user_exists = await prisma.user.findFirst({
            where: { id: params.id, deletedAt: null },
            select: { employee: { select: { id: true } } }
        });

        const employeeId = user_exists?.employee?.id;

        if (!employeeId) {
            return NextResponse.json(
                { error: "Employee with this ID does not exist" },
                { status: 404 }
            );
        }

        await prisma.user.delete({
            where: { id: params.id }
        });

        return NextResponse.json({
            message: "Employee DELETED",
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