"use client";

import apiService from "@/app/adminspace/data/api";
import {
  AdminityDataTable,
  type FilterConfig,
  type TableActions,
} from "@/components/adminity-data-table";
import { useRequest } from "ahooks";
import { clientConfig, columns, ILeavesRequests } from "./dto";

export default function ProjectPage() {
  const { data, loading, refresh, runAsync } = useRequest(
    apiService.project.get
  );


  const { runAsync: editClient } = useRequest(apiService.project.update, {
    manual: true,
  });

  // Define filters
  const filters: FilterConfig[] = [
    {
      key: "name",
      label: "Employee Name",
      type: "search",
      placeholder: "Search by employee...",
    },
  ];
  // Define actions
  const actions: TableActions<ILeavesRequests> = {
    onSearch: async (query: string) => {
      await runAsync({ client_name: query });
    },
    isEditable: false,
    can_create: false,
    onDelete: async () => {},
    onEdit: () => {},
    onCreate: () => {},
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leave Requests</h1>
        <p className="text-muted-foreground">Manage Employee Leaves</p>
      </div>

      <AdminityDataTable
        data={[]}
        columns={columns}
        loading={loading}
        filters={filters}
        drawerConfig={clientConfig({
          mode: "create",
          onSubmit: () => {},
          loading: loading,
          onCancel: () => {},
        })}
        actions={actions}
        totalCount={data?.total}
        pageSize={10}
        currentPage={1}
      />
    </div>
  );
}
