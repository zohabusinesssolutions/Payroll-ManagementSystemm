import { IEmployee } from "@/app/types/IEmployee";
import prisma from "@/lib/prisma";
import { attendanceEnum } from "@prisma/client";

export class EmployeeService {

    constructor() {

    }

    async get(id: string) {

        const employee = await prisma.employee.findFirst({
            where: { id, deletedAt: null },
            include: {
                user: { include: { department: true } },
                salary: true,
            }
        })

        return employee
    }

    async getAll() {
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
    }

    async getByDepartment(departmentId: string) {

    }

    async create() {

    }

    async update() {

    }

    async delete() {

    }

    async resign() {

    }

    async downloadExperienceLetter(employeeId: string) {

    }
}
