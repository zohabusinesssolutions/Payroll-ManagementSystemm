import type { AdminityDrawerConfig } from "@/components/adminity-drawer";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";

// Create a more strict schema that requires permissions
export const ClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  email: z.string().email("Invalid email"),
  phoneNo: z.string().optional(),
  billingAddress: z.string().optional(),
});

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
    title: mode === "create" ? "Add Client" : "Client",
    description:
      mode === "create" ? "Add a new client" : "Update client details",
    width: "3xl",
    side: "right",
    zodSchema: ClientSchema,
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
        name: "email",
        label: "Email",
        type: "email",
        className: "w-full",
        required: true,
        placeholder: "jhon@example.com",
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
        name: "country",
        label: "country",
        type: "text",
        className: "w-full",
        required: true,
        placeholder: "Jhon Doe",
      },
      {
        name: "billingAddress",
        label: "Billing Address",
        type: "textarea",
        required: true,
        placeholder: "Enter client's billing address for invoices",
      },
    ],
    onSubmit,
    onCancel,
  };
};

// Department data type
export interface IClient {
  id: string; // Optional for creation
  name: string;
  country: string;
  email: string;
  phoneNo?: string;
  billTo?: string;
  billingAddress?: string;
}

export const columns: ColumnDef<IClient>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "phoneNo",
    header: "Phone No",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("phoneNo")}</div>
    ),
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("country")}</div>
    ),
  },
  {
    accessorKey: "billingAddress",
    header: "Billing Address",
    cell: ({ row }) => (
      <div className="text-muted-foreground whitespace-pre-line">
        {row.getValue("billingAddress")}
      </div>
    ),
  },
];
