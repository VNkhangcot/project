const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

// Mock data for development
const mockDepartments = [
  {
    _id: '1',
    name: 'Phòng Nhân sự',
    description: 'Quản lý nhân sự và tuyển dụng',
    manager: 'Nguyễn Văn A',
    employeeCount: 5,
    budget: 100000000,
    status: 'active'
  },
  {
    _id: '2',
    name: 'Phòng Kế toán',
    description: 'Quản lý tài chính và kế toán',
    manager: 'Trần Thị B',
    employeeCount: 8,
    budget: 150000000,
    status: 'active'
  }
];

const mockEmployees = [
  {
    _id: '1',
    employeeId: 'EMP001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@company.com',
    phone: '0123456789',
    position: 'Trưởng phòng Nhân sự',
    department: 'Phòng Nhân sự',
    salary: 15000000,
    startDate: '2023-01-15',
    status: 'active'
  },
  {
    _id: '2',
    employeeId: 'EMP002',
    name: 'Trần Thị B',
    email: 'tranthib@company.com',
    phone: '0987654321',
    position: 'Trưởng phòng Kế toán',
    department: 'Phòng Kế toán',
    salary: 18000000,
    startDate: '2022-06-01',
    status: 'active'
  }
];

const mockAttendance = [
  {
    _id: '1',
    employee: 'Nguyễn Văn A',
    date: '2024-01-15',
    checkIn: '08:00',
    checkOut: '17:30',
    workingHours: 8.5,
    status: 'present'
  },
  {
    _id: '2',
    employee: 'Trần Thị B',
    date: '2024-01-15',
    checkIn: '08:15',
    checkOut: '17:45',
    workingHours: 8.5,
    status: 'present'
  }
];

// Department Controllers
const getDepartments = async (req, res) => {
  try {
    logger.info('Fetching departments');
    
    const { page = 1, limit = 10, search = '' } = req.query;
    
    let filteredDepartments = mockDepartments;
    if (search) {
      filteredDepartments = mockDepartments.filter(dept => 
        dept.name.toLowerCase().includes(search.toLowerCase()) ||
        dept.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex);
    
    return successResponse(res, {
      departments: paginatedDepartments,
      total: filteredDepartments.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredDepartments.length / limit)
    }, 'Departments retrieved successfully');
  } catch (error) {
    logger.error('Error fetching departments:', error);
    return errorResponse(res, 'Failed to fetch departments', 500);
  }
};

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = mockDepartments.find(dept => dept._id === id);
    
    if (!department) {
      return errorResponse(res, 'Department not found', 404);
    }
    
    return successResponse(res, { department }, 'Department retrieved successfully');
  } catch (error) {
    logger.error('Error fetching department:', error);
    return errorResponse(res, 'Failed to fetch department', 500);
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, description, manager, budget } = req.body;
    
    const newDepartment = {
      _id: (mockDepartments.length + 1).toString(),
      name,
      description,
      manager,
      employeeCount: 0,
      budget: budget || 0,
      status: 'active'
    };
    
    mockDepartments.push(newDepartment);
    
    logger.info(`Department created: ${name}`);
    return successResponse(res, { department: newDepartment }, 'Department created successfully', 201);
  } catch (error) {
    logger.error('Error creating department:', error);
    return errorResponse(res, 'Failed to create department', 500);
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const departmentIndex = mockDepartments.findIndex(dept => dept._id === id);
    if (departmentIndex === -1) {
      return errorResponse(res, 'Department not found', 404);
    }
    
    mockDepartments[departmentIndex] = { ...mockDepartments[departmentIndex], ...updates };
    
    logger.info(`Department updated: ${id}`);
    return successResponse(res, { department: mockDepartments[departmentIndex] }, 'Department updated successfully');
  } catch (error) {
    logger.error('Error updating department:', error);
    return errorResponse(res, 'Failed to update department', 500);
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const departmentIndex = mockDepartments.findIndex(dept => dept._id === id);
    if (departmentIndex === -1) {
      return errorResponse(res, 'Department not found', 404);
    }
    
    mockDepartments.splice(departmentIndex, 1);
    
    logger.info(`Department deleted: ${id}`);
    return successResponse(res, null, 'Department deleted successfully');
  } catch (error) {
    logger.error('Error deleting department:', error);
    return errorResponse(res, 'Failed to delete department', 500);
  }
};

