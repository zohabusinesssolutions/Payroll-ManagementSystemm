const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

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
  { title: 'FUEL_PRICE', value: '200' }
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // await prisma.setting.createMany({ data: SETTING });
    // console.log(`✅ Created Portal Settings`);


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

    // Create 3 users
    const financeUser1 = await prisma.user.upsert({
      where: { email: 'ali.khan@company.com' },
      update: {},
      create: {
        email: 'ali.khan@company.com',
        name: 'Ali Khan',
        phoneNo: '03001234567',
        password: hashPassword('finance123'),
        dateOfBirth: new Date('1992-03-15'),
        maritalStatus: 'MARRIED',
        cnicNo: '42101-1234567-1',
        departmentId: financeDepartment.id,
        emergencyContactDetails: {
          name: 'Sara Khan',
          phone: '03007654321',
          relationship: 'Wife',
        },
      },
    });

    const financeUser2 = await prisma.user.upsert({
      where: { email: 'fatima.shaikh@company.com' },
      update: {},
      create: {
        email: 'fatima.shaikh@company.com',
        name: 'Fatima Shaikh',
        phoneNo: '03121234567',
        password: hashPassword('finance456'),
        dateOfBirth: new Date('1995-07-20'),
        maritalStatus: 'SINGLE',
        cnicNo: '42201-2345678-2',
        departmentId: financeDepartment.id,
        emergencyContactDetails: {
          name: 'Ahmed Shaikh',
          phone: '03121239876',
          relationship: 'Brother',
        },
      },
    });

    const financeUser3 = await prisma.user.upsert({
      where: { email: 'usman.malik@company.com' },
      update: {},
      create: {
        email: 'usman.malik@company.com',
        name: 'Usman Malik',
        phoneNo: '03211234567',
        password: hashPassword('finance789'),
        dateOfBirth: new Date('1988-11-05'),
        maritalStatus: 'MARRIED',
        cnicNo: '42301-3456789-3',
        departmentId: financeDepartment.id,
        emergencyContactDetails: {
          name: 'Ayesha Malik',
          phone: '03217654321',
          relationship: 'Wife',
        },
      },
    });
    console.log(`✅ Created/Updated user: ${financeUser1.name}`);
    console.log(`✅ Created/Updated user: ${financeUser2.name}`);
    console.log(`✅ Created/Updated user: ${financeUser3.name}`);
    // console.log(`✅ Created/Updated user: ${adminUser.name}`);

    // Generate employee ID in format E[Month][Year][Number]
    let joiningDate = new Date();
    let month = String(joiningDate.getMonth() + 1).padStart(2, '0');
    let year = String(joiningDate.getFullYear()).slice(-2);
    let monthYearPrefix = `E${month}${year}`;

    // // Get existing employees count to determine next employee number
    let existingEmployees = await prisma.employee.count();
    // Calculate next employee number
    let nextEmployeeId = 1;
    if (existingEmployees > 0) nextEmployeeId = existingEmployees + 1
    let employeeId = `${monthYearPrefix}${String(nextEmployeeId).padStart(3, '0')}`;

    // // Create Employee record for the admin user
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

    const financeEmployee1 = await prisma.employee.upsert({
      where: { userId: financeUser1.id },
      update: {},
      create: {
        id: employeeId, 
        userId: financeUser1.id,
        joiningDate: new Date('2022-01-15'),
        designation: 'Finance Officer',
      },
    });

    // Generate employee ID in format E[Month][Year][Number]
    joiningDate = new Date();
    month = String(joiningDate.getMonth() + 1).padStart(2, '0');
    year = String(joiningDate.getFullYear()).slice(-2);
    monthYearPrefix = `E${month}${year}`;

    // Get existing employees count to determine next employee number
    existingEmployees = await prisma.employee.count();
    // Calculate next employee number
    nextEmployeeId = 1;
    if (existingEmployees > 0) nextEmployeeId = existingEmployees + 1
    employeeId = `${monthYearPrefix}${String(nextEmployeeId).padStart(3, '0')}`;

    const financeEmployee2 = await prisma.employee.upsert({
      where: { userId: financeUser2.id },
      update: {},
      create: {
        id: employeeId,
        userId: financeUser2.id,
        joiningDate: new Date('2022-05-10'),
        designation: 'Junior Accountant',
      },
    });

    // Generate employee ID in format E[Month][Year][Number]
    joiningDate = new Date();
    month = String(joiningDate.getMonth() + 1).padStart(2, '0');
    year = String(joiningDate.getFullYear()).slice(-2);
    monthYearPrefix = `E${month}${year}`;

    // Get existing employees count to determine next employee number
    existingEmployees = await prisma.employee.count();
    // Calculate next employee number
    nextEmployeeId = 1;
    if (existingEmployees > 0) nextEmployeeId = existingEmployees + 1
    employeeId = `${monthYearPrefix}${String(nextEmployeeId).padStart(3, '0')}`;

    const financeEmployee3 = await prisma.employee.upsert({
      where: { userId: financeUser3.id },
      update: {},
      create: {
        id: employeeId,
        userId: financeUser3.id,
        joiningDate: new Date('2023-02-01'),
        designation: 'Senior Accountant',
      },
    });
    console.log(`✅ Created/Updated employee record for: ${financeUser1.name}`);
    console.log(`✅ Created/Updated employee record for: ${financeUser2.name}`);
    console.log(`✅ Created/Updated employee record for: ${financeUser3.name}`);

    // console.log(`✅ Created/Updated employee record for: ${adminUser.name}`);

    // Create salary record for the admin employee
    // await prisma.salary.upsert({
    //   where: { employeeId: adminEmployee.id },
    //   update: {},
    //   create: {
    //     employeeId: adminEmployee.id,
    //     basicSalary: 100000,
    //     perDaySalary: 3333.33,
    //     fuelAllowance: 10000,
    //     medicalAllowance: 5000,
    //   }
    // });

    const financeSalary1 = await prisma.salary.upsert({
      where: { employeeId: financeEmployee1.id },
      update: {},
      create: {
        employeeId: financeEmployee1.id,
        basicSalary: 80000,
        perDaySalary: 2666.67,
        fuelAllowance: 12,
        medicalAllowance: 4000,
      },
    });

    const financeSalary2 = await prisma.salary.upsert({
      where: { employeeId: financeEmployee2.id },
      update: {},
      create: {
        employeeId: financeEmployee2.id,
        basicSalary: 60000,
        perDaySalary: 2000,
        fuelAllowance: 10,
        medicalAllowance: 3000,
      },
    });

    const financeSalary3 = await prisma.salary.upsert({
      where: { employeeId: financeEmployee3.id },
      update: {},
      create: {
        employeeId: financeEmployee3.id,
        grossSalary: 90000,
        perDaySalary: 3000,
        fuelAllowance: 13,
        medicalAllowance: 4500,
      },
    });
    console.log(`✅ Created salary record for: ${financeSalary1.name}`);
    console.log(`✅ Created salary record for: ${financeSalary2.name}`);
    console.log(`✅ Created salary record for: ${financeSalary3.name}`);
    // console.log(`✅ Created salary record for: ${adminUser.name}`);
    // Create employee leaves record

    const leavesAllowedSetting = await prisma.setting.findUnique({
      where: { title: 'LEAVES_ALLOWED' },
    });
    const leavesAllowed = leavesAllowedSetting ? parseFloat(leavesAllowedSetting.value) : 1.5;

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

    // const financeLeaves1 = await prisma.employeeLeaves.upsert({
    //   where: { employeeId: 'E0925002'},
    //   update: {},
    //   create: {
    //     employeeId: 'E0925002',
    //     leavesAvailable: 1.5,
    //     leavesTaken: 0,
    //     totalLeaves: leavesAllowed,
    //   },
    // });

    // const financeLeaves2 = await prisma.employeeLeaves.upsert({
    //   where: { employeeId: 'E0925003' },
    //   update: {},
    //   create: {
    //     employeeId: 'E0925003',
    //     leavesAvailable: 1.5,
    //     leavesTaken: 0,
    //     totalLeaves: leavesAllowed,
    //   },
    // });

    // const financeLeaves3 = await prisma.employeeLeaves.upsert({
    //   where: { employeeId: 'E0925004' },
    //   update: {},
    //   create: {
    //     employeeId: 'E0925004',
    //     leavesAvailable: 1.5,
    //     leavesTaken: 0,
    //     totalLeaves: leavesAllowed,
    //   },
    // });
    // console.log(`✅ Created employee leaves record for: ${financeLeaves1.name}`);
    // console.log(`✅ Created employee leaves record for: ${financeLeaves2.name}`);
    // console.log(`✅ Created employee leaves record for: ${financeLeaves3.name}`);

    console.log(`✅ Created employee leaves record for: ${adminUser.name}`);

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

seed()
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
