// Mock data cho workspace service
export interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  companyId: string;
  permissions: string[];
  isActive: boolean;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  employees: WorkspaceUser[];
}

export interface WorkspaceTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedBy: string;
  assignedTo: string;
  project: string;
  estimatedHours: number;
  completedHours: number;
  companyId: string;
}

// Mock companies data
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Công ty TNHH ABC',
    description: 'Công ty công nghệ hàng đầu',
    industry: 'Công nghệ thông tin',
    employees: [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@abc.com',
        role: 'Trưởng phòng IT',
        department: 'Phòng Công nghệ thông tin',
        companyId: '1',
        permissions: ['view_reports', 'manage_tasks', 'view_employees', 'create_documents', 'manage_employees'],
        isActive: true
      },
      {
        id: '2',
        name: 'Trần Thị B',
        email: 'tranthib@abc.com',
        role: 'Nhân viên IT',
        department: 'Phòng Công nghệ thông tin',
        companyId: '1',
        permissions: ['view_reports', 'manage_tasks', 'view_employees', 'create_documents'],
        isActive: true
      }
    ]
  }
];

// Mock tasks data
const mockTasks: WorkspaceTask[] = [
  {
    id: '1',
    title: 'Cập nhật hệ thống quản lý',
    description: 'Cập nhật phiên bản mới của hệ thống quản lý khách hàng',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-01-20',
    assignedBy: 'Nguyễn Văn A',
    assignedTo: 'Trần Thị B',
    project: 'Dự án CRM',
    estimatedHours: 8,
    completedHours: 4,
    companyId: '1'
  },
  {
    id: '2',
    title: 'Kiểm tra bảo mật',
    description: 'Thực hiện kiểm tra bảo mật hệ thống và báo cáo các lỗ hổng',
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-01-18',
    assignedBy: 'Nguyễn Văn A',
    assignedTo: 'Trần Thị B',
    project: 'Bảo mật hệ thống',
    estimatedHours: 6,
    completedHours: 6,
    companyId: '1'
  }
];

class WorkspaceService {
  // Get user's workspace info
  async getUserWorkspace(userId: string): Promise<{
    company: Company | null;
    user: WorkspaceUser | null;
    permissions: string[];
  }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find user in companies
    for (const company of mockCompanies) {
      const user = company.employees.find(emp => emp.id === userId);
      if (user) {
        return {
          company,
          user,
          permissions: user.permissions
        };
      }
    }
    
    return {
      company: null,
      user: null,
      permissions: []
    };
  }

  // Get tasks for user
  async getUserTasks(userId: string, companyId: string): Promise<WorkspaceTask[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return mockTasks.filter(task => 
      task.companyId === companyId && 
      (task.assignedTo === userId || task.assignedBy === userId)
    );
  }

  // Update task status
  async updateTaskStatus(taskId: string, status: string): Promise<boolean> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      task.status = status as any;
      return true;
    }
    return false;
  }

  // Get company employees
  async getCompanyEmployees(companyId: string): Promise<WorkspaceUser[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const company = mockCompanies.find(c => c.id === companyId);
    return company ? company.employees : [];
  }

  // Check if user has permission
  hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission);
  }

  // Get available permissions
  getAvailablePermissions(): { [key: string]: string } {
    return {
      'view_reports': 'Xem báo cáo',
      'manage_tasks': 'Quản lý công việc',
      'view_employees': 'Xem danh sách nhân viên',
      'create_documents': 'Tạo tài liệu',
      'manage_employees': 'Quản lý nhân viên',
      'view_calendar': 'Xem lịch làm việc',
      'send_messages': 'Gửi tin nhắn',
      'manage_projects': 'Quản lý dự án',
      'view_analytics': 'Xem phân tích',
      'manage_settings': 'Quản lý cài đặt'
    };
  }

  // Create new task
  async createTask(task: Omit<WorkspaceTask, 'id'>): Promise<WorkspaceTask> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newTask: WorkspaceTask = {
      ...task,
      id: Date.now().toString()
    };
    
    mockTasks.push(newTask);
    return newTask;
  }

  // Get workspace statistics
  async getWorkspaceStats(companyId: string, userId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    totalProjects: number;
  }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const userTasks = mockTasks.filter(task => 
      task.companyId === companyId && task.assignedTo === userId
    );
    
    const completedTasks = userTasks.filter(task => task.status === 'completed').length;
    const pendingTasks = userTasks.filter(task => task.status === 'pending').length;
    const totalProjects = new Set(userTasks.map(task => task.project)).size;
    
    return {
      totalTasks: userTasks.length,
      completedTasks,
      pendingTasks,
      totalProjects
    };
  }
}

export const workspaceService = new WorkspaceService();
