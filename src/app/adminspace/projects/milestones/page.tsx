"use client";

import apiService from "@/app/adminspace/data/api";
import {
  AdminityDataTable,
  type FilterConfig,
  type TableActions,
} from "@/components/adminity-data-table";
import { useRequest } from "ahooks";
import { useState } from "react";
import { IProject } from "../dto";
import { clientConfig, columns, IMilestone } from "./dto";

export default function MilestonePage() {
  const [selectedMilestone, setSelectedMilestone] = useState<IMilestone | null>(null);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");

  useRequest(apiService.project.get, {
    onSuccess: ({ data }) => {
      setProjects(data);
    },
  });

  const { data, loading, refresh, runAsync } = useRequest(
    apiService.milestone.get
  );

  const { runAsync: createMilestone } = useRequest(apiService.milestone.create, {
    manual: true,
  });

  const { runAsync: editMilestone } = useRequest(apiService.milestone.update, {
    manual: true,
  });

  const { runAsync: deleteMilestone } = useRequest(apiService.milestone.delete, {
    manual: true,
  });

  // Define filters
  const filters: FilterConfig[] = [
    {
      key: "name",
      label: "Project",
      type: "select",
      options: projects?.map((e) => {
        return { label: e.name, value: e.id };
      }),
      placeholder:"Filter By Project                                                                               "
    },
  ];

  // Handle form submission
  const handleSubmit = async (formData: any) => {
    if (drawerMode === "create") {
      await createMilestone(formData);
    } else {
      await editMilestone(selectedMilestone!.id, formData);
    }
    refresh();
  };

  // Define actions
  const actions: TableActions<IMilestone> = {
    onSearch: async (query: string) => {
      console.log(query)
      await runAsync({ project_id: query });
    },
    isEditable: true,
    can_create: true,
    onDelete: async (id: string) => {
      await deleteMilestone(id);
      refresh();
    },
    onEdit: (item: IMilestone) => {
      setSelectedMilestone(item);
      setDrawerMode("edit");
    },
    onCreate: () => {
      setSelectedMilestone(null);
      setDrawerMode("create");
    },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Project Management</h1>
        <p className="text-muted-foreground">
          Manage Project and their Details
        </p>
      </div>

      <AdminityDataTable
        data={data?.data || []}
        columns={columns}
        loading={loading}
        filters={filters}
        drawerConfig={clientConfig({
          mode: drawerMode,
          onSubmit: handleSubmit,
          loading: loading,
          projects: projects,
          onCancel: () => {
            setSelectedMilestone(null);
            setDrawerMode("create");
          },
        })}
        actions={actions}
        totalCount={data?.total}
        pageSize={10}
        currentPage={1}
      />
    </div>
  );
}
