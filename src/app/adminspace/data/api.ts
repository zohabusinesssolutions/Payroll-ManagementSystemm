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
  };
}
const apiService = new ApiService();
export default apiService;