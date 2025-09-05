"use client";

import apiService from "@/app/adminspace/data/api";
import {
  AdminityDataTable,
  type FilterConfig,
  type TableActions,
} from "@/components/adminity-data-table";
import { useRequest } from "ahooks";
import { useState } from "react";
import { clientConfig, columns, IProject } from "./dto";
import { IClient } from "../clients/dto";

export default function ProjectPage() {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [clients, setClients] = useState<IClient[]>([]);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");

  useRequest(apiService.client.get, {
    onSuccess: ({ data }) => {
      setClients(data);
    },
  });

  const { data, loading, refresh, runAsync } = useRequest(
    apiService.project.get
  );

  const { runAsync: createClient } = useRequest(apiService.project.create, {
    manual: true,
  });

  const { runAsync: editClient } = useRequest(apiService.project.update, {
    manual: true,
  });

  const { runAsync: deleteClient } = useRequest(apiService.project.delete, {
    manual: true,
  });

  // Define filters
  const filters: FilterConfig[] = [
    {
      key: "name",
      label: "Client Name",
      type: "search",
      placeholder: "Search client...",
    },
  ];

  // Handle form submission
  const handleSubmit = async (formData: any) => {
    if (drawerMode === "create") {
      await createClient(formData);
    } else {
      await editClient(selectedProject!.id, formData);
    }
    refresh();
  };

  // Define actions
  const actions: TableActions<IProject> = {
    onSearch: async (query: string) => {
      await runAsync({ client_name: query });
    },
    isEditable: true,
    can_create: true,
    onDelete: async (id: string) => {
      await deleteClient(id);
      refresh();
    },
    onEdit: (item: IProject) => {
      setSelectedProject(item);
      setDrawerMode("edit");
    },
    onCreate: () => {
      setSelectedProject(null);
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
          clients: clients,
          onCancel: () => {
            setSelectedProject(null);
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
