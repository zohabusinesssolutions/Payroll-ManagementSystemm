import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculatePayroll } from "@/lib/payroll";
import { calculateRawPayroll } from "@/lib/raw-payroll";
import { upsertPayrollAdjustments, PayrollAdjustmentData } from "@/lib/payroll-adjustments";

interface EditPayrollRequest {
  employeeId: string;
  month: number;
  year: number;
  updates: {
    // Simple fields (update directly in tables)
    name?: string;
    designation?: string;
    location?: string;
    grossSalary?: number;
    fuelEntitlement?: number;
    fuelAmount?: number;
    account?: string;
    
    // Bank account fields
    modeOfPayment?: "Cash" | "Online";
    bankName?: string;
    accountTitle?: string;
    accountNo?: string;
    branchCode?: string;
    
    // Derived fields (store differences in PayrollAdjustments)
    overtimeHours?: number;
    overtimeAmount?: number;
    sundayCount?: number;
    sundayAmount?: number;
    sundayFuel?: number;
    leaveCount?: number;
    leaveDeduction?: number;
    halfDayCount?: number;
    halfDayDeduction?: number;
    commissionAmount?: number;
    loanDeduction?: number;
  };
}

export async function PUT(request: NextRequest) {
  try {
    const body: EditPayrollRequest = await request.json();
    const { employeeId, month, year, updates } = body;

    // Validate required fields
    if (!employeeId || !month || !year || !updates) {
      return NextResponse.json(
        { error: "Missing required fields: employeeId, month, year, updates" },
        { status: 400 }
      );
    }

    // Validate month and year
    if (month < 1 || month > 12) {
      return NextResponse.json(
        { error: "Invalid month. Must be between 1 and 12." },
        { status: 400 }
      );
    }

    if (year < 2000 || year > 9999) {
      return NextResponse.json(
        { error: "Invalid year. Must be between 2000 and 9999." },
        { status: 400 }
      );
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        user: true,
        salary: true,
        bankAccount: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Get current calculated values to compute deltas for derived fields
    const currentCalculation = await calculateRawPayroll(employeeId, month, year);
    if (!currentCalculation) {
      return NextResponse.json(
        { error: "Could not calculate current payroll values" },
        { status: 500 }
      );
    }

      // Separate simple fields from derived fields and bank account fields
      const simpleFields = {
        name: updates.name,
        designation: updates.designation,
        location: updates.location,
        grossSalary: updates.grossSalary,
        fuelEntitlement: updates.fuelEntitlement,
        fuelAmount: updates.fuelAmount,
      };

      const bankAccountFields = {
        modeOfPayment: updates.modeOfPayment,
        bankName: updates.bankName,
        accountTitle: updates.accountTitle,
        accountNo: updates.accountNo,
        branchCode: updates.branchCode,
      };

      const derivedFields = {
        overtimeHours: updates.overtimeHours,
        overtimeAmount: updates.overtimeAmount,
        sundayCount: updates.sundayCount,
        sundayAmount: updates.sundayAmount,
        sundayFuel: updates.sundayFuel,
        leaveCount: updates.leaveCount,
        leaveDeduction: updates.leaveDeduction,
        halfDayCount: updates.halfDayCount,
        halfDayDeduction: updates.halfDayDeduction,
        commissionAmount: updates.commissionAmount,
        loanDeduction: updates.loanDeduction,
      };    // Perform updates in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Handle simple fields - update respective tables
      const updatePromises: Promise<any>[] = [];

      // Update User.name
      if (simpleFields.name !== undefined) {
        updatePromises.push(
          tx.user.update({
            where: { id: employee.userId },
            data: { name: simpleFields.name },
          })
        );
      }

      // Update Employee fields
      const employeeUpdates: any = {};
      if (simpleFields.designation !== undefined) {
        employeeUpdates.designation = simpleFields.designation;
      }
      if (simpleFields.location !== undefined) {
        employeeUpdates.location = simpleFields.location;
      }
      
      if (Object.keys(employeeUpdates).length > 0) {
        updatePromises.push(
          tx.employee.update({
            where: { id: employeeId },
            data: employeeUpdates,
          })
        );
      }

      // Update Salary fields
      const salaryUpdates: any = {};
      if (simpleFields.grossSalary !== undefined) {
        salaryUpdates.grossSalary = simpleFields.grossSalary;
      }
      if (simpleFields.fuelEntitlement !== undefined) {
        salaryUpdates.fuelEntitlement = simpleFields.fuelEntitlement;
      }
      if (simpleFields.fuelAmount !== undefined) {
        salaryUpdates.fuelAllowance = simpleFields.fuelAmount;
      }

      if (Object.keys(salaryUpdates).length > 0 && (employee as any).salary) {
        updatePromises.push(
          tx.salary.update({
            where: { id: (employee as any).salary.id },
            data: salaryUpdates,
          })
        );
      }

      // Handle bank account operations based on mode of payment
      if (bankAccountFields.modeOfPayment !== undefined) {
        const currentBankAccount = employee.bankAccount;
        
        if (bankAccountFields.modeOfPayment === "Cash") {
          // If switching to Cash mode, delete bank account if it exists
          if (currentBankAccount) {
            updatePromises.push(
              tx.bankAccount.delete({
                where: { employeeId: employeeId },
              })
            );
          }
        } else if (bankAccountFields.modeOfPayment === "Online") {
          // Validate required bank account fields for Online mode
          if (!bankAccountFields.bankName || !bankAccountFields.accountTitle || !bankAccountFields.accountNo || !bankAccountFields.branchCode) {
            throw new Error("Bank Name, Account Title, Account Number, and Branch Code are required for Online payment mode");
          }

          const bankAccountData = {
            bankName: bankAccountFields.bankName,
            accountTitle: bankAccountFields.accountTitle,
            accountNo: bankAccountFields.accountNo,
            branchCode: bankAccountFields.branchCode,
          };

          if (currentBankAccount) {
            // Update existing bank account
            updatePromises.push(
              tx.bankAccount.update({
                where: { employeeId: employeeId },
                data: bankAccountData,
              })
            );
          } else {
            // Create new bank account
            updatePromises.push(
              tx.bankAccount.create({
                data: {
                  employeeId: employeeId,
                  ...bankAccountData,
                },
              })
            );
          }
        }
      }

      // Wait for simple field updates to complete
      await Promise.all(updatePromises);

      // Handle derived fields - calculate deltas and store in PayrollAdjustments
      const adjustments: PayrollAdjustmentData = {};

      // Calculate deltas for each derived field that was provided
      if (derivedFields.overtimeHours !== undefined) {
        adjustments.overtimeHours = derivedFields.overtimeHours - currentCalculation.overtimeHours;
      }
      if (derivedFields.overtimeAmount !== undefined) {
        adjustments.overtimeAmount = derivedFields.overtimeAmount - currentCalculation.overtimeAmount;
      }
      if (derivedFields.sundayCount !== undefined) {
        adjustments.sundayCount = derivedFields.sundayCount - currentCalculation.sundayCount;
      }
      if (derivedFields.sundayAmount !== undefined) {
        adjustments.sundayAmount = derivedFields.sundayAmount - currentCalculation.sundayAmount;
      }
      if (derivedFields.sundayFuel !== undefined) {
        adjustments.sundayFuel = derivedFields.sundayFuel - currentCalculation.sundayFuel;
      }
      if (derivedFields.leaveCount !== undefined) {
        adjustments.leaveCount = derivedFields.leaveCount - currentCalculation.leaveCount;
      }
      if (derivedFields.leaveDeduction !== undefined) {
        adjustments.leaveDeduction = derivedFields.leaveDeduction - currentCalculation.leaveDeduction;
      }
      if (derivedFields.halfDayCount !== undefined) {
        adjustments.halfDayCount = derivedFields.halfDayCount - currentCalculation.halfDayCount;
      }
      if (derivedFields.halfDayDeduction !== undefined) {
        adjustments.halfDayDeduction = derivedFields.halfDayDeduction - currentCalculation.halfDayDeduction;
      }
      if (derivedFields.commissionAmount !== undefined) {
        adjustments.commissionAmount = derivedFields.commissionAmount - currentCalculation.commissionAmount;
      }
      if (derivedFields.loanDeduction !== undefined) {
        adjustments.loanDeduction = derivedFields.loanDeduction - currentCalculation.loanDeduction;
      }

      return { success: true, adjustments };
    });

    // If we have any adjustments, upsert them outside the transaction
    if (result.adjustments && Object.keys(result.adjustments).length > 0) {
      await upsertPayrollAdjustments(employeeId, month, year, result.adjustments);
    }

    // Return the updated payroll calculation
    const updatedCalculation = await calculatePayroll(employeeId, month, year);

    return NextResponse.json({
      message: "Payroll updated successfully",
      data: updatedCalculation,
    });

  } catch (error) {
    console.error("Error updating payroll:", error);
    return NextResponse.json(
      { error: "Internal server error while updating payroll" },
      { status: 500 }
    );
  }
}