// Employee Controllers
const getEmployees = async (req, res) => {
  try {
    logger.info('Fetching employees');
    
    const { page = 1, limit = 10, search = '', department = '' } = req.query;
    
    let filteredEmployees = mockEmployees;
    if (search) {
      filteredEmployees = mockEmployees.filter(emp => 
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.position.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (department) {
      filteredEmployees = filteredEmployees.filter(emp => emp.department === department);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
    
    return successResponse(res, {
      employees: paginatedEmployees,
      total: filteredEmployees.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredEmployees.length / limit)
    }, 'Employees retrieved successfully');
  } catch (error) {
    logger.error('Error fetching employees:', error);
    return errorResponse(res, 'Failed to fetch employees', 500);
  }
};

const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = mockEmployees.find(emp => emp._id === id);
    
    if (!employee) {
      return errorResponse(res, 'Employee not found', 404);
    }
    
    return successResponse(res, { employee }, 'Employee retrieved successfully');
  } catch (error) {
    logger.error('Error fetching employee:', error);
    return errorResponse(res, 'Failed to fetch employee', 500);
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, position, department, salary } = req.body;
    
    const newEmployee = {
      _id: (mockEmployees.length + 1).toString(),
      employeeId: `EMP${String(mockEmployees.length + 1).padStart(3, '0')}`,
      name,
      email,
      phone,
      position,
      department,
      salary: salary || 0,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    
    mockEmployees.push(newEmployee);
    
    logger.info(`Employee created: ${name}`);
    return successResponse(res, { employee: newEmployee }, 'Employee created successfully', 201);
  } catch (error) {
    logger.error('Error creating employee:', error);
    return errorResponse(res, 'Failed to create employee', 500);
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const employeeIndex = mockEmployees.findIndex(emp => emp._id === id);
    if (employeeIndex === -1) {
      return errorResponse(res, 'Employee not found', 404);
    }
    
    mockEmployees[employeeIndex] = { ...mockEmployees[employeeIndex], ...updates };
    
    logger.info(`Employee updated: ${id}`);
    return successResponse(res, { employee: mockEmployees[employeeIndex] }, 'Employee updated successfully');
  } catch (error) {
    logger.error('Error updating employee:', error);
    return errorResponse(res, 'Failed to update employee', 500);
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employeeIndex = mockEmployees.findIndex(emp => emp._id === id);
    if (employeeIndex === -1) {
      return errorResponse(res, 'Employee not found', 404);
    }
    
    mockEmployees.splice(employeeIndex, 1);
    
    logger.info(`Employee deleted: ${id}`);
    return successResponse(res, null, 'Employee deleted successfully');
  } catch (error) {
    logger.error('Error deleting employee:', error);
    return errorResponse(res, 'Failed to delete employee', 500);
  }
};

// Attendance Controllers
const getAttendance = async (req, res) => {
  try {
    logger.info('Fetching attendance records');
    
    const { page = 1, limit = 10, date = '', employee = '' } = req.query;
    
    let filteredAttendance = mockAttendance;
    if (date) {
      filteredAttendance = mockAttendance.filter(att => att.date === date);
    }
    
    if (employee) {
      filteredAttendance = filteredAttendance.filter(att => 
        att.employee.toLowerCase().includes(employee.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedAttendance = filteredAttendance.slice(startIndex, endIndex);
    
    return successResponse(res, {
      attendance: paginatedAttendance,
      total: filteredAttendance.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredAttendance.length / limit)
    }, 'Attendance records retrieved successfully');
  } catch (error) {
    logger.error('Error fetching attendance:', error);
    return errorResponse(res, 'Failed to fetch attendance records', 500);
  }
};

const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const currentTime = new Date();
    const currentDate = currentTime.toISOString().split('T')[0];
    const checkInTime = currentTime.toTimeString().split(' ')[0].substring(0, 5);
    
    const newAttendance = {
      _id: (mockAttendance.length + 1).toString(),
      employee: `Employee ${employeeId}`,
      date: currentDate,
      checkIn: checkInTime,
      checkOut: null,
      workingHours: 0,
      status: 'checked-in'
    };
    
    mockAttendance.push(newAttendance);
    
    logger.info(`Check-in recorded for employee: ${employeeId}`);
    return successResponse(res, { attendance: newAttendance }, 'Check-in recorded successfully', 201);
  } catch (error) {
    logger.error('Error recording check-in:', error);
    return errorResponse(res, 'Failed to record check-in', 500);
  }
};

