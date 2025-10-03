import { axiosService } from "@/lib/base-axios";
import { encodeQueryData } from "@/lib/common";

class ApiService {

  department = {
    get: (query: any = {}) => {
      const q = encodeQueryData(query);
      return axiosService.get<any[]>(`/department?${q}`);
    },
    create: (data: any) => axiosService.post(`/department`, data),
    update: (id: string, data: any) => axiosService.patch(`/department/${id}`, data),
    delete: (id: string) => axiosService.delete(`/department/${id}`),
  };

  client = {
    get: (query: any = {}) => {
      const q = encodeQueryData(query);
      return axiosService.get<any[]>(`/client?${q}`);
    },
    create: (data: any) => axiosService.post(`/client`, data),
    update: (id: string, data: any) => axiosService.patch(`/client/${id}`, data),
    delete: (id: string) => axiosService.delete(`/client/${id}`),
  };

  project = {
    get: (query: any = {}) => {
      const q = encodeQueryData(query);
      return axiosService.get<any[]>(`/project?${q}`);
    },
    create: (data: any) => axiosService.post(`/project`, data),
    update: (id: string, data: any) => axiosService.patch(`/project/${id}`, data),
    delete: (id: string) => axiosService.delete(`/project/${id}`),
  };

  milestone = {
    get: (query: any = {}) => {
      const q = encodeQueryData(query);
      return axiosService.get<any[]>(`/milestone?${q}`);
    },
    create: (data: any) => axiosService.post(`/milestone`, data),
    update: (id: string, data: any) => axiosService.patch(`/milestone/${id}`, data),
    delete: (id: string) => axiosService.delete(`/milestone/${id}`),
  };

  employee = {
    get: () => axiosService.get<any[]>(`/employee`),
    create: (data: any) => axiosService.post(`/employee`, data),
    update: (id: string, data: any) => axiosService.patch(`/employee/${id}`, data),
    delete: (id: string) => axiosService.delete(`/employee/${id}`),
  };

  expense = {
    get: (query: any = {}) => {
      const q = encodeQueryData(query);
      return axiosService.get<any[]>(`/expense?${q}`);
    },
    create: (data: any) => axiosService.post(`/expense`, data),
    update: (id: string, data: any) => axiosService.patch(`/expense/${id}`, data),
    delete: (id: string) => axiosService.delete(`/expense/${id}`),
  };

  payroll = {
    getSummary: (query: { month?: number; year?: number } = {}) => {
      const q = encodeQueryData(query);
      return axiosService.get<any>(`/payroll/summary?${q}`);
    },
    get: (query: { employeeId?: string; month: number; year: number }) => {
      const q = encodeQueryData(query);
      return axiosService.get<any>(`/payroll?${q}`);
    },
    exportCSV: async (query: { month: number; year: number; bankName?: string }) => {
      try {
        const q = encodeQueryData(query);
        const response = await fetch(`/api/payroll/export?${q}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to export CSV');
        }

        // Get the filename from the Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : 'payroll_export.csv';

        // Create a blob from the response
        const blob = await response.blob();
        
        // Create a temporary URL and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        return { success: true, message: "CSV exported successfully" };
      } catch (error: any) {
        console.error('CSV Export error:', error);
        throw error;
      }
    },
    generateSlip: async (data: { employeeId: string; month: number; year: number }) => {
      try {
        console.log('API Service: Starting slip generation for:', data);
        
        const response = await axiosService.post(`/payroll/salary-slip`, data);
        
        console.log('API Service: Received response:', response);
        
        if (response) {
          console.log('API Service: Importing PDF generation function...');
          
          // Import PDF generation function dynamically
          const { generateAndOpenPDF } = await import('@/components/SalarySlipPDF');
          
          console.log('API Service: Generating PDF with data:', response);
          
          // Generate and open the PDF
          await generateAndOpenPDF(response);
          
          console.log('API Service: PDF generated successfully');
          
          return { success: true, data: response, message: "Salary slip generated successfully" };
        } else {
          throw new Error("No data received from API");
        }
      } catch (error: any) {
        console.error('API Service: Generate slip error:', error);
        throw error;
      }
    },
    edit: async (data: { 
      employeeId: string; 
      month: number; 
      year: number; 
      updates: any 
    }) => {
      return await axiosService.put(`/payroll/edit`, data);
    },
  };
}
const apiService = new ApiService();
export default apiService;