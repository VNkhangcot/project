# Plan Phát Triển API Server Node.js cho Hệ Thống Quản Lý Doanh Nghiệp

## 1. Tổng Quan Hệ Thống

### Mô tả
Xây dựng API server Node.js hoàn chỉnh cho hệ thống quản lý doanh nghiệp với MongoDB, tích hợp với frontend Next.js hiện có.

### Công nghệ sử dụng
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: Joi hoặc express-validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Deployment**: Docker + PM2

## 2. Cấu Trúc Thư Mục API Server

```
server/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── hr.controller.js
│   │   ├── finance.controller.js
│   │   ├── inventory.controller.js
│   │   ├── sales.controller.js
│   │   └── reports.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── permission.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Enterprise.js
│   │   ├── Department.js
│   │   ├── Employee.js
│   │   ├── Finance.js
│   │   ├── Inventory.js
│   │   └── Sales.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── hr.routes.js
│   │   ├── finance.routes.js
│   │   ├── inventory.routes.js
│   │   ├── sales.routes.js
│   │   └── reports.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── notification.service.js
│   │   └── report.service.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── response.js
│   │   └── helpers.js
│   └── app.js
├── tests/
├── docs/
├── package.json
└── server.js
```

## 3. Database Schema Design

### 3.1 Core Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // hashed
  role: ObjectId, // ref: Role
  enterprises: [ObjectId], // ref: Enterprise
  status: String, // active, inactive, suspended
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Enterprises Collection
```javascript
{
  _id: ObjectId,
  name: String,
  code: String,
  businessType: String,
  taxCode: String,
  address: Object,
  contactInfo: Object,
  owner: ObjectId, // ref: User
  employees: [ObjectId], // ref: Employee
  departments: [ObjectId], // ref: Department
  settings: Object,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.2 HR Module Collections

#### Departments Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  enterprise: ObjectId, // ref: Enterprise
  manager: ObjectId, // ref: Employee
  employees: [ObjectId], // ref: Employee
  budget: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Employees Collection
```javascript
{
  _id: ObjectId,
  employeeId: String,
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    address: Object,
    dateOfBirth: Date,
    idNumber: String
  },
  workInfo: {
    position: String,
    department: ObjectId, // ref: Department
    startDate: Date,
    salary: Number,
    contractType: String,
    status: String
  },
  enterprise: ObjectId, // ref: Enterprise
  user: ObjectId, // ref: User (optional)
  createdAt: Date,
  updatedAt: Date
}
```

#### Attendance Collection
```javascript
{
  _id: ObjectId,
  employee: ObjectId, // ref: Employee
  date: Date,
  checkIn: Date,
  checkOut: Date,
  workingHours: Number,
  overtimeHours: Number,
  status: String, // present, absent, late, leave
  notes: String,
  createdAt: Date
}
```

### 3.3 Finance Module Collections

#### Transactions Collection
```javascript
{
  _id: ObjectId,
  type: String, // income, expense
  category: String,
  amount: Number,
  currency: String,
  description: String,
  date: Date,
  enterprise: ObjectId, // ref: Enterprise
  employee: ObjectId, // ref: Employee (optional)
  invoice: ObjectId, // ref: Invoice (optional)
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Invoices Collection
```javascript
{
  _id: ObjectId,
  invoiceNumber: String,
  type: String, // sales, purchase
  customer: Object,
  items: [Object],
  subtotal: Number,
  tax: Number,
  total: Number,
  currency: String,
  dueDate: Date,
  status: String, // draft, sent, paid, overdue
  enterprise: ObjectId, // ref: Enterprise
  createdAt: Date,
  updatedAt: Date
}
```

#### Payroll Collection
```javascript
{
  _id: ObjectId,
  employee: ObjectId, // ref: Employee
  period: {
    month: Number,
    year: Number
  },
  basicSalary: Number,
  allowances: [Object],
  deductions: [Object],
  overtime: Object,
  netSalary: Number,
  status: String, // draft, approved, paid
  enterprise: ObjectId, // ref: Enterprise
  createdAt: Date,
  updatedAt: Date
}
```

### 3.4 Inventory Module Collections

#### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  sku: String,
  description: String,
  category: String,
  unit: String,
  price: {
    cost: Number,
    selling: Number
  },
  stock: {
    current: Number,
    minimum: Number,
    maximum: Number
  },
  supplier: Object,
  enterprise: ObjectId, // ref: Enterprise
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### StockMovements Collection
```javascript
{
  _id: ObjectId,
  product: ObjectId, // ref: Product
  type: String, // in, out, adjustment
  quantity: Number,
  reason: String,
  reference: String,
  date: Date,
  employee: ObjectId, // ref: Employee
  enterprise: ObjectId, // ref: Enterprise
  createdAt: Date
}
```

### 3.5 Sales Module Collections

#### Orders Collection
```javascript
{
  _id: ObjectId,
  orderNumber: String,
  customer: Object,
  items: [Object],
  subtotal: Number,
  tax: Number,
  discount: Number,
  total: Number,
  status: String, // pending, confirmed, shipped, delivered, cancelled
  paymentStatus: String,
  shippingAddress: Object,
  notes: String,
  enterprise: ObjectId, // ref: Enterprise
  createdAt: Date,
  updatedAt: Date
}
```

#### Customers Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  address: Object,
  type: String, // individual, business
  taxCode: String,
  creditLimit: Number,
  totalOrders: Number,
  totalSpent: Number,
  enterprise: ObjectId, // ref: Enterprise
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 4. API Endpoints Design

### 4.1 Authentication & Authorization
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/profile
PUT    /api/auth/profile
```

### 4.2 Dashboard
```
GET    /api/dashboard/stats
GET    /api/dashboard/analytics
GET    /api/dashboard/recent-activities
GET    /api/dashboard/notifications
```

### 4.3 HR Management
```
# Departments
GET    /api/hr/departments
POST   /api/hr/departments
GET    /api/hr/departments/:id
PUT    /api/hr/departments/:id
DELETE /api/hr/departments/:id

# Employees
GET    /api/hr/employees
POST   /api/hr/employees
GET    /api/hr/employees/:id
PUT    /api/hr/employees/:id
DELETE /api/hr/employees/:id

# Attendance
GET    /api/hr/attendance
POST   /api/hr/attendance/checkin
POST   /api/hr/attendance/checkout
GET    /api/hr/attendance/report

# Recruitment
GET    /api/hr/jobs
POST   /api/hr/jobs
GET    /api/hr/applications
POST   /api/hr/applications
```

### 4.4 Finance Management
```
# Transactions
GET    /api/finance/transactions
POST   /api/finance/transactions
GET    /api/finance/transactions/:id
PUT    /api/finance/transactions/:id
DELETE /api/finance/transactions/:id

# Invoices
GET    /api/finance/invoices
POST   /api/finance/invoices
GET    /api/finance/invoices/:id
PUT    /api/finance/invoices/:id
DELETE /api/finance/invoices/:id

# Payroll
GET    /api/finance/payroll
POST   /api/finance/payroll
GET    /api/finance/payroll/:id
PUT    /api/finance/payroll/:id

# Reports
GET    /api/finance/reports/income-statement
GET    /api/finance/reports/balance-sheet
GET    /api/finance/reports/cash-flow
```

### 4.5 Inventory Management
```
# Products
GET    /api/inventory/products
POST   /api/inventory/products
GET    /api/inventory/products/:id
PUT    /api/inventory/products/:id
DELETE /api/inventory/products/:id

# Stock
GET    /api/inventory/stock
POST   /api/inventory/stock/in
POST   /api/inventory/stock/out
GET    /api/inventory/stock/movements
GET    /api/inventory/stock/report

# Suppliers
GET    /api/inventory/suppliers
POST   /api/inventory/suppliers
```

### 4.6 Sales Management
```
# Orders
GET    /api/sales/orders
POST   /api/sales/orders
GET    /api/sales/orders/:id
PUT    /api/sales/orders/:id
DELETE /api/sales/orders/:id

# Customers
GET    /api/sales/customers
POST   /api/sales/customers
GET    /api/sales/customers/:id
PUT    /api/sales/customers/:id

# Promotions
GET    /api/sales/promotions
POST   /api/sales/promotions

# Reports
GET    /api/sales/reports/revenue
GET    /api/sales/reports/products
GET    /api/sales/reports/customers
```

### 4.7 Reports
```
GET    /api/reports/generate
POST   /api/reports/custom
GET    /api/reports/templates
GET    /api/reports/history
```

## 5. Implementation Plan

### Phase 1: Core Setup (Tuần 1-2)
- [ ] Khởi tạo project Node.js + Express
- [ ] Cấu hình MongoDB connection
- [ ] Setup JWT authentication
- [ ] Tạo middleware cơ bản
- [ ] Implement User & Enterprise models
- [ ] API authentication endpoints

### Phase 2: HR Module (Tuần 3-4)
- [ ] Department management APIs
- [ ] Employee management APIs
- [ ] Attendance tracking APIs
- [ ] Basic recruitment APIs
- [ ] HR dashboard endpoints

### Phase 3: Finance Module (Tuần 5-6)
- [ ] Transaction management APIs
- [ ] Invoice management APIs
- [ ] Payroll calculation APIs
- [ ] Financial reports APIs
- [ ] Finance dashboard endpoints

### Phase 4: Inventory Module (Tuần 7-8)
- [ ] Product management APIs
- [ ] Stock movement APIs
- [ ] Supplier management APIs
- [ ] Inventory reports APIs
- [ ] Low stock alerts

### Phase 5: Sales Module (Tuần 9-10)
- [ ] Order management APIs
- [ ] Customer management APIs
- [ ] Promotion management APIs
- [ ] Sales reports APIs
- [ ] Sales dashboard endpoints

### Phase 6: Reports & Integration (Tuần 11-12)
- [ ] Advanced reporting system
- [ ] Data export functionality
- [ ] Frontend integration
- [ ] API documentation
- [ ] Testing & optimization

## 6. Security & Performance

### Security Measures
- JWT token authentication
- Password hashing với bcrypt
- Input validation & sanitization
- Rate limiting
- CORS configuration
- SQL injection prevention
- XSS protection

### Performance Optimization
- Database indexing
- Query optimization
- Caching với Redis
- Pagination cho large datasets
- File upload optimization
- API response compression

## 7. Testing Strategy

### Unit Tests
- Model validation tests
- Service function tests
- Utility function tests

### Integration Tests
- API endpoint tests
- Database operation tests
- Authentication flow tests

### Load Testing
- API performance tests
- Database stress tests
- Concurrent user tests

## 8. Deployment & DevOps

### Development Environment
- Docker containers
- Environment variables
- Hot reload setup

### Production Environment
- PM2 process manager
- Nginx reverse proxy
- SSL certificates
- Log management
- Monitoring & alerts

## 9. Documentation

### API Documentation
- Swagger/OpenAPI specs
- Endpoint descriptions
- Request/response examples
- Authentication guide

### Developer Documentation
- Setup instructions
- Architecture overview
- Database schema
- Deployment guide

## 10. Maintenance & Updates

### Regular Tasks
- Security updates
- Performance monitoring
- Database maintenance
- Backup procedures
- Log rotation

### Feature Updates
- New module additions
- API versioning
- Database migrations
- Frontend compatibility

---

## Ghi Chú Quan Trọng

1. **Tích hợp Frontend**: Đảm bảo API endpoints tương thích với frontend Next.js hiện có
2. **Data Migration**: Plan cho việc migrate data từ mock data sang MongoDB
3. **Scalability**: Thiết kế để có thể scale horizontal khi cần
4. **Monitoring**: Implement logging và monitoring từ đầu
5. **Backup**: Thiết lập backup strategy cho production data

## Tiếp Theo

Sau khi review plan này, chúng ta sẽ bắt đầu implement từ Phase 1 với việc setup core infrastructure và authentication system.
