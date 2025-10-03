
import XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const saltRounds = bcrypt.genSaltSync(10);
const prisma = new PrismaClient();

function hashPassword(password) {
  if (!password) {
    const error = TypeError(`Password must not be empty!`);
    throw error;
  }

  return bcrypt.hashSync(password, saltRounds);
}

const SETTING = [
  { title: 'LATE_ALLOWED', value: '3' },
  { title: 'LATE_AMOUNT_DEDUCT', value: '0.15' },
  { title: 'LATE_TIME', value: '10:15' },
  { title: 'LEAVES_ALLOWED', value: '1.5' },  // 1.5 mtlb 1 din off krskte aur 1 din half day le skte
  { title: 'API_KEY', value: '0.0' },
  { title: 'FUEL_PRICE', value: '258' }
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    await prisma.setting.createMany({ data: SETTING });
    console.log(`✅ Created Portal Settings`);


    // Create Administrator department with permissions
    // const adminDepartment = await prisma.department.upsert({
    //   where: { name: 'Administrator' },
    //   update: {},
    //   create: {
    //     name: 'Administrator',
    //     description: 'Administrator department with full system access',
    //     permissions: {
    //       create: [
    //         {
    //           model: 'Projects',
    //           accessLevel: 'WRITE',
    //           accessScope: 'ALL',
    //         },
    //         {
    //           model: 'Finance',
    //           accessLevel: 'WRITE',
    //           accessScope: 'ALL',
    //         },
    //         {
    //           model: 'Employee',
    //           accessLevel: 'WRITE',
    //           accessScope: 'ALL',
    //         },
    //         {
    //           model: 'Clients',
    //           accessLevel: 'WRITE',
    //           accessScope: 'ALL',
    //         },
    //         {
    //           model: 'Analytics',
    //           accessLevel: 'WRITE',
    //           accessScope: 'ALL',
    //         },
    //         {
    //           model: 'Salary',
    //           accessLevel: 'WRITE',
    //           accessScope: 'ALL',
    //         },
    //       ],
    //     },
    //   },
    // });

    // const financeDepartment = await prisma.department.upsert({
    //   where: { name: 'Finance' },
    //   update: {},
    //   create: {
    //     name: 'Finance',
    //     description: 'Finance department responsible for managing company finances',
    //     permissions: {
    //       create: [
    //         {
    //           model: 'Finance',
    //           accessLevel: 'WRITE',
    //           accessScope: 'ALL',
    //         },
    //         {
    //           model: 'Salary',
    //           accessLevel: 'WRITE',
    //           accessScope: 'ALL',
    //         },
    //         {
    //           model: 'Analytics',
    //           accessLevel: 'READ',
    //           accessScope: 'ALL',
    //         },
    //         {
    //           model: 'Projects',
    //           accessLevel: 'READ',
    //           accessScope: 'ALL',
    //         },
    //       ],
    //     },
    //   },
    // });

    // console.log(`✅ Created/Updated department: ${financeDepartment.name}`);


    // Create Admin user
    // const adminUser = await prisma.user.upsert({
    //   where: { email: 'contact.syedjawad@gmail.com' },
    //   update: {},
    //   create: {
    //     email: 'contact.syedjawad@gmail.com',
    //     name: 'Syed Jawad',
    //     phoneNo: '1234567890',
    //     password: hashPassword('123456'),
    //     dateOfBirth: new Date('1990-01-01'),
    //     maritalStatus: 'SINGLE',
    //     cnicNo: '12345-6789012-3',
    //     departmentId: adminDepartment.id,
    //     emergencyContactDetails: {
    //       name: 'Emergency Contact',
    //       phone: '0987654321',
    //       relationship: 'Family'
    //     }
    //   }
    // });

    // console.log(`✅ Created/Updated user: ${adminUser.name}`);

    // // Generate employee ID in format E[Month][Year][Number]
    // let joiningDate = new Date();
    // let month = String(joiningDate.getMonth() + 1).padStart(2, '0');
    // let year = String(joiningDate.getFullYear()).slice(-2);
    // let monthYearPrefix = `E${month}${year}`;

    // // // Get existing employees count to determine next employee number
    // let existingEmployees = await prisma.employee.count();
    // // Calculate next employee number
    // let nextEmployeeId = 1;
    // if (existingEmployees > 0) nextEmployeeId = existingEmployees + 1
    // let employeeId = `${monthYearPrefix}${String(nextEmployeeId).padStart(3, '0')}`;

    // // // Create Employee record for the admin user
    // const adminEmployee = await prisma.employee.upsert({
    //   where: { userId: adminUser.id },
    //   update: {},
    //   create: {
    //     id: employeeId,
    //     userId: adminUser.id,
    //     joiningDate: joiningDate,
    //     designation: 'System Administrator',
    //   }
    // });

    // console.log(`✅ Created/Updated employee record for: ${adminUser.name}`);

    // // Create salary record for the admin employee
    // await prisma.salary.upsert({
    //   where: { employeeId: adminEmployee.id },
    //   update: {},
    //   create: {
    //     employeeId: adminEmployee.id,
    //     grossSalary: 150000,
    //     fuelAllowance: 10000,
    //   }
    // });

    // const leavesAllowedSetting = await prisma.setting.findUnique({
    //   where: { title: 'LEAVES_ALLOWED' },
    // });
    // const leavesAllowed = leavesAllowedSetting ? parseFloat(leavesAllowedSetting.value) : 1.5;

    // await prisma.employeeLeaves.upsert({
    //   where: { employeeId: 'E0925001' },
    //   update: {},
    //   create: {
    //     employeeId: 'E0925001',
    //     leavesAvailable: 1.0,
    //     leavesTaken: .5,
    //     totalLeaves: leavesAllowed,
    //   }
    // });

    // console.log(`✅ Created employee leaves record for: ${adminUser.name}`);

    // Helper function to get random status + timings
    // function getRandomAttendance(date) {
    //   const statuses = ['PRESENT', 'ABSENT', 'LATE'];
    //   const status = statuses[Math.floor(Math.random() * statuses.length)];

    //   if (status === 'ABSENT') {
    //     return {
    //       inTime: null,
    //       outTime: null,
    //       workingHours: null,
    //       status,
    //     };
    //   }

    //   // Random inTime (9:00 - 10:00 AM)
    //   const inHour = 9 + Math.floor(Math.random() * 2);
    //   const inMinute = Math.floor(Math.random() * 60);
    //   const inTime = new Date(date);
    //   inTime.setHours(inHour, inMinute, 0, 0);

    //   // Random outTime (5:00 - 6:00 PM)
    //   const outHour = 17 + Math.floor(Math.random() * 2);
    //   const outMinute = Math.floor(Math.random() * 60);
    //   const outTime = new Date(date);
    //   outTime.setHours(outHour, outMinute, 0, 0);

    //   const workingHours = `${outHour - inHour}h`;

    //   return { inTime, outTime, workingHours, status };
    // }

    // const employees = [financeEmployee1, financeEmployee2, financeEmployee3];

    // // Last 15 days ka data
    // for (const emp of employees) {
    //   for (let i = 0; i < 15; i++) {
    //     const date = new Date();
    //     date.setDate(date.getDate() - i); // pichle 15 din

    //     const { inTime, outTime, workingHours, status } = getRandomAttendance(date);

    //     await prisma.attendance.upsert({
    //       where: {
    //         employeeId_date: {
    //           employeeId: emp.id,
    //           date,
    //         },
    //       },
    //       update: {},
    //       create: {
    //         employeeId: emp.id,
    //         date,
    //         month: date.getMonth() + 1,
    //         inTime,
    //         outTime,
    //         workingHours,
    //         status,
    //       },
    //     });
    //   }
    // }
    // console.log(`✅ Created attendance records for last 15 days for all employees`);

    // await prisma.leavesApplied.createMany({
    //   data: [
    //     // Employee 1 leaves
    //     {
    //       employeeId: 'E0925002',
    //       leaveType: "FULLDAY",
    //       date: new Date("2025-09-10"),
    //       status: "APPROVED",
    //       reason: "Family emergency",
    //     },
    //     {
    //       employeeId: 'E0925002',
    //        leaveType: "HALFDAY",
    //       date: new Date("2025-09-12"),
    //       status: "APPROVED",
    //       reason: "Doctor appointment",
    //     },
    //     {
    //       employeeId: 'E0925002',
    //       leaveType: "HALFDAY",
    //       date: new Date("2025-09-15"),
    //       status: "APPROVED",
    //       reason: "Short leave",
    //     },
    //     {
    //       employeeId: 'E0925002',
    //       leaveType: "HALFDAY",
    //       date: new Date("2025-09-20"),
    //       status: "APPROVED",
    //       reason: "Personal work",
    //     },

    //     // Employee 2 leaves
    //     {
    //       employeeId: 'E0925003',
    //       leaveType: "FULLDAY",
    //       date: new Date("2025-09-07"),
    //       status: "DECLINED",
    //       reason: "Sick leave",
    //     },
    //     {
    //       employeeId: 'E0925003',
    //       leaveType: "HALFDAY",
    //       date: new Date("2025-09-09"),
    //       status: "APPROVED",
    //       reason: "Bank visit",
    //     },
    //     {
    //       employeeId: 'E0925003',
    //       leaveType: "HALFDAY",
    //       date: new Date("2025-09-14"),
    //       status: "APPROVED",
    //       reason: "Family errand",
    //     },

    //     // Employee 3 leaves
    //     {
    //       employeeId: 'E0925004',
    //       leaveType: "FULLDAY",
    //       date: new Date("2025-09-11"),
    //       status: "APPROVED",
    //       reason: "Travel",
    //     },
    //     {
    //       employeeId: 'E0925004',
    //       leaveType: "FULLDAY",
    //       date: new Date("2025-09-18"),
    //       status: "APPROVED",
    //       reason: "Emergency",
    //     },
    //     {
    //       employeeId: 'E0925004',
    //       leaveType: "HALFDAY",
    //       date: new Date("2025-09-19"),
    //       status: "APPROVED",
    //       reason: "Office work",
    //     },
    //   ],
    // });

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}


