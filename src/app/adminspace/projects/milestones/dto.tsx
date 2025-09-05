import type { AdminityDrawerConfig } from "@/components/adminity-drawer";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { IProject } from "../dto";
import moment from "moment";

// Create a more strict schema that requires permissions
const dateField = z
  .preprocess((val) => {
    if (typeof val === "string" && val !== "") return new Date(val);
    if (val instanceof Date) return val;
    return undefined;
  }, z.date().optional());


export const milestoneSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  projectId: z.string(),
  startDate: dateField,
  deadline: dateField,
  endDate: dateField,
  status: z.enum([
    "PLANNED",
    "INPROGRESS",
    "PAUSED",
    "DELAYED",
    "COMPLETED",
    "CANCELLED",
  ]),
});

const statuses = [
  { label: "PLANNED", value: "PLANNED" },
  { label: "INPROGRESS", value: "INPROGRESS" },
  { label: "PAUSED", value: "PAUSED" },
  { label: "DELAYED", value: "DELAYED" },
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "CANCELLED", value: "CANCELLED" },
];

export const clientConfig = ({
  onSubmit,
  loading,
  mode,
  projects,
  onCancel,
}: {
  onSubmit: (data: any) => any;
  loading: boolean;
  mode: "create" | "edit";
  projects: IProject[];
  onCancel: () => any;
}): AdminityDrawerConfig => {
  return {
    title: mode === "create" ? "Add Milestone" : "Milestone",
    description:
      mode === "create" ? "Add a new milestone" : "Update milestone details",
    width: "3xl",
    side: "right",
    zodSchema: milestoneSchema,
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
        name: "projectId",
        label: "Project",
        type: "select",
        className: "w-full",
        required: true,
        placeholder: "eg. Adminity",
        options: projects?.map((e) => {
          return { label: e.name, value: e.id };
        }),
      },
      {
        name: "name",
        label: "Milestone Name",
        type: "text",
        className: "w-full",
        required: true,
        placeholder: "Eg. Adminity",
      },
      {
        name: "startDate",
        label: "Starting Date",
        type: "date",
        className: "w-full",
        required: false,
      },
      {
        name: "deadline",
        label: "deadline",
        type: "date",
        className: "w-full",
        required: false,
      },
      {
        name: "endDate",
        label: "Ending Date",
        type: "date",
        className: "w-full",
        required: false,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        className: "w-full",
        required: true,
        options: statuses,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        className: "w-full",
        required: true,
      },
    ],
    onSubmit,
    onCancel,
  };
};

export enum ProjectMilestoneStatus {
  PLANNED = "PLANNED",
  INPROGRESS = "INPROGRESS",
  PAUSED = "PAUSED",
  DELAYED = "DELAYED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface IMilestone {
  id: string;
  projectId: string;
  description: string;
  employeeId: string[];
  name: string;
  startDate?: Date | null;
  endDate?: Date | null;
  deadline?: Date | null;
  status: ProjectMilestoneStatus;
  createdAt: Date;
  updatedAt: Date;
  project: IProject;
}

export const columns: ColumnDef<IMilestone>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => {
      const project = row.original.project;
      return (
        <div className="text-muted-foreground flex flex-col">
          {project.name}
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Starting Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("startDate")
          ? moment(row.getValue("startDate")).format("DD-MM-YYYY")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "deadline",
    header: "Due Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("deadline")
          ? moment(row.getValue("startDate")).format("DD-MM-YYYY")
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Ending Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("endDate")
          ? moment(row.getValue("startDate")).format("DD-MM-YYYY")
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
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColorMap: Record<ProjectMilestoneStatus, string> = {
        PLANNED: "bg-yellow-100 text-yellow-800",
        INPROGRESS: "bg-yellow-100 text-yellow-800",
        PAUSED: "bg-blue-100 text-blue-800",
        DELAYED: "bg-purple-100 text-purple-800",
        COMPLETED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
      };
      return (
        <div className="whitespace-pre-line uppercase">
          <Badge
            variant="outline"
            className={
              statusColorMap[row.getValue("status") as ProjectMilestoneStatus]
            }
          >
            {row.getValue("status")}
          </Badge>
        </div>
      );
    },
  },
];
