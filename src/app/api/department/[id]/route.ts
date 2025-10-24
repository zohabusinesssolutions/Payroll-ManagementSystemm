import { departmentSchema } from "@/app/adminspace/human-resources/department/dto";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const data = departmentSchema.parse(body);

        const department_exists = await prisma.department.findFirst({
            where: { id },
        });

        if (!department_exists) {
            return NextResponse.json(
                { error: "Department with this ID does not exist" },
                { status: 404 }
            );
        }

        // Update the department
        await prisma.department.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
            },
        });

        // Handle permissions update
        if (data.permissions) {
            // Delete existing permissions
            await prisma.permission.deleteMany({
                where: { departmentId: id },
            });

            // Create new permissions
            const permissionsToCreate = Object.entries(data.permissions).map(
                ([model, access]) => ({
                    departmentId: id,
                    model: model,
                    accessScope: access.accessScope,
                    accessLevel: access.accessLevel,
                })
            );

            await prisma.permission.createMany({
                data: permissionsToCreate,
            });
        }

        return NextResponse.json({
            message: "Department Updated",
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
        
        const department_exists = await prisma.department.findFirst({
            where: { id },
            include: { users: true },
        });

        if (!department_exists) {
            return NextResponse.json(
                { error: "Department with this ID does not exist" },
                { status: 404 }
            );
        }

        if (department_exists.users && department_exists.users.length > 0) {
            return NextResponse.json(
                { error: "Cannot delete department with assigned users" },
                { status: 400 }
            );
        }

        // Delete permissions first
        await prisma.permission.deleteMany({
            where: { departmentId: id },
        });

        // Delete department
        await prisma.department.delete({
            where: { id },
        });

        return NextResponse.json({
            message: "Department DELETED",
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