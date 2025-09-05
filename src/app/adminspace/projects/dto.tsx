import type { AdminityDrawerConfig } from "@/components/adminity-drawer";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { IClient } from "../clients/dto";
import { Badge } from "@/components/ui/badge";

// Create a more strict schema that requires permissions
export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  clientId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(["STARTED","INPROGRESS", "COMPLETED", "INVOICED", "RELEASED", "CANCELLED"]),
});

const currencies = [
  { label: "PKR", value: "PKR" }, // Pakistani Rupee
  { label: "USD", value: "USD" }, // US Dollar
  { label: "EUR", value: "EUR" }, // Euro
  { label: "GBP", value: "GBP" }, // British Pound
  { label: "AED", value: "AED" }, // UAE Dirham
  { label: "INR", value: "INR" }, // Indian Rupee
  { label: "CAD", value: "CAD" }, // Canadian Dollar
  { label: "AUD", value: "AUD" }, // Australian Dollar
  { label: "JPY", value: "JPY" }, // Japanese Yen
  { label: "CNY", value: "CNY" }, // Chinese Yuan
  { label: "SAR", value: "SAR" }, // Saudi Riyal
  { label: "TRY", value: "TRY" }, // Turkish Lira
  { label: "MYR", value: "MYR" }, // Malaysian Ringgit
  { label: "SGD", value: "SGD" }, // Singapore Dollar
  { label: "THB", value: "THB" }, // Thai Baht
  { label: "NOK", value: "NOK" }, // Norwegian Krone
  { label: "SEK", value: "SEK" }, // Swedish Krona
  { label: "DKK", value: "DKK" }, // Danish Krone
  { label: "ZAR", value: "ZAR" }, // South African Rand
  { label: "CHF", value: "CHF" }, // Swiss Franc
  { label: "HKD", value: "HKD" }, // Hong Kong Dollar
  { label: "NZD", value: "NZD" }, // New Zealand Dollar
  { label: "BRL", value: "BRL" }, // Brazilian Real
  { label: "RUB", value: "RUB" }, // Russian Ruble
  { label: "EGP", value: "EGP" }, // Egyptian Pound
  { label: "KWD", value: "KWD" }, // Kuwaiti Dinar
  { label: "BHD", value: "BHD" }, // Bahraini Dinar
  { label: "QAR", value: "QAR" }, // Qatari Riyal
  { label: "OMR", value: "OMR" }, // Omani Rial
  { label: "LKR", value: "LKR" }, // Sri Lankan Rupee
  { label: "BDT", value: "BDT" }, // Bangladeshi Taka
  { label: "IDR", value: "IDR" }, // Indonesian Rupiah
  { label: "VND", value: "VND" }, // Vietnamese Dong
  { label: "MAD", value: "MAD" }, // Moroccan Dirham
  { label: "ARS", value: "ARS" }, // Argentine Peso
  { label: "MXN", value: "MXN" }, // Mexican Peso
  { label: "KRW", value: "KRW" }, // South Korean Won
  { label: "TWD", value: "TWD" }, // New Taiwan Dollar
];

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
  clients,
  onCancel,
}: {
  onSubmit: (data: any) => any;
  loading: boolean;
  mode: "create" | "edit";
  clients: IClient[];
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
        name: "clientId",
        label: "Client",
        type: "select",
        className: "w-full",
        required: true,
        placeholder: "Jhon Doe",
        options: clients?.map((e) => {
          return { label: e.name, value: e.id };
        }),
      },
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
        name: "currency",
        label: "Currency",
        type: "select",
        className: "w-full",
        required: true,
        options: currencies,
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

export interface IProject {
  id: string;
  name: string;
  amount: number;
  currency: string;
  clientId: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  client: IClient;
}

export const columns: ColumnDef<IProject>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original.client;
      return (
        <div className="text-muted-foreground flex flex-col">
          {client.name}
          <span>{client.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("amount")}</div>
    ),
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("currency")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColorMap: Record<ProjectStatus, string> = {
        STARTED: "bg-yellow-100 text-yellow-800",
        INPROGRESS: "bg-yellow-100 text-yellow-800",
        COMPLETED: "bg-green-100 text-green-800",
        INVOICED: "bg-blue-100 text-blue-800",
        RELEASED: "bg-purple-100 text-purple-800",
        CANCELLED: "bg-red-100 text-red-800",
      };
      return (
        <div className="whitespace-pre-line uppercase">
          <Badge
            variant="outline"
            className={statusColorMap[row.getValue("status") as ProjectStatus]}
          >
            {row.getValue("status")}
          </Badge>
        </div>
      );
    },
  },
];
