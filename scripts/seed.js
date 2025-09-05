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
  { title: 'LEAVES_ALLOWED', value: '1.5' },
  { title: 'API_KEY', value: '0.0' },
  { title: 'FUEL_PRICE', value: '200' }
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    await prisma.setting.createMany({ data: SETTING });
    console.log(`✅ Created Portal Settings`);

    // Create Administrator department with permissions
    const adminDepartment = await prisma.department.upsert({
      where: { name: 'Administrator' },
      update: {},
      create: {
        name: 'Administrator',
        description: 'Administrator department with full system access',
        permissions: {
          create: [
            {
              model: 'Projects',
              accessLevel: 'WRITE',
              accessScope: 'ALL',
            },
            {
              model: 'Finance',
              accessLevel: 'WRITE',
              accessScope: 'ALL',
            },
            {
              model: 'Employee',
              accessLevel: 'WRITE',
              accessScope: 'ALL',
            },
            {
              model: 'Clients',
              accessLevel: 'WRITE',
              accessScope: 'ALL',
            },
            {
              model: 'Analytics',
              accessLevel: 'WRITE',
              accessScope: 'ALL',
            },
            {
              model: 'Salary',
              accessLevel: 'WRITE',
              accessScope: 'ALL',
            },
          ],
        },
      },
    });

    console.log(`✅ Created/Updated department: ${adminDepartment.name}`);


    // Create Admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'contact.syedjawad@gmail.com' },
      update: {},
      create: {
        email: 'contact.syedjawad@gmail.com',
        name: 'Syed Jawad',
        phoneNo: '1234567890',
        password: hashPassword('123456'),
        dateOfBirth: new Date('1990-01-01'),
        maritalStatus: 'SINGLE',
        cnicNo: '12345-6789012-3',
        departmentId: adminDepartment.id,
        emergencyContactDetails: {
          name: 'Emergency Contact',
          phone: '0987654321',
          relationship: 'Family'
        }
      }
    });

    console.log(`✅ Created/Updated user: ${adminUser.name}`);

    // Generate employee ID in format E[Month][Year][Number]
    const joiningDate = new Date();
    const month = String(joiningDate.getMonth() + 1).padStart(2, '0');
    const year = String(joiningDate.getFullYear()).slice(-2);
    const monthYearPrefix = `E${month}${year}`;

    // Get existing employees count to determine next employee number
    const existingEmployees = await prisma.employee.count();
    // Calculate next employee number
    let nextEmployeeId = 1;
    if (existingEmployees.length > 0) nextEmployeeId = lastNumber + 1
    const employeeId = `${monthYearPrefix}${String(nextEmployeeId).padStart(3, '0')}`;

    // Create Employee record for the admin user
    const adminEmployee = await prisma.employee.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        id: employeeId,
        userId: adminUser.id,
        joiningDate: joiningDate,
        designation: 'System Administrator',
      }
    });

    console.log(`✅ Created/Updated employee record for: ${adminUser.name}`);

    // Create salary record for the admin employee
    await prisma.salary.upsert({
      where: { employeeId: adminEmployee.id },
      update: {},
      create: {
        employeeId: adminEmployee.id,
        basicSalary: 100000,
        perDaySalary: 3333.33,
        fuelAllowance: 10000,
        medicalAllowance: 5000,
      }
    });

    console.log(`✅ Created salary record for: ${adminUser.name}`);

    // Create employee leaves record
    await prisma.employeeLeaves.upsert({
      where: { employeeId: adminEmployee.id },
      update: {},
      create: {
        employeeId: adminEmployee.id,
        leavesAvailable: 1.5,
        leavesTaken: 0,
        totalLeaves: 1.5,
      }
    });

    console.log(`✅ Created employee leaves record for: ${adminUser.name}`);
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