async function main() {
  // // 1. Excel read
  // const workbook = XLSX.readFile("scripts/Salaries-Format-for-Payroll-Management-System.xlsx");
  // const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // // Pehli 6 rows skip karo aur baaki ko JSON banao
  // const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  // // Ab sirf row 7 se row 52 tak lo (0-based indexing -> 6 to 52)
  // const slicedRows = rawRows.slice(5, 53);

  // // Apne custom headers assign karo
  // const headers = [
  //   "SNo",
  //   "Name",
  //   "Designation",
  //   "Location",
  //   "GrossSalary",
  //   "FuelEntitlement",
  //   "FuelAmount",
  //   "Commission",
  //   "OTHours",
  //   "OTAmount",
  //   "SundayCount",
  //   "SundayAmount",
  //   "SundayFuel",
  //   "Leaves",
  //   "HalfDay",
  //   "LeaveDeduction",
  //   "HalfDayDeduction",
  //   "LoanDeduction",
  //   "NetSalary",
  //   "Account"
  // ];

  // // Array of objects me map karo
  // const rows = slicedRows.map(row => {
  //   // console.log(row);
  //   let obj = {};
  //   headers.forEach((key, i) => {
  //     obj[key] = row[i + 1] ?? "";
  //   });
  //   return obj;
  // });

  // console.log(rows[0]);         // clean first row
  // console.log(rows.length);     // should be 47 rows
  // for (const row of rows) {
  //   // 2. Insert department (hardcode ya map se le)
  //   const dept = await prisma.department.findFirst();

  //   // 3. Insert User
  //   const user = await prisma.user.create({
  //     data: {
  //       name: row["Name"],
  //       email: `${row["Name"]?.toLowerCase().replace(" ", ".")}@test.com`,
  //       phoneNo: "000000000",
  //       password: hashPassword("123456"),
  //       dateOfBirth: new Date("1995-01-01"),
  //       cnicNo: Math.floor(Math.random() * 1e13).toString(),
  //       departmentId: dept.id,
  //     },
  //   });

  //   // 4. Insert Employee
  //   const emp = await prisma.employee.create({
  //     data: {
  //       userId: user.id,
  //       designation: row["Designation"],
  //       location: row["Location"],
  //       joiningDate: new Date(),
  //       bankAccount: row["Account"] || "Cash",
  //     },
  //   });

  //   // 5. Insert Salary
  //   await prisma.salary.create({
  //     data: {
  //       employeeId: emp.id,
  //       grossSalary: Number(row["GrossSalary"]) || 0,
  //       fuelEntitlement: Number(row["FuelEntitlement"]) || 0,
  //       fuelAllowance: Number(row["FuelAmount"]) || 0,
  //       medicalAllowance: 0,
  //     },
  //   });
  // }

  // console.log("✅ All employees inserted successfully!");


  // new
  try {
    const departments = [
      { name: "Technical", description: "Handles engineering and support staff" },
      { name: "Marketing", description: "Handles marketing and sales operations" },
      { name: "Accounts & Finance", description: "Responsible for accounts and finance" },
      { name: "Operations/Support", description: "Operations and support staff" },
    ];

    const createdDepartments = [];

    for (const dept of departments) {
      const created = await prisma.department.upsert({
        where: { name: dept.name },
        update: {},
        create: dept,
      });
      createdDepartments.push(created);
    }

    console.log("✅ Departments seeded");

    // 2. Permissions Seed Example
    // Create a dictionary { "Technical": "id123", "Accounts & Finance": "id456" }
    const deptMap = Object.fromEntries(
      createdDepartments.map((d) => [d.name, d.id])
    );

    const permissions = [
      {
        departmentId: deptMap["Technical"],
        model: "Payroll",
        accessScope: "SELF",
        accessLevel: "READ",
      },
      {
        departmentId: deptMap["Technical"],
        model: "Payroll",
        accessScope: "SELF",
        accessLevel: "WRITE",
      },
      {
        departmentId: deptMap["Accounts & Finance"],
        model: "Payroll",
        accessScope: "ALL",
        accessLevel: "READ",
      },
      {
        departmentId: deptMap["Accounts & Finance"],
        model: "Payroll",
        accessScope: "ALL",
        accessLevel: "WRITE",
      },
    ];
    for (const perm of permissions) {
      await prisma.permission.upsert({
        where: {
          departmentId_model_accessScope: {
            departmentId: perm.departmentId,
            model: perm.model,
            accessScope: perm.accessScope,
          },
        },
        update: { accessLevel: perm.accessLevel },
        create: perm,
      });
    }

    console.log("✅ Permissions seeded");

  } catch (error) {
    console.error("Error updating employee IDs:", error);
  }
}
// designation → department name mapping
const designationToDept = {
  "Technical Head": "Technical",
  "Technical Engineer": "Technical",
  "Service Engineer": "Technical",
  "Trainee Engineer": "Technical",
  "Trainee Developer": "Technical",

  "Marketing Manager": "Marketing",
  "Sales And Service Engineer": "Marketing",

  "Accounts Executive": "Accounts & Finance",
  "Office Boy": "Operations/Support",
  "Driver": "Operations/Support",
};

