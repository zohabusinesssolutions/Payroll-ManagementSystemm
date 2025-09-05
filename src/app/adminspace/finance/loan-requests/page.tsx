"use client";

import apiService from "@/app/adminspace/data/api";
import {
  AdminityDataTable,
  type FilterConfig,
  type TableActions,
} from "@/components/adminity-data-table";
import { useRequest } from "ahooks";
import { useState } from "react";
import { clientConfig, columns, type IClient } from "./dto";

export default function ClientPage() {
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");

  const { data, loading, refresh, runAsync } = useRequest(
    apiService.client.get
  );

  const { runAsync: createClient } = useRequest(apiService.client.create, {
    manual: true,
  });

  const { runAsync: editClient } = useRequest(apiService.client.update, {
    manual: true,
  });

  const { runAsync: deleteClient } = useRequest(apiService.client.delete, {
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
      await editClient(selectedClient!.id, formData);
    }
    refresh();
  };

  // Define actions
  const actions: TableActions<IClient> = {
    onSearch: async (query: string) => {
      await runAsync({ name: query });
    },
    isEditable: true,
    can_create: true,
    onDelete: async (id: string) => {
      await deleteClient(id);
      refresh();
    },
    onEdit: (item: IClient) => {
      setSelectedClient(item);
      setDrawerMode("edit");
    },
    onCreate: () => {
      setSelectedClient(null);
      setDrawerMode("create");
    },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Client Management</h1>
        <p className="text-muted-foreground">Manage Client and their Details</p>
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
          onCancel: () => {
            setSelectedClient(null);
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
