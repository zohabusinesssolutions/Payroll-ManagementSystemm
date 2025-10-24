import { milestoneSchema } from "@/app/adminspace/projects/milestones/dto";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const project_id = req.nextUrl.searchParams.get("project_id");
    const [milestones, count] = await prisma.$transaction([
      prisma.milestone.findMany({
        where: project_id
          ? {
              projectId: project_id,
            }
          : undefined,
        include: { project: true },
      }),
      prisma.milestone.count({
        where: project_id
          ? {
              projectId: project_id,
            }
          : undefined,
      }),
    ]);
    return NextResponse.json({
      message: "Milestones Fetched",
      data: milestones,
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
    const data = milestoneSchema.parse(body);

    const project_exists = await prisma.project.findFirst({
      where: { id: data.projectId },
    });

    if (!project_exists) {
      return NextResponse.json(
        {
          message: "Project does not exist",
          success: false,
        },
        { status: 404 }
      );
    }

    const milestone = await prisma.milestone.create({ data });

    return NextResponse.json({
      message: "Milestone Created",
      data: milestone,
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
