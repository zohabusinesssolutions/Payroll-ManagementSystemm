import { ClientSchema } from "@/app/adminspace/clients/dto";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get("name");
    const clients = await prisma.client.findMany({
      where: name
        ? {
            name: {
              contains: name,
              mode: "insensitive",
            },
          }
        : undefined,
    });
    return NextResponse.json({
      message: "Client Fetched",
      data: clients,
      count: clients.length,
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

// Create a new department
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = ClientSchema.parse(body);

    const client_exists = await prisma.client.findFirst({
      where: { email: data.email },
    });

    if (client_exists) {
      return NextResponse.json(
        {
          message: "Other client with this email already exists",
          success: false,
        },
        { status: 409 }
      );
    }
    // Create Client and its permissions in one go
    const client = await prisma.client.create({
      data,
    });

    return NextResponse.json({
      message: "Department Created",
      data: client,
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
