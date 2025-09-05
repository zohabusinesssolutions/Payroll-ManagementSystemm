import { AppConfig } from '@/app/core/config';
import axios, { AxiosInstance } from 'axios';
import { toast } from 'sonner';

class AxiosService {
    private _axios!: AxiosInstance;
    constructor(apiUrl: string) {
        this._axios = axios.create({ baseURL: apiUrl });
        this.setupInterceptor();
    }
    public setupInterceptor() {
        this._axios.interceptors.response.use(
            response => response?.data,
            error => {
                toast.error(error?.response?.data?.message, {
                    duration: 4000,
                    closeButton: true,
                });
                throw error;
            }
        );
    }
    public get<T>(url: string): Promise<T | any> {
        return this._axios.get(url);
    }

    public async post<T>(url: string, data: any): Promise<T | any> {
        return this._axios.post(url, data,);
    }

    public async patch(url: string, data: any = {}): Promise<{ message: string; }> {
        return this._axios.patch(url, data);
    }

    public async delete(url: string): Promise<{ message: string; }> {
        return this._axios.delete(url);
    }

}

export const axiosService = new AxiosService(AppConfig.apiUrl!);