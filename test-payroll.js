// Simple test script to validate payroll calculation
import { calculateAllPayroll } from './src/lib/payroll.js';

async function testPayrollCalculation() {
  try {
    console.log('Testing payroll calculation...');
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const payrollData = await calculateAllPayroll(currentMonth, currentYear);
    console.log(`Calculated payroll for ${payrollData.length} employees`);
    
    if (payrollData.length > 0) {
      console.log('Sample payroll data:', JSON.stringify(payrollData[0], null, 2));
    }
  } catch (error) {
    console.error('Error testing payroll calculation:', error);
  }
}

testPayrollCalculation();