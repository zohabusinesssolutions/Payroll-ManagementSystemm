// "use client";

// import apiService from "@/app/adminspace/data/api";
// import {
//   AdminityDataTable,
//   type FilterConfig,
//   type TableActions,
// } from "@/components/adminity-data-table";
// import { useRequest } from "ahooks";
// import { useState } from "react";
// import { clientConfig, columns, type IClient } from "./dto";

// export default function ClientPage() {
//   const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
//   const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");

//   const { data, loading, refresh, runAsync } = useRequest(
//     apiService.client.get
//   );

//   const { runAsync: createClient } = useRequest(apiService.client.create, {
//     manual: true,
//   });

//   const { runAsync: editClient } = useRequest(apiService.client.update, {
//     manual: true,
//   });

//   const { runAsync: deleteClient } = useRequest(apiService.client.delete, {
//     manual: true,
//   });

//   // Define filters
//   const filters: FilterConfig[] = [
//     {
//       key: "name",
//       label: "Client Name",
//       type: "search",
//       placeholder: "Search client...",
//     },
//   ];

//   // Handle form submission
//   const handleSubmit = async (formData: any) => {
//     if (drawerMode === "create") {
//       await createClient(formData);
//     } else {
//       await editClient(selectedClient!.id, formData);
//     }
//     refresh();
//   };

//   // Define actions
//   const actions: TableActions<IClient> = {
//     onSearch: async (query: string) => {
//       await runAsync({ name: query });
//     },
//     isEditable: true,
//     can_create: true,
//     onDelete: async (id: string) => {
//       await deleteClient(id);
//       refresh();
//     },
//     onEdit: (item: IClient) => {
//       setSelectedClient(item);
//       setDrawerMode("edit");
//     },
//     onCreate: () => {
//       setSelectedClient(null);
//       setDrawerMode("create");
//     },
//   };

//   return (
//     <div>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold">Employee Management</h1>
//         <p className="text-muted-foreground">Manage Client and their Details</p>
//       </div>

//       <AdminityDataTable
//         data={data?.data || []}
//         columns={columns}
//         loading={loading}
//         filters={filters}
//         drawerConfig={clientConfig({
//           mode: drawerMode,
//           onSubmit: handleSubmit,
//           loading: loading,
//           onCancel: () => {
//             setSelectedClient(null);
//             setDrawerMode("create");
//           },
//         })}
//         actions={actions}
//         totalCount={data?.total}
//         pageSize={10}
//         currentPage={1}
//       />
//     </div>
//   );
// }
"use client";

import apiService from "@/app/adminspace/data/api";
import {
  AdminityDataTable,
  type FilterConfig,
  type TableActions,
} from "@/components/adminity-data-table";
import { useRequest } from "ahooks";
import { useState } from "react";
import { payrollConfig, columns, type IPayroll } from "./dto";

export default function PayrollPage() {
  const [selectedPayroll, setSelectedPayroll] = useState<IPayroll | null>(null);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get current month and year for default query
  const currentDate = new Date();
  const [selectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear] = useState(currentDate.getFullYear());

  // Use API to fetch payroll data
  const { data, loading, refresh, runAsync } = useRequest(
    () => apiService.payroll.getSummary({ month: selectedMonth, year: selectedYear }),
    {
      refreshDeps: [selectedMonth, selectedYear],
    }
  );

  // Get payroll data from API response
  const payrollData: IPayroll[] = data?.data || [];
  
  // Filter data based on search query
  const filteredData = searchQuery 
    ? payrollData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : payrollData;

  // Filters
  const filters: FilterConfig[] = [
    {
      key: "name",
      label: "Employee Name",
      type: "search",
      placeholder: "Search employee...",
    },
  ];

  // Actions
  const actions: TableActions<IPayroll> = {
    onSearch: async (query: string) => {
      setSearchQuery(query);
    },
    isEditable: true,
    can_create: false, // payroll slips usually not manually created
    onEdit: (item: IPayroll) => {
      setSelectedPayroll(item);
      setDrawerMode("edit");
    },
    onCreate: () => {
      setSelectedPayroll(null);
      setDrawerMode("create");
    },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Payroll Management</h1>
        <p className="text-muted-foreground">
          View and manage employee payroll details
        </p>
      </div>

      <AdminityDataTable
        data={filteredData}
        columns={columns}
        loading={loading}
        filters={filters}
        drawerConfig={payrollConfig({
          mode: drawerMode,
          onSubmit: (formData) => console.log("Submitted:", formData),
          loading: loading,
          onCancel: () => {
            setSelectedPayroll(null);
            setDrawerMode("create");
          },
        })}
        actions={actions}
        totalCount={filteredData.length}
        pageSize={10}
        currentPage={1}
      />
    </div>
  );
}
