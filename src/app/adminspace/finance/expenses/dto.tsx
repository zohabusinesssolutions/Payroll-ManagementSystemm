import type { AdminityDrawerConfig } from "@/components/adminity-drawer";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

// Create a more strict schema that requires permissions

const dateField = z.preprocess((val) => {
  if (typeof val === "string" && val !== "") return new Date(val);
  if (val instanceof Date) return val;
  return undefined;
}, z.date().optional());

export const expenseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(1),
  month: z.string(),
  paidOn: dateField,
  description: z.string().optional(),
});

export const Config = ({
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
    title: mode === "create" ? "Add Expense" : "Expense",
    description:
      mode === "create" ? "Add a new expense" : "Update expense details",
    width: "3xl",
    side: "right",
    zodSchema: expenseSchema,
    loading,
    // Provide default values so form doesn't start empty
    defaultValues: {
      name: "",
      country: "",
      email: "",
      phoneNo: "",
      billingAddress: "",
    },
    fields: [
      {
        name: "name",
        label: "Client Name",
        type: "text",
        className: "w-full",
        required: true,
        placeholder: "Jhon Doe",
      },
      {
        name: "amount",
        label: "Amount",
        type: "number",
        className: "w-full",
        required: true,
      },
      {
        name: "phoneNo",
        label: "Phone Number",
        type: "text",
        className: "w-full",
        required: true,
        placeholder: "+92-000-0000",
      },
      {
        name: "month",
        label: "Month",
        type: "text",
        className: "w-full",
        required: true,
      },
      {
        name: "paidOn",
        label: "Paid On",
        type: "date",
        className: "w-full",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
      },
    ],
    onSubmit,
    onCancel,
  };
};

// Department data type
export interface IExpense {
  id: string;
  name: string;
  amount: number;
  month: string;
  paidOn: Date;
  description?: string;
}
export const columns: ColumnDef<IExpense>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("amount")}</div>
    ),
  },
  {
    accessorKey: "month",
    header: "Month",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("phomonthneNo")}
      </div>
    ),
  },
  {
    accessorKey: "paidOn",
    header: "Paid On",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("startDate")
          ? moment(row.getValue("paidOn")).format("DD-MM-YYYY")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-muted-foreground whitespace-pre-line">
        {row.getValue("description")}
      </div>
    ),
  },
];
