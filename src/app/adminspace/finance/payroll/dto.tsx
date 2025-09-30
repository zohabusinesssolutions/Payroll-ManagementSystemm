
import type { AdminityDrawerConfig } from "@/components/adminity-drawer";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";

// Payroll schema
export const PayrollSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  location: z.string().min(1, "Location is required"),
  grossSalary: z.number(),
  fuelEntitlement: z.number().nullable(), // litres, null = unlimited
  fuelRate: z.number(),
  fuelAmount: z.number(),
  commissionAmount: z.number(),
  overtimeHours: z.number(),
  overtimeAmount: z.number(),
  sundayCount: z.number(),
  sundayAmount: z.number(),
  sundayFuel: z.number(),
  leaveCount: z.number(),
  leaveDeduction: z.number(),
  halfDayCount: z.number(),
  halfDayDeduction: z.number(),
  loanDeduction: z.number(),
  netSalary: z.number(),
  account: z.string(),
});

// Drawer config (agar future me add/edit karna ho)
export const payrollConfig = ({
  onSubmit,
  loading,
  mode,
  onCancel,
  defaultValues,
}: {
  onSubmit: (data: any) => any;
  loading: boolean;
  mode: "create" | "edit";
  onCancel: () => any;
  defaultValues?: IPayroll;
}): AdminityDrawerConfig => {
  return {
    title: mode === "create" ? "Add Payroll Entry" : "Edit Payroll Entry",
    description:
      mode === "create"
        ? "Add a new payroll record"
        : "Update payroll record details",
    width: "full",
    side: "right",
    zodSchema: PayrollSchema,
    loading,
    defaultValues: defaultValues || {
      name: "",
      designation: "",
      location: "",
      grossSalary: 0,
      fuelEntitlement: null,
      fuelRate: 0,
      fuelAmount: 0,
      commissionAmount: 0,
      overtimeHours: 0,
      overtimeAmount: 0,
      sundayCount: 0,
      sundayAmount: 0,
      sundayFuel: 0,
      leaveCount: 0,
      halfDayCount: 0,
      leaveDeduction: 0,
      halfDayDeduction: 0,
      loanDeduction: 0,
      netSalary: 0,
      account: "",
    },
    fields: [
      {
        name: "name",
        label: "Employee Name",
        type: "text",
        className: "w-full",
        required: true,
      },
      {
        name: "designation",
        label: "Designation",
        type: "text",
        className: "w-full",
        required: true,
      },
      {
        name: "location",
        label: "Location",
        type: "text",
        className: "w-full",
        required: true,
      },
      {
        name: "grossSalary",
        label: "Gross Salary",
        type: "number",
        className: "w-full",
        required: true,
      },
      {
        name: "fuelEntitlement",
        label: "Fuel Entitlement (L)",
        type: "number",
        className: "w-full",
      },
      {
        name: "fuelAmount",
        label: "Fuel Amount",
        type: "number",
        className: "w-full",
        required: true,
      },
      {
        name: "commissionAmount",
        label: "Commission",
        type: "number",
        className: "w-full",
        defaultValue: 0,
      },
      {
        name: "overtimeHours",
        label: "Overtime Hours",
        type: "number",
        className: "w-full",
        defaultValue: 0,
      },
      {
        name: "sundayCount",
        label: "Sundays",
        type: "number",
        className: "w-full",
        defaultValue: 0,
      },
      {
        name: "sundayFuel",
        label: "Sunday Fuel",
        type: "number",
        className: "w-full",
        defaultValue: 0,
      },
      {
        name: "leaveCount",
        label: "Leave Count",
        type: "number",
        className: "w-full",
        defaultValue: 0,
      },
      {
        name: "halfDayCount",
        label: "Half Day Count",
        type: "number",
        className: "w-full",
        defaultValue: 0,
      },
      {
        name: "loanDeduction",
        label: "Loan Deduction",
        type: "number",
        className: "w-full",
        defaultValue: 0,
      },
      {
        name: "netSalary",
        label: "Net Salary",
        type: "number",
        className: "w-full",
        required: true,
      },
      {
        name: "account",
        label: "Account",
        type: "text",
        className: "w-full",
        required: true,
      },
    ],
    onSubmit,
    onCancel,
  };
};

// Payroll type
export interface IPayroll {
  id: string;
  serial_no?: number; // Optional since it's added in frontend
  name: string;
  designation: string;
  location: string;
  grossSalary: number;
  fuelEntitlement: number | null;
  fuelRate: number;
  fuelAmount: number;
  commissionAmount: number;
  overtimeHours: number;
  overtimeAmount: number;
  sundayCount: number;
  sundayAmount: number;
  sundayFuel: number;
  leaveCount: number;
  halfDayCount: number;
  leaveDeduction: number;
  halfDayDeduction: number;
  loanDeduction: number;
  netSalary: number;
  account: string;
}

// Table columns
export const columns: ColumnDef<IPayroll>[] = [
  { accessorKey: "serial_no", header: "S.no" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "designation", header: "Designation" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "grossSalary", header: "Gross Salary" },
  { accessorKey: "fuelEntitlement", header: "Fuel Entitlement (L)" },
  { accessorKey: "fuelAmount", header: "Fuel Amount" },
  { accessorKey: "commissionAmount", header: "Commission" },
  { accessorKey: "overtimeHours", header: "OT Hours" },
  { accessorKey: "overtimeAmount", header: "OT Amount" },
  { accessorKey: "sundayCount", header: "Sundays" },
  { accessorKey: "sundayAmount", header: "Sunday Amount" },
  { accessorKey: "sundayFuel", header: "Sunday Fuel" },
  { accessorKey: "leaveCount", header: "Leave Count" },
  { accessorKey: "halfDayCount", header: "Half Day Count" },
  { accessorKey: "leaveDeduction", header: "Leave Deduction" },
  { accessorKey: "halfDayDeduction", header: "Half Day Deduction" },
  { accessorKey: "loanDeduction", header: "Loan Deduction" },
  { accessorKey: "netSalary", header: "Net Salary" },
  { accessorKey: "account", header: "Account" },
];
