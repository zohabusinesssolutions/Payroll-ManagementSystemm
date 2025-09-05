import { ClientSchema } from "@/app/adminspace/clients/dto";
import { employeeSchema } from "@/app/adminspace/human-resources/employees/dto";
import prisma from "@/lib/prisma";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const data = ClientSchema.parse(body);

        const client_exists = await prisma.client.findFirst({
            where: { email: data.email },
            select: { id: true, projectToClient: true }
        });

        if (!client_exists) {
            return NextResponse.json(
                { message: "Client does not exists", success: false },
                { status: 404 }
            );
        }

        if (client_exists && params.id != client_exists!.id) {
            return NextResponse.json(
                { message: "Other client with this email already exists", success: false },
                { status: 409 }
            );
        }

        await prisma.client.update({ where: { id: params.id }, data })
        return NextResponse.json({
            message: "Client Updated",
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
        request.url
        const client_exists = await prisma.client.findFirst({
            where: { id: params.id },
            include: { projectToClient: true }
        });

        if (!client_exists) {
            return NextResponse.json(
                { message: "Client does not exists", success: false },
                { status: 404 }
            );
        }

        if (client_exists.projectToClient.length > 0) {
            return NextResponse.json(
                { message: "Client has project linked to it. Cannot be deleted.", success: false },
                { status: 400 }
            );
        }


        await prisma.client.delete({ where: { id: params.id } });

        return NextResponse.json({
            message: "Client DELETED",
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