import { milestoneSchema } from "@/app/adminspace/projects/milestones/dto";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
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

        await prisma.milestone.update({ where: { id }, data })
        return NextResponse.json({
            message: "Milestone Updated",
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

type Params = Promise<{
    id: string;
}>;
  
export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
    try {
      const { id } = await params;
      const milestone = await prisma.milestone.findUnique({
        where: { id },
      });
  
      if (!milestone) {
        return NextResponse.json(
          { message: "Milestone does not exist", success: false },
          { status: 404 }
        );
      }
  
      await prisma.milestone.delete({ where: { id } });
  
      return NextResponse.json({
        message: "Milestone deleted successfully",
        success: true,
      });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Internal Server Error",
          success: false,
        },
        { status: 500 }
      );
    }
}