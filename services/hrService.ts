import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

// HR related interfaces
export interface Department {
  _id: string;
  name: string;
  description: string;
  manager?: Employee;
  employees: Employee[];
  budget: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  _id: string;
  employeeId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: any;
    dateOfBirth: string;
    idNumber: string;
  };
  workInfo: {
    position: string;
    department: string;
    startDate: string;
    salary: number;
    contractType: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  _id: string;
  employee: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workingHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'late' | 'leave';
  notes?: string;
  createdAt: string;
}

export class HRService {
  // Department Management
  static async getDepartments(): Promise<ApiResponse<Department[]>> {
    return apiClient.get<ApiResponse<Department[]>>('/hr/departments');
  }

  static async getDepartment(id: string): Promise<ApiResponse<Department>> {
    return apiClient.get<ApiResponse<Department>>(`/hr/departments/${id}`);
  }

  static async createDepartment(data: Partial<Department>): Promise<ApiResponse<Department>> {
    return apiClient.post<ApiResponse<Department>>('/hr/departments', data);
  }

  static async updateDepartment(id: string, data: Partial<Department>): Promise<ApiResponse<Department>> {
    return apiClient.put<ApiResponse<Department>>(`/hr/departments/${id}`, data);
  }

  static async deleteDepartment(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(`/hr/departments/${id}`);
  }

  // Employee Management
  static async getEmployees(params?: {
    page?: number;
    limit?: number;
    department?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<Employee[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/hr/employees?${queryString}` : '/hr/employees';
    
    return apiClient.get<ApiResponse<Employee[]>>(endpoint);
  }

  static async getEmployee(id: string): Promise<ApiResponse<Employee>> {
    return apiClient.get<ApiResponse<Employee>>(`/hr/employees/${id}`);
  }

  static async createEmployee(data: Partial<Employee>): Promise<ApiResponse<Employee>> {
    return apiClient.post<ApiResponse<Employee>>('/hr/employees', data);
  }

  static async updateEmployee(id: string, data: Partial<Employee>): Promise<ApiResponse<Employee>> {
    return apiClient.put<ApiResponse<Employee>>(`/hr/employees/${id}`, data);
  }

  static async deleteEmployee(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(`/hr/employees/${id}`);
  }

  // Attendance Management
  static async getAttendance(params?: {
    page?: number;
    limit?: number;
    employee?: string;
    date?: string;
    status?: string;
  }): Promise<ApiResponse<Attendance[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/hr/attendance?${queryString}` : '/hr/attendance';
    
    return apiClient.get<ApiResponse<Attendance[]>>(endpoint);
  }

  static async checkIn(employeeId: string): Promise<ApiResponse<Attendance>> {
    return apiClient.post<ApiResponse<Attendance>>('/hr/attendance/checkin', { employeeId });
  }

  static async checkOut(employeeId: string): Promise<ApiResponse<Attendance>> {
    return apiClient.post<ApiResponse<Attendance>>('/hr/attendance/checkout', { employeeId });
  }

  static async getAttendanceReport(params: {
    startDate: string;
    endDate: string;
    employee?: string;
    department?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<ApiResponse<any>>(`/hr/attendance/report?${queryParams.toString()}`);
  }

  // Recruitment Management
  static async getJobs(): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>('/hr/jobs');
  }

  static async createJob(data: any): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>('/hr/jobs', data);
  }

  static async getApplications(jobId?: string): Promise<ApiResponse<any[]>> {
    const endpoint = jobId ? `/hr/applications?jobId=${jobId}` : '/hr/applications';
    return apiClient.get<ApiResponse<any[]>>(endpoint);
  }

  static async submitApplication(data: any): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>('/hr/applications', data);
  }

  // HR Statistics
  static async getHRStats(): Promise<ApiResponse<{
    totalEmployees: number;
    totalDepartments: number;
    presentToday: number;
    onLeave: number;
    newHires: number;
    openPositions: number;
  }>> {
    return apiClient.get<ApiResponse<any>>('/hr/stats');
  }
}