const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const currentTime = new Date();
    const currentDate = currentTime.toISOString().split('T')[0];
    const checkOutTime = currentTime.toTimeString().split(' ')[0].substring(0, 5);
    
    // Find today's attendance record for this employee
    const attendanceIndex = mockAttendance.findIndex(att => 
      att.employee.includes(employeeId) && att.date === currentDate && !att.checkOut
    );
    
    if (attendanceIndex === -1) {
      return errorResponse(res, 'No check-in record found for today', 404);
    }
    
    // Calculate working hours
    const checkInTime = mockAttendance[attendanceIndex].checkIn;
    const checkInMinutes = parseInt(checkInTime.split(':')[0]) * 60 + parseInt(checkInTime.split(':')[1]);
    const checkOutMinutes = parseInt(checkOutTime.split(':')[0]) * 60 + parseInt(checkOutTime.split(':')[1]);
    const workingHours = (checkOutMinutes - checkInMinutes) / 60;
    
    mockAttendance[attendanceIndex].checkOut = checkOutTime;
    mockAttendance[attendanceIndex].workingHours = workingHours;
    mockAttendance[attendanceIndex].status = 'present';
    
    logger.info(`Check-out recorded for employee: ${employeeId}`);
    return successResponse(res, { attendance: mockAttendance[attendanceIndex] }, 'Check-out recorded successfully');
  } catch (error) {
    logger.error('Error recording check-out:', error);
    return errorResponse(res, 'Failed to record check-out', 500);
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    
    let filteredAttendance = mockAttendance;
    
    if (startDate && endDate) {
      filteredAttendance = mockAttendance.filter(att => 
        att.date >= startDate && att.date <= endDate
      );
    }
    
    if (employeeId) {
      filteredAttendance = filteredAttendance.filter(att => 
        att.employee.includes(employeeId)
      );
    }
    
    const totalWorkingHours = filteredAttendance.reduce((sum, att) => sum + att.workingHours, 0);
    const totalDays = filteredAttendance.length;
    const averageWorkingHours = totalDays > 0 ? totalWorkingHours / totalDays : 0;
    
    const report = {
      attendance: filteredAttendance,
      summary: {
        totalDays,
        totalWorkingHours: totalWorkingHours.toFixed(2),
        averageWorkingHours: averageWorkingHours.toFixed(2)
      }
    };
    
    return successResponse(res, report, 'Attendance report generated successfully');
  } catch (error) {
    logger.error('Error generating attendance report:', error);
    return errorResponse(res, 'Failed to generate attendance report', 500);
  }
};

// HR Stats
const getHRStats = async (req, res) => {
  try {
    const stats = {
      totalEmployees: mockEmployees.length,
      totalDepartments: mockDepartments.length,
      activeEmployees: mockEmployees.filter(emp => emp.status === 'active').length,
      todayAttendance: mockAttendance.filter(att => att.date === new Date().toISOString().split('T')[0]).length,
      averageSalary: mockEmployees.reduce((sum, emp) => sum + emp.salary, 0) / mockEmployees.length,
      departmentDistribution: mockDepartments.map(dept => ({
        department: dept.name,
        employeeCount: dept.employeeCount
      }))
    };
    
    return successResponse(res, stats, 'HR statistics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching HR stats:', error);
    return errorResponse(res, 'Failed to fetch HR statistics', 500);
  }
};

// Job listings
const getJobs = async (req, res) => {
  try {
    logger.info('Fetching job listings');
    
    const mockJobs = [
      {
        _id: '1',
        title: 'Software Developer',
        department: 'IT',
        location: 'Hà Nội',
        type: 'full-time',
        level: 'junior',
        salary: { min: 15000000, max: 25000000, currency: 'VND' },
        description: 'Tuyển dụng lập trình viên phần mềm',
        requirements: ['JavaScript', 'Node.js', 'React'],
        benefits: ['Bảo hiểm', 'Thưởng tháng 13'],
        status: 'active',
        postedDate: '2024-01-15',
        deadline: '2024-02-15'
      },
      {
        _id: '2',
        title: 'Marketing Specialist',
        department: 'Marketing',
        location: 'TP.HCM',
        type: 'full-time',
        level: 'mid',
        salary: { min: 12000000, max: 18000000, currency: 'VND' },
        description: 'Chuyên viên marketing',
        requirements: ['Digital Marketing', 'SEO', 'Content Writing'],
        benefits: ['Laptop', 'Du lịch công ty'],
        status: 'active',
        postedDate: '2024-01-10',
        deadline: '2024-02-10'
      }
    ];
    
    return successResponse(res, { jobs: mockJobs, total: mockJobs.length }, 'Job listings retrieved successfully');
  } catch (error) {
    logger.error('Error fetching job listings:', error);
    return errorResponse(res, 'Failed to fetch job listings', 500);
  }
};

