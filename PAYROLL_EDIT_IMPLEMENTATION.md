# Payroll Admin Edit Functionality - Implementation Guide

## Overview

This implementation provides comprehensive admin edit functionality for payroll data with two distinct approaches for different types of fields:

1. **Simple Fields**: Updated directly in their respective database tables
2. **Derived Fields**: Store only the difference (delta) in the PayrollAdjustments table

## Architecture

### Database Schema Changes

#### PayrollAdjustments Model
```prisma
model PayrollAdjustments {
  id         String   @id @default(cuid())
  employeeId String
  month      Int
  year       Int
  adjustments Json    // stores delta values as JSON
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  employee   Employee @relation("EmployeePayrollAdjustments", fields: [employeeId], references: [id], onDelete: Cascade)

  @@unique([employeeId, month, year])
  @@map("payroll_adjustments")
}
```

#### Employee Model Update
Added relationship to PayrollAdjustments:
```prisma
payrollAdjustments PayrollAdjustments[] @relation("EmployeePayrollAdjustments")
```

## Field Classification

### Simple Fields (Direct Table Updates)

| Field | Target Table | Target Column |
|-------|-------------|---------------|
| name | User | name |
| designation | Employee | designation |
| location | Employee | location |
| grossSalary | Salary | grossSalary |
| fuelEntitlement | Salary | fuelEntitlement |
| fuelAmount | Salary | fuelAllowance |
| account | Employee | bankAccount |

### Derived Fields (Adjustment Deltas)

| Field | Description |
|-------|-------------|
| overtimeHours | Overtime hours worked |
| overtimeAmount | Overtime payment amount |
| sundayCount | Number of Sundays worked |
| sundayAmount | Sunday work payment |
| sundayFuel | Sunday fuel allowance |
| leaveCount | Number of leave days |
| leaveDeduction | Amount deducted for leaves |
| halfDayCount | Number of half days |
| halfDayDeduction | Amount deducted for half days |
| commissionAmount | Commission or additional payments |
| loanDeduction | Loan deductions |

## API Endpoints

### 1. Edit Payroll Data
**Endpoint**: `PUT /api/payroll/edit`

**Request Body**:
```json
{
  "employeeId": "string",
  "month": 1-12,
  "year": 2000-9999,
  "updates": {
    // Simple fields (optional)
    "name": "string",
    "designation": "string",
    "location": "string",
    "grossSalary": number,
    "fuelEntitlement": number,
    "fuelAmount": number,
    "account": "string",
    
    // Derived fields (optional)
    "overtimeHours": number,
    "overtimeAmount": number,
    "sundayCount": number,
    "sundayAmount": number,
    "sundayFuel": number,
    "leaveCount": number,
    "leaveDeduction": number,
    "halfDayCount": number,
    "halfDayDeduction": number,
    "commissionAmount": number,
    "loanDeduction": number
  }
}
```

**Response**:
```json
{
  "message": "Payroll updated successfully",
  "data": {
    // Updated payroll calculation with adjustments applied
  }
}
```

### 2. Payroll Summary (Enhanced)
**Endpoint**: `GET /api/payroll/summary?month=1&year=2024`

Returns payroll data with adjustments merged into the calculations.

### 3. Salary Slip Generation
**Endpoint**: `POST /api/payroll/salary-slip`

**Request Body**:
```json
{
  "employeeId": "string",
  "month": 1-12,
  "year": 2000-9999,
  "bonus": number (optional),
  "bonusType": "RAMADAN" | "PERFORMANCE" (optional)
}
```

Generates salary slips using the final merged values (base calculations + adjustments).

**Endpoint**: `GET /api/payroll/salary-slip?employeeId=123&month=1&year=2024`

Retrieves existing salary slip or lists all salary slips.

## Implementation Details

### Core Library Files

#### 1. `/src/lib/payroll-adjustments.ts`
- `getPayrollAdjustments()`: Fetch adjustments for an employee/month/year
- `upsertPayrollAdjustments()`: Save/update adjustment deltas
- `applyPayrollAdjustments()`: Apply adjustments to base values

#### 2. `/src/lib/raw-payroll.ts`
- `calculateRawPayroll()`: Calculate payroll without any adjustments
- Used for computing deltas when admin makes edits

#### 3. `/src/lib/payroll.ts` (Enhanced)
- `calculatePayroll()`: Enhanced to merge base calculations with adjustments
- Returns final values that include both calculated and adjusted amounts

## Data Flow

### Admin Edit Process
1. Admin submits edit request via API
2. System categorizes fields into simple vs derived
3. Simple fields → Direct table updates
4. Derived fields → Calculate delta from raw values
5. Store deltas in PayrollAdjustments JSON
6. Return updated payroll calculation

### Payroll Summary Process
1. Calculate raw payroll values from attendance/leaves/salary data
2. Fetch adjustments from PayrollAdjustments table
3. Apply adjustments to raw values
4. Return merged final values

### Salary Slip Generation
1. Get final payroll calculation (with adjustments)
2. Add any bonus amounts
3. Create/update SalarySlip record with frozen snapshot
4. Return salary slip data

## Example Scenarios

### Scenario 1: Admin Edits Overtime Hours
- System calculates raw overtime = 2 hours
- Admin changes to 5 hours
- Delta stored: `{ "overtimeHours": 3 }`
- Future calculations: 2 (raw) + 3 (adjustment) = 5 hours

### Scenario 2: Admin Edits Gross Salary
- Direct update to Salary.grossSalary = new value
- No adjustment record needed
- Future calculations use new gross salary

### Scenario 3: Multiple Edits
- Admin changes overtime from 5 to 4 hours
- Existing adjustment: `{ "overtimeHours": 3 }`
- New delta: 4 - 2 (raw) = 2
- Updated adjustment: `{ "overtimeHours": 2 }`

## Error Handling

1. **Validation**: All inputs validated for required fields and ranges
2. **Employee Existence**: Verify employee exists before processing
3. **Calculation Errors**: Graceful handling if payroll calculation fails
4. **Database Errors**: Transaction rollback for failed operations
5. **Prisma Client Issues**: Fallback to raw SQL queries where needed

## Database Queries Used

Due to Prisma client generation issues, raw SQL queries are used for PayrollAdjustments:

```sql
-- Fetch adjustments
SELECT adjustments FROM payroll_adjustments 
WHERE "employeeId" = $1 AND month = $2 AND year = $3

-- Upsert adjustments
INSERT INTO payroll_adjustments ("id", "employeeId", month, year, adjustments, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
ON CONFLICT ("employeeId", month, year)
DO UPDATE SET adjustments = $4, "updatedAt" = NOW()
```

## Benefits

1. **Data Integrity**: Simple fields remain in proper normalized tables
2. **Flexibility**: Derived fields can be adjusted without losing raw calculations
3. **Audit Trail**: All adjustments are tracked with timestamps
4. **Performance**: Efficient delta storage instead of full value overrides
5. **Reversibility**: Easy to remove adjustments and return to calculated values

## Future Enhancements

1. **Adjustment History**: Track who made changes and when
2. **Approval Workflow**: Require manager approval for certain adjustments
3. **Bulk Edits**: Support editing multiple employees at once
4. **Adjustment Categories**: Categorize adjustments by reason/type
5. **Reporting**: Generate reports on adjustments made