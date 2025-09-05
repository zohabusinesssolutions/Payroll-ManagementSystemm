import type { AdminityDrawerConfig } from "@/components/adminity-drawer";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IEmployee } from "@/app/types/IEmployee";
import moment from "moment";

// Create a more strict schema that requires permissions
export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  clientId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum([
    "STARTED",
    "INPROGRESS",
    "COMPLETED",
    "INVOICED",
    "RELEASED",
    "CANCELLED",
  ]),
});

const statuses = [
  { label: "STARTED", value: "STARTED" },
  { label: "INPROGRESS", value: "INPROGRESS" },
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "INVOICED", value: "INVOICED" },
  { label: "RELEASED", value: "RELEASED" },
  { label: "CANCELLED", value: "CANCELLED" },
];

export const clientConfig = ({
  onSubmit,
  loading,
  mode,
  onCancel,
}: {
  onSubmit: (data: any) => any;
  loading: boolean;
  mode: "create" | "edit";
  onCancel: () => any;
}): AdminityDrawerConfig => {
  return {
    title: mode === "create" ? "Add Project" : "Project",
    description:
      mode === "create" ? "Add a new project" : "Update project details",
    width: "3xl",
    side: "right",
    zodSchema: projectSchema,
    loading,
    // Provide default values so form doesn't start empty
    defaultValues: {
      name: "",
      amount: "",
      currency: "",
      clientId: "",
      status: "",
    },
    fields: [
      {
        name: "name",
        label: "Project Name",
        type: "text",
        className: "w-full",
        required: true,
        placeholder: "Eg. Adminity",
      },
      {
        name: "amount",
        label: "Amount",
        type: "number",
        className: "w-full",
        required: true,
        placeholder: "$1000",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        className: "w-full",
        required: true,
        options: statuses,
      },
    ],
    onSubmit,
    onCancel,
  };
};

export enum ProjectStatus {
  STARTED = "STARTED",
  INPROGRESS = "INPROGRESS",
  COMPLETED = "COMPLETED",
  INVOICED = "INVOICED",
  RELEASED = "RELEASED",
  CANCELLED = "CANCELLED",
}

export enum LeaveTypeEnum {
  HALFDAY = "HALFDAY",
  FULLDAY = "FULLDAY",
}

export enum LeaveStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface ILeavesRequests {
  id: string;
  employeeId: string;
  leaveType: LeaveTypeEnum;
  date: string; // You may consider converting this to `Date` if needed
  status?: LeaveStatusEnum;
  approvedOn?: Date;
  reason?: string;
  employee: IEmployee;
}
export const columns: ColumnDef<ILeavesRequests>[] = [
  {
    accessorKey: "employee",
    header: "Employee",
    cell: ({ row }) => {
      const employee = row.original.employee;
      return (
        <div className="text-muted-foreground flex flex-col">
          {employee.name}
          <span>{employee.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "leaveType",
    header: "Leave Type",
    cell: ({ row }) => (
      <div className="whitespace-pre-line uppercase">
        <Badge variant="outline">{row.getValue("leaveType")}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {moment(row.getValue("date")).format("DD-MM-YYYY")}
      </div>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div className="text-muted-foreground whitespace-pre-line">
        {row.getValue("reason")}
      </div>
    ),
  },
  {
    accessorKey: "approvedOn",
    header: "Approved On",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("date")
          ? moment(row.getValue("date")).format("DD-MM-YYYY")
          : "Not Approved Yet"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColorMap: Record<LeaveStatusEnum, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
      };
      return (
        <div className="whitespace-pre-line uppercase">
          <Badge
            variant="outline"
            className={
              statusColorMap[row.getValue("status") as LeaveStatusEnum]
            }
          >
            {row.getValue("status")}
          </Badge>
        </div>
      );
    },
  },
];
