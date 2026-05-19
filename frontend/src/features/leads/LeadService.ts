import axiosInstance from '../../api/axiosInstance';

export interface LeadFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  source?: string;
  search?: string;
  sort?: string;
}

export const leadService = {
  getLeads: async (params: LeadFilterParams) => {
    const response = await axiosInstance.get('/leads', { params });
    return response.data;
  },
  
  createLead: async (data: any) => {
    const response = await axiosInstance.post('/leads', data);
    return response.data;
  },

  updateLead: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: string) => {
    const response = await axiosInstance.delete(`/leads/${id}`);
    return response.data;
  },

  exportCSV: async () => {
    const response = await axiosInstance.get('/leads/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  getDashboardStats: async () => {
    const response = await axiosInstance.get('/leads/stats/dashboard');
    return response.data;
  }
};
