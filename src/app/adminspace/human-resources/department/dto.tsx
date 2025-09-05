import type { AdminityDrawerConfig } from "@/components/adminity-drawer"
import { z } from "zod"
import type { ColumnDef } from "@tanstack/react-table"

// Create a more strict schema that requires permissions
export const departmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isSuperAdmin: z.boolean().optional().default(false),
  permissions: z
    .object({
      FINANCE: z.object({
        accessScope: z.enum(["SELF", "ALL"], {
          errorMap: () => ({ message: "Please select access scope for Finance" }),
        }),
        accessLevel: z.enum(["READ", "WRITE"], {
          errorMap: () => ({ message: "Please select access level for Finance" }),
        }),
      }),
      HUMAN_RESOURCE: z.object({
        accessScope: z.enum(["SELF", "ALL"], {
          errorMap: () => ({ message: "Please select access scope for Human Resource" }),
        }),
        accessLevel: z.enum(["READ", "WRITE"], {
          errorMap: () => ({ message: "Please select access level for Human Resource" }),
        }),
      }),
      PROJECT: z.object({
        accessScope: z.enum(["SELF", "ALL"], {
          errorMap: () => ({ message: "Please select access scope for Project" }),
        }),
        accessLevel: z.enum(["READ", "WRITE"], {
          errorMap: () => ({ message: "Please select access level for Project" }),
        }),
      }),
      CLIENT: z.object({
        accessScope: z.enum(["SELF", "ALL"], {
          errorMap: () => ({ message: "Please select access scope for Client" }),
        }),
        accessLevel: z.enum(["READ", "WRITE"], {
          errorMap: () => ({ message: "Please select access level for Client" }),
        }),
      }),
      ANALYTICS: z.object({
        accessScope: z.enum(["SELF", "ALL"], {
          errorMap: () => ({ message: "Please select access scope for Analytics" }),
        }),
        accessLevel: z.enum(["READ", "WRITE"], {
          errorMap: () => ({ message: "Please select access level for Analytics" }),
        }),
      }),
    })
    .refine(
      (permissions) => {
        // Check if at least one permission module is properly configured
        const modules = Object.values(permissions)
        return modules.some((module) => module && module.accessScope && module.accessLevel)
      },
      {
        message: "At least one permission module must be configured",
      },
    ),
})

export const departmentConfig = ({
  onSubmit,
  loading,
  mode,
  onCancel,
}: {
  onSubmit: (data: any) => any
  loading: boolean
  mode: "create" | "edit"
  onCancel: () => any
}): AdminityDrawerConfig => {
  const MODELS = [
    { label: "Finance", value: "FINANCE" },
    { label: "Human Resource", value: "HUMAN_RESOURCE" },
    { label: "Project", value: "PROJECT" },
    { label: "Client", value: "CLIENT" },
    { label: "Analytics", value: "ANALYTICS" },
  ]

  return {
    title: mode === "create" ? "Add Department" : "Edit Department",
    description:
      mode === "create"
        ? "Add a new department and set access permissions"
        : "Update department details and access controls",
    width: "3xl",
    side: "right",
    zodSchema: departmentSchema,
    loading,
    // Provide default values so form doesn't start empty
    defaultValues: {
      name: "",
      description: "",
      isSuperAdmin: false,
      permissions: {
        FINANCE: { accessScope: "", accessLevel: "" },
        HUMAN_RESOURCE: { accessScope: "", accessLevel: "" },
        PROJECT: { accessScope: "", accessLevel: "" },
        CLIENT: { accessScope: "", accessLevel: "" },
        ANALYTICS: { accessScope: "", accessLevel: "" },
      },
    },
    groups: [
      {
        title: "Department Info",
        fields: [
          {
            name: "name",
            label: "Department Name",
            type: "text",
            className: "w-full",
            required: true,
            placeholder: "e.g. Finance",
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            required: true,
            placeholder: "Brief summary of the department",
          },
          {
            name: "isSuperAdmin",
            label: "Is Super Admin?",
            type: "checkbox",
            required: false,
            defaultValue: false,
          },
        ],
      },
      {
        title: "Permissions",
        description: "Configure access permissions for each module. All fields are required.",
        fields: MODELS.flatMap(({ label, value }) => [
          {
            name: `permissions.${value}.accessScope`,
            label: `${label} Access Scope`,
            type: "radio",
            required: true,
            options: [
              { label: "Self", value: "SELF" },
              { label: "All", value: "ALL" },
            ],
          },
          {
            name: `permissions.${value}.accessLevel`,
            label: `${label} Access Level`,
            type: "radio",
            required: true,
            options: [
              { label: "Read", value: "READ" },
              { label: "Write", value: "WRITE" },
            ],
          },
        ]),
      },
    ],
    onSubmit,
    onCancel,
  }
}

// Department data type
export interface IDepartment {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  _count: {
    users: number
  }
}

export const columns: ColumnDef<IDepartment>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "_count",
    header: "Members",
    cell: ({ row }) => {
      const user = row.original._count.users
      return <div className="text-muted-foreground">{user}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
    ),
  },
]