async function assignDepartments() {
  // Step 1: Get all departments
  const departments = await prisma.department.findMany();
  const deptMap = {};
  departments.forEach((dept) => {
    deptMap[dept.name] = dept.id;
  });

  // Step 2: Fetch all employees with designation
  const employees = await prisma.employee.findMany(
    {
      include: { user: true },
    }
  );
  const users = await prisma.user.findMany();

  for (const emp of employees) {
    const deptName = designationToDept[emp.designation?.trim() || ""];

    if (!deptName) {
      console.warn(`⚠️ No department mapping found for designation: ${emp.designation}`);
      continue;
    }

    const deptId = deptMap[deptName];
    if (!deptId) {
      console.warn(`⚠️ Department not found in DB for: ${deptName}`);
      continue;
    }

    // find user id with emp.userId
    const user = users.find(u => u.id === emp.userId);
    if (!user) {
      console.warn(`⚠️ User not found for employee ID: ${emp.id}`);
      continue;
    }
    // Step 3: Update employee with correct deptId
    await prisma.user.update({
      where: { id: user.id },
      data: { departmentId: deptId },
    });

    console.log(`✅ Updated ${user.id} (${emp.designation}) → ${deptName}`);
  }
}

assignDepartments()
  .then(() => {
    console.log('Successfully seeded');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
