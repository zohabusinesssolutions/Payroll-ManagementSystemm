import { employeeSchema } from "@/app/adminspace/human-resources/employees/dto";
import { IEmployee } from "@/app/types/IEmployee";
import { addLeadingNumber, generatePassword } from "@/lib/common";
import { hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { EmailService } from "@/services/email";
import { attendanceEnum } from "@prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        user: { include: { department: true } },
        salary: true, // include salary or anything else you need
      },
    });

    // Group attendance records by employeeId and status
    const attendanceCounts = await prisma.attendance.groupBy({
      by: ["employeeId", "status"],
      _count: {
        status: true,
      },
    });

    // Convert grouped results into a map for quick lookup
    const attendanceSummaryMap = attendanceCounts.reduce((acc, item) => {
      const { employeeId, status, _count } = item;
      if (!acc[employeeId]) {
        acc[employeeId] = {
          PRESENT: 0,
          ABSENT: 0,
          LEAVE: 0,
          HALFDAY: 0,
          LATE: 0,
        };
      }
      acc[employeeId][status] = _count.status;
      return acc;
    }, {} as Record<string, Record<keyof typeof attendanceEnum, number>>);

    // Merge attendance summary into each employee
    const enrichedEmployees: IEmployee[] = employees.map((emp) => ({
      id: emp.user.id,
      employeeId: emp.id,
      phoneNo: emp.user.phoneNo,
      cnicNo: emp.user.cnicNo,
      dateOfBirth: emp.user.dateOfBirth.toISOString(),
      address: emp.user.address,
      salary: {
        id: emp.salary!.id,
        employeeId: emp.id,
        basicSalary: emp.salary?.basicSalary || 0,
        fuelAllowance: emp.salary?.fuelAllowance || 0,
        medicalAllowance: emp.salary?.medicalAllowance || 0,
        perDaySalary: emp.salary?.perDaySalary || 0,
      },
      name: emp.user.name,
      email: emp.user.email,
      designation: emp.designation,
      department: emp.user.department.name,
      joiningDate: emp.joiningDate.toISOString(),
      resignDate: emp.resignDate ? emp.resignDate.toISOString() : undefined,
      status: emp.resignDate ? "resigned" : "active",
      image: emp.user.image!,
      attendance: attendanceSummaryMap[emp.id] || {
        PRESENT: 0,
        ABSENT: 0,
        LEAVE: 0,
        HALFDAY: 0,
        LATE: 0,
      },
    }));

    return NextResponse.json({
      message: "Employee Fetched",
      data: enrichedEmployees,
      count: enrichedEmployees.length,
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

// Create a new employee
export async function POST(request: NextRequest) {
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
      where: { email },
    });

    if (user_exists) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    const empCount = 1 + (await prisma.employee.count());
    const employeeId =
      "E" +
      moment(startDate).format("YYMM") +
      addLeadingNumber({ value: empCount.toString() });

    // create password
    const password = generatePassword();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNo,
        cnicNo,
        dateOfBirth: moment(dateOfBirth).toDate(),
        maritalStatus,
        password: hashPassword(password),
        address,
        department: {
          connect: { id: department },
        },
      },
    });

    const { value: allowedLeave } = await prisma.setting.findFirstOrThrow({
      where: { title: "LEAVES_ALLOWED" },
    });

    const employee = await prisma.employee.create({
      data: {
        designation,
        joiningDate: moment(startDate).toDate(),
        resignDate: resignDate ? moment(resignDate).toDate() : null,
        userId: user.id,
        id: employeeId,
        employeeLeave: {
          create: {
            leavesTaken: 0,
            totalLeaves: Number(allowedLeave),
            leavesAvailable: Number(allowedLeave),
          },
        },
        salary: {
          connectOrCreate: {
            where: { employeeId: employeeId },
            create: {
              basicSalary,
              fuelAllowance,
              medicalAllowance,
              perDaySalary: basicSalary / 30, // Assuming 30 days in a month
            },
          },
        },
      },
      include: {
        user: { include: { department: true } },
      },
    });

    const emailService = new EmailService();

    const templatePath = path.join(
      process.cwd(),
      "src",
      "template",
      "employee-onboarding-email.html"
    );
    let html = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders with actual values
    const replacements = {
      "[app_name]": "Sehat Net",
      "[employee_name]": user.name,
      "[employee_id]": employeeId,
      "[department]": employee.user.department.name,
      "[start_date]": moment(employee.joiningDate).format("YYYY-MM-DD"),
      "[employee_email]": user.email,
      "[employee_password]": password,
      "[LOGIN_LINK]": "https://sehatnet.pk/employee-login",
      "[year]": moment().format("YYYY"),
      "[hr_email]": "hr@sehatnet.pk",
    };

    for (const [key, value] of Object.entries(replacements)) {
      html = html.replaceAll(key, value);
    }

    await emailService.send({
      email,
      subject: "Welcome to the Company",
      html: html,
    });

    return NextResponse.json({
      message: "Employee Created",
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
