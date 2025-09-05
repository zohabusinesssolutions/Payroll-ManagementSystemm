import { projectSchema } from "@/app/adminspace/projects/dto";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get("client_name");
    const [projects, count] = await prisma.$transaction([
      prisma.project.findMany({
        where: name
          ? {
              client: {
                name: {
                  contains: name,
                  mode: "insensitive",
                },
              },
            }
          : undefined,
        include: { client: true, milestones: true },
      }),
      prisma.project.count({
        where: name
          ? {
              client: {
                name: {
                  contains: name,
                  mode: "insensitive",
                },
              },
            }
          : undefined,
      }),
    ]);
    return NextResponse.json({
      message: "Project Fetched",
      data: projects,
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
    const data = projectSchema.parse(body);

    const project_exists = await prisma.project.findFirst({
      where: { name: data.name },
    });

    if (project_exists) {
      return NextResponse.json(
        {
          message: "This Project Already Exist",
          success: false,
        },
        { status: 409 }
      );
    }

    const client = await prisma.project.create({ data });

    return NextResponse.json({
      message: "Project Created",
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