const getJob = async (req, res) => {
  try {
    const { id } = req.params;
    const mockJob = {
      _id: id,
      title: 'Software Developer',
      department: 'IT',
      location: 'Hà Nội',
      type: 'full-time',
      level: 'junior',
      salary: { min: 15000000, max: 25000000, currency: 'VND' },
      description: 'Tuyển dụng lập trình viên phần mềm',
      requirements: ['JavaScript', 'Node.js', 'React'],
      benefits: ['Bảo hiểm', 'Thưởng tháng 13'],
      status: 'active',
      postedDate: '2024-01-15',
      deadline: '2024-02-15'
    };
    
    return successResponse(res, { job: mockJob }, 'Job retrieved successfully');
  } catch (error) {
    logger.error('Error fetching job:', error);
    return errorResponse(res, 'Failed to fetch job', 500);
  }
};

const createJob = async (req, res) => {
  try {
    const jobData = req.body;
    const newJob = {
      _id: Date.now().toString(),
      ...jobData,
      status: 'active',
      postedDate: new Date().toISOString().split('T')[0]
    };
    
    logger.info(`Job created: ${newJob.title}`);
    return successResponse(res, { job: newJob }, 'Job created successfully', 201);
  } catch (error) {
    logger.error('Error creating job:', error);
    return errorResponse(res, 'Failed to create job', 500);
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedJob = {
      _id: id,
      title: 'Software Developer',
      department: 'IT',
      ...updates
    };
    
    logger.info(`Job updated: ${id}`);
    return successResponse(res, { job: updatedJob }, 'Job updated successfully');
  } catch (error) {
    logger.error('Error updating job:', error);
    return errorResponse(res, 'Failed to update job', 500);
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    logger.info(`Job deleted: ${id}`);
    return successResponse(res, null, 'Job deleted successfully');
  } catch (error) {
    logger.error('Error deleting job:', error);
    return errorResponse(res, 'Failed to delete job', 500);
  }
};

// Job applications
const getApplications = async (req, res) => {
  try {
    logger.info('Fetching job applications');
    
    const mockApplications = [
      {
        _id: '1',
        jobId: '1',
        jobTitle: 'Software Developer',
        applicant: {
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          phone: '0123456789'
        },
        resume: 'resume_link.pdf',
        coverLetter: 'Tôi rất quan tâm đến vị trí này...',
        status: 'pending',
        appliedDate: '2024-01-20',
        experience: '2 years',
        skills: ['JavaScript', 'React', 'Node.js']
      },
      {
        _id: '2',
        jobId: '2',
        jobTitle: 'Marketing Specialist',
        applicant: {
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          phone: '0987654321'
        },
        resume: 'resume_link2.pdf',
        coverLetter: 'Tôi có kinh nghiệm trong lĩnh vực marketing...',
        status: 'reviewed',
        appliedDate: '2024-01-18',
        experience: '3 years',
        skills: ['SEO', 'Content Marketing', 'Social Media']
      }
    ];
    
    return successResponse(res, { applications: mockApplications, total: mockApplications.length }, 'Applications retrieved successfully');
  } catch (error) {
    logger.error('Error fetching applications:', error);
    return errorResponse(res, 'Failed to fetch applications', 500);
  }
};

const getApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const mockApplication = {
      _id: id,
      jobId: '1',
      jobTitle: 'Software Developer',
      applicant: {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0123456789'
      },
      resume: 'resume_link.pdf',
      coverLetter: 'Tôi rất quan tâm đến vị trí này...',
      status: 'pending',
      appliedDate: '2024-01-20',
      experience: '2 years',
      skills: ['JavaScript', 'React', 'Node.js']
    };
    
    return successResponse(res, { application: mockApplication }, 'Application retrieved successfully');
  } catch (error) {
    logger.error('Error fetching application:', error);
    return errorResponse(res, 'Failed to fetch application', 500);
  }
};

const createApplication = async (req, res) => {
  try {
    const applicationData = req.body;
    const newApplication = {
      _id: Date.now().toString(),
      ...applicationData,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    
    logger.info(`Application created for job: ${newApplication.jobId}`);
    return successResponse(res, { application: newApplication }, 'Application created successfully', 201);
  } catch (error) {
    logger.error('Error creating application:', error);
    return errorResponse(res, 'Failed to create application', 500);
  }
};

const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedApplication = {
      _id: id,
      jobId: '1',
      jobTitle: 'Software Developer',
      ...updates
    };
    
    logger.info(`Application updated: ${id}`);
    return successResponse(res, { application: updatedApplication }, 'Application updated successfully');
  } catch (error) {
    logger.error('Error updating application:', error);
    return errorResponse(res, 'Failed to update application', 500);
  }
};

module.exports = {
  // Departments
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  
  // Employees
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  
  // Attendance
  getAttendance,
  checkIn,
  checkOut,
  getAttendanceReport,
  
  // Jobs
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  
  // Applications
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  
  // Stats
  getHRStats
};
