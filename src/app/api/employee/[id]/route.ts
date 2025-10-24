import { employeeSchema } from "@/app/adminspace/human-resources/employees/dto";
import prisma from "@/lib/prisma";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
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
            grossSalary,
            fuelAllowance,
            medicalAllowance,
            modeOfPayment,
            bankName,
            accountTitle,
            accountNo,
            branchCode,
        } = data;

        const user_exists = await prisma.user.findFirst({
            where: { id },
            select: { 
                employee: { 
                    select: { 
                        id: true,
                        bankAccount: true 
                    } 
                } 
            }
        });

        const employeeId = user_exists?.employee?.id;
        const existingBankAccount = user_exists?.employee?.bankAccount;

        if (!employeeId) {
            return NextResponse.json(
                { error: "Employee with this ID does not exist" },
                { status: 404 }
            );
        }

        await prisma.user.update({
            where: { id },
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

        // Handle bank account based on payment mode
        if (modeOfPayment === "Cash") {
            // Delete existing bank account if mode is Cash
            if (existingBankAccount) {
                await prisma.bankAccount.delete({
                    where: { employeeId },
                });
            }
        } else if (modeOfPayment === "Online" && bankName && accountTitle && accountNo && branchCode) {
            // Create or update bank account if mode is Online
            if (existingBankAccount) {
                await prisma.bankAccount.update({
                    where: { employeeId },
                    data: {
                        bankName,
                        accountTitle,
                        accountNo,
                        branchCode,
                    },
                });
            } else {
                await prisma.bankAccount.create({
                    data: {
                        employeeId,
                        bankName,
                        accountTitle,
                        accountNo,
                        branchCode,
                    },
                });
            }
        }

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
                            grossSalary,
                            fuelAllowance,
                            medicalAllowance,
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


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        const user_exists = await prisma.user.findFirst({
            where: { id },
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
            where: { id }
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