import { departmentSchema } from "@/app/adminspace/human-resources/department/dto";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get("name");
    const departments = await prisma.department.findMany({
      where: name
        ? {
            name: {
              contains: name,
              mode: "insensitive",
            },
          }
        : undefined,
      include: {
        permissions: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    });
    return NextResponse.json({
      message: "Department Fetched",
      data: departments,
      count: departments.length,
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

// Create a new department
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = departmentSchema.parse(body);

    const { name, description, isSuperAdmin, permissions } = data;

    const department_exists = await prisma.department.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (department_exists) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const permissionEntries = Object.entries(permissions).map(([model, value]) => ({
      model,
      accessScope: value.accessScope,
      accessLevel: value.accessLevel,
    }));

    // Create department and its permissions in one go
    const department = await prisma.department.create({
      data: {
        name,
        description,
        permissions: {
          create: permissionEntries,
        },
      },
      include: {
        permissions: true,
      },
    });

    return NextResponse.json({
      message: "Department Created",
      data: data,
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
