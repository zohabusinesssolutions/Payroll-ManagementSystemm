import { projectSchema } from "@/app/adminspace/projects/dto";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const data = projectSchema.parse(body);

        const project_exists = await prisma.project.findFirst({
            where: { id }
        });

        if (!project_exists) {
            return NextResponse.json(
                { message: "Project does not exists", success: false },
                { status: 404 }
            );
        }

        await prisma.project.update({ where: { id }, data })
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const project_exists = await prisma.project.findFirst({
            where: { id }
        });

        if (!project_exists) {
            return NextResponse.json(
                { message: "Project does not exists", success: false },
                { status: 404 }
            );
        }
        await prisma.project.delete({ where: { id } });
        return NextResponse.json({
            message: "Project DELETED",
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