import { IDepartment } from "@/app/types/IDepartment";
import { AdminityDrawerConfig } from "@/components/adminity-drawer";
import moment from "moment";
import { z } from "zod";

export const employeeSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phoneNo: z.string().min(10, "Phone number must be at least 10 digits"),
    cnicNo: z.string().min(13, "CNIC must be 13 digits"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    maritalStatus: z.enum(
      ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"],
      {
        errorMap: () => ({ message: "Please select marital status" }),
      }
    ),
    address: z.string().min(10, "Address must be at least 10 characters"),
    department: z.string().min(1, "Department is required"),
    designation: z.string().min(2, "Designation must be at least 2 characters"),
    startDate: z.string().min(1, "Start date is required"),
    resignDate: z.string().optional(),
    basicSalary: z.number().min(1, "Basic salary must be greater than 0"),
    fuelAllowance: z.number().min(0, "Fuel allowance cannot be negative"),
    medicalAllowance: z.number().min(0, "Medical allowance cannot be negative"),
  })
  .refine(
    (data) => {
      if (!data.resignDate) return true;
      const start = moment(data.startDate);
      const resign = moment(data.resignDate);
      return start.isValid() && resign.isValid() && resign.isAfter(start);
    },
    {
      message: "Resign date must be after start date",
      path: ["resignDate"],
    }
  );

export const employeeConfig = ({
  onSubmit,
  loading,
  mode,
  departments,
  onCancel,
}: {
  onSubmit: (data: any) => any;
  loading: boolean;
  departments: IDepartment[];
  mode: "create" | "edit";
  onCancel: () => any;
}): AdminityDrawerConfig => {
  return {
    title: mode === "create" ? "Add Employee" : "Edit Employee",
    description:
      mode === "create"
        ? "Add new employee to the system"
        : "Update employee information",
    width: "3xl",
    side: "right",
    zodSchema: employeeSchema,
    loading: loading, // Use submit loading instead of fetch loading
    groups: [
      {
        title: "Personal Information",
        fields: [
          {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
            placeholder: "Jhon Doe",
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "jhon@example.com",
          },
          {
            name: "phoneNo",
            label: "Phone Number",
            type: "text", // Changed from number to text for better phone handling
            required: true,
            placeholder: "+92 300 1234567",
          },
          {
            name: "cnicNo",
            label: "National ID",
            type: "text", // Changed from number to text for better CNIC handling
            required: true,
            placeholder: "00000-0000000-0",
          },
          {
            name: "dateOfBirth",
            label: "Date of Birth",
            type: "date",
            required: true,
          },
          {
            name: "maritalStatus",
            label: "Marital Status",
            type: "select",
            required: true,
            placeholder: "Select marital status",
            options: [
              { label: "Single", value: "SINGLE" },
              { label: "Married", value: "MARRIED" },
              { label: "Divorced", value: "DIVORCED" },
              { label: "Widowed", value: "WIDOWED" },
              { label: "Separated", value: "SEPARATED" },
            ],
          },
          {
            name: "address",
            label: "Address",
            type: "textarea",
            required: true,
            placeholder: "Central Park, New York, NY 10001",
          },
        ],
      },
      {
        title: "Employment Details",
        fields: [
          {
            name: "department",
            label: "Department",
            type: "select",
            required: true,
            placeholder: "Select department",
            options: departments.map((dept) => ({
              label: dept.name,
              value: dept.id,
            })),
          },
          {
            name: "designation",
            label: "Designation",
            type: "text",
            required: true,
            placeholder: "Eg. Software Engineer",
          },
          {
            name: "startDate",
            label: "Joining Date",
            type: "date",
            required: true,
          },
          {
            name: "resignDate",
            label: "Resignation Date",
            type: "date",
            required: false, // Made optional
          },
        ],
      },
      {
        title: "Salary Details",
        fields: [
          {
            name: "basicSalary",
            label: "Basic Salary",
            type: "number",
            className: "w-full",
            required: true,
            placeholder: "60000",
          },
          {
            name: "fuelAllowance",
            label: "Fuel Allowance",
            type: "number",
            required: false, // Made optional
            defaultValue: 0,
          },
          {
            name: "medicalAllowance",
            label: "Medical Allowance",
            type: "number",
            required: false,
            defaultValue: 0,
          },
        ],
      },
    ],
    onSubmit: onSubmit,
    onCancel: onCancel,
  };
};
