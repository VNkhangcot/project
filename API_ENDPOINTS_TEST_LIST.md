# 📋 Danh Sách API Endpoints Để Test

## Server Information
- **Base URL**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **Status**: ✅ Running (Process ID: 62796)

---

## 🔐 1. Authentication & Authorization (8 endpoints)

### Base URL: `/api/auth`

| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Đăng ký user mới | ⭐⭐⭐ |
| POST | `/api/auth/login` | Đăng nhập | ⭐⭐⭐ |
| POST | `/api/auth/logout` | Đăng xuất | ⭐⭐⭐ |
| POST | `/api/auth/refresh-token` | Refresh access token | ⭐⭐⭐ |
| POST | `/api/auth/forgot-password` | Quên mật khẩu | ⭐⭐ |
| POST | `/api/auth/reset-password` | Reset mật khẩu | ⭐⭐ |
| PUT | `/api/auth/change-password` | Đổi mật khẩu | ⭐⭐ |
| GET | `/api/auth/profile` | Lấy thông tin profile | ⭐⭐⭐ |
| PUT | `/api/auth/profile` | Cập nhật profile | ⭐⭐ |
| POST | `/api/auth/verify-email` | Xác thực email | ⭐ |
| POST | `/api/auth/resend-verification` | Gửi lại email xác thực | ⭐ |

### Test Cases:
```bash
# 1. Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 3. Get profile (cần token)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 2. Dashboard (4 endpoints)

### Base URL: `/api/dashboard`

| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/stats` | Thống kê tổng quan | ⭐⭐⭐ |
| GET | `/api/dashboard/analytics` | Dữ liệu phân tích | ⭐⭐⭐ |
| GET | `/api/dashboard/recent-activities` | Hoạt động gần đây | ⭐⭐ |
| GET | `/api/dashboard/server-metrics` | Metrics server | ⭐⭐ |
| GET | `/api/dashboard/security-alerts` | Cảnh báo bảo mật | ⭐ |
| GET | `/api/dashboard/performance` | Hiệu suất hệ thống | ⭐ |

### Test Cases:
```bash
# 1. Get dashboard stats
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 2. Get analytics data
curl -X GET "http://localhost:5000/api/dashboard/analytics?period=month" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 👥 3. HR Management (20+ endpoints)

### Base URL: `/api/hr`

#### Departments (5 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/hr/departments` | Danh sách phòng ban | ⭐⭐⭐ |
| POST | `/api/hr/departments` | Tạo phòng ban mới | ⭐⭐⭐ |
| GET | `/api/hr/departments/:id` | Chi tiết phòng ban | ⭐⭐ |
| PUT | `/api/hr/departments/:id` | Cập nhật phòng ban | ⭐⭐ |
| DELETE | `/api/hr/departments/:id` | Xóa phòng ban | ⭐⭐ |

#### Employees (6 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/hr/employees` | Danh sách nhân viên | ⭐⭐⭐ |
| POST | `/api/hr/employees` | Thêm nhân viên mới | ⭐⭐⭐ |
| GET | `/api/hr/employees/:id` | Chi tiết nhân viên | ⭐⭐ |
| PUT | `/api/hr/employees/:id` | Cập nhật nhân viên | ⭐⭐ |
| DELETE | `/api/hr/employees/:id` | Xóa nhân viên | ⭐⭐ |
| GET | `/api/hr/employees/stats` | Thống kê nhân viên | ⭐ |

#### Attendance (4 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/hr/attendance` | Lịch sử chấm công | ⭐⭐⭐ |
| POST | `/api/hr/attendance/checkin` | Check-in | ⭐⭐⭐ |
| POST | `/api/hr/attendance/checkout` | Check-out | ⭐⭐⭐ |
| GET | `/api/hr/attendance/report` | Báo cáo chấm công | ⭐⭐ |

#### Recruitment (4 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/hr/jobs` | Danh sách việc làm | ⭐⭐ |
| POST | `/api/hr/jobs` | Đăng tin tuyển dụng | ⭐⭐ |
| GET | `/api/hr/applications` | Đơn ứng tuyển | ⭐⭐ |
| POST | `/api/hr/applications` | Nộp đơn ứng tuyển | ⭐⭐ |

### Test Cases:
```bash
# 1. Get departments
curl -X GET http://localhost:5000/api/hr/departments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 2. Create department
curl -X POST http://localhost:5000/api/hr/departments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IT Department",
    "description": "Information Technology",
    "manager": "manager_id"
  }'

# 3. Get employees
curl -X GET http://localhost:5000/api/hr/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 💰 4. Finance Management (15+ endpoints)

### Base URL: `/api/finance`

#### Transactions (5 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/finance/transactions` | Danh sách giao dịch | ⭐⭐⭐ |
| POST | `/api/finance/transactions` | Tạo giao dịch mới | ⭐⭐⭐ |
| GET | `/api/finance/transactions/:id` | Chi tiết giao dịch | ⭐⭐ |
| PUT | `/api/finance/transactions/:id` | Cập nhật giao dịch | ⭐⭐ |
| DELETE | `/api/finance/transactions/:id` | Xóa giao dịch | ⭐⭐ |

#### Invoices (5 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/finance/invoices` | Danh sách hóa đơn | ⭐⭐⭐ |
| POST | `/api/finance/invoices` | Tạo hóa đơn mới | ⭐⭐⭐ |
| GET | `/api/finance/invoices/:id` | Chi tiết hóa đơn | ⭐⭐ |
| PUT | `/api/finance/invoices/:id` | Cập nhật hóa đơn | ⭐⭐ |
| DELETE | `/api/finance/invoices/:id` | Xóa hóa đơn | ⭐⭐ |

#### Payroll (3 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/finance/payroll` | Danh sách lương | ⭐⭐⭐ |
| POST | `/api/finance/payroll` | Tạo bảng lương | ⭐⭐⭐ |
| GET | `/api/finance/payroll/:id` | Chi tiết bảng lương | ⭐⭐ |

#### Reports (4 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/finance/reports/income-statement` | Báo cáo thu chi | ⭐⭐ |
| GET | `/api/finance/reports/balance-sheet` | Bảng cân đối kế toán | ⭐⭐ |
| GET | `/api/finance/reports/cash-flow` | Báo cáo lưu chuyển tiền tệ | ⭐⭐ |
| GET | `/api/finance/stats` | Thống kê tài chính | ⭐⭐ |

### Test Cases:
```bash
# 1. Get transactions
curl -X GET http://localhost:5000/api/finance/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 2. Create transaction
curl -X POST http://localhost:5000/api/finance/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "income",
    "amount": 1000000,
    "description": "Sales revenue",
    "category": "sales"
  }'
```

---

## 📦 5. Inventory Management (15+ endpoints)

### Base URL: `/api/inventory`

#### Products (5 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/inventory/products` | Danh sách sản phẩm | ⭐⭐⭐ |
| POST | `/api/inventory/products` | Thêm sản phẩm mới | ⭐⭐⭐ |
| GET | `/api/inventory/products/:id` | Chi tiết sản phẩm | ⭐⭐ |
| PUT | `/api/inventory/products/:id` | Cập nhật sản phẩm | ⭐⭐ |
| DELETE | `/api/inventory/products/:id` | Xóa sản phẩm | ⭐⭐ |

#### Stock Management (5 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/inventory/stock` | Tình trạng tồn kho | ⭐⭐⭐ |
| POST | `/api/inventory/stock/in` | Nhập kho | ⭐⭐⭐ |
| POST | `/api/inventory/stock/out` | Xuất kho | ⭐⭐⭐ |
| GET | `/api/inventory/stock/movements` | Lịch sử xuất nhập | ⭐⭐ |
| GET | `/api/inventory/stock/report` | Báo cáo tồn kho | ⭐⭐ |

#### Suppliers (4 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/inventory/suppliers` | Danh sách nhà cung cấp | ⭐⭐ |
| POST | `/api/inventory/suppliers` | Thêm nhà cung cấp | ⭐⭐ |
| GET | `/api/inventory/suppliers/:id` | Chi tiết nhà cung cấp | ⭐ |
| PUT | `/api/inventory/suppliers/:id` | Cập nhật nhà cung cấp | ⭐ |

#### Stats (1 endpoint)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/inventory/stats` | Thống kê kho hàng | ⭐⭐ |

### Test Cases:
```bash
# 1. Get products
curl -X GET http://localhost:5000/api/inventory/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 2. Create product
curl -X POST http://localhost:5000/api/inventory/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Dell XPS 13",
    "sku": "DELL-XPS-001",
    "price": {"cost": 20000000, "selling": 25000000},
    "stock": {"current": 10, "minimum": 5}
  }'

# 3. Stock in
curl -X POST http://localhost:5000/api/inventory/stock/in \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product_id",
    "quantity": 5,
    "reason": "Purchase from supplier"
  }'
```

---

## 🛒 6. Sales Management (15+ endpoints)

### Base URL: `/api/sales`

#### Orders (5 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/sales/orders` | Danh sách đơn hàng | ⭐⭐⭐ |
| POST | `/api/sales/orders` | Tạo đơn hàng mới | ⭐⭐⭐ |
| GET | `/api/sales/orders/:id` | Chi tiết đơn hàng | ⭐⭐ |
| PUT | `/api/sales/orders/:id` | Cập nhật đơn hàng | ⭐⭐ |
| DELETE | `/api/sales/orders/:id` | Xóa đơn hàng | ⭐⭐ |

#### Customers (4 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/sales/customers` | Danh sách khách hàng | ⭐⭐⭐ |
| POST | `/api/sales/customers` | Thêm khách hàng mới | ⭐⭐⭐ |
| GET | `/api/sales/customers/:id` | Chi tiết khách hàng | ⭐⭐ |
| PUT | `/api/sales/customers/:id` | Cập nhật khách hàng | ⭐⭐ |

#### Promotions (4 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/sales/promotions` | Danh sách khuyến mãi | ⭐⭐ |
| POST | `/api/sales/promotions` | Tạo khuyến mãi mới | ⭐⭐ |
| GET | `/api/sales/promotions/:id` | Chi tiết khuyến mãi | ⭐ |
| PUT | `/api/sales/promotions/:id` | Cập nhật khuyến mãi | ⭐ |

#### Reports (4 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/sales/reports/revenue` | Báo cáo doanh thu | ⭐⭐ |
| GET | `/api/sales/reports/products` | Báo cáo sản phẩm | ⭐⭐ |
| GET | `/api/sales/reports/customers` | Báo cáo khách hàng | ⭐⭐ |
| GET | `/api/sales/stats` | Thống kê bán hàng | ⭐⭐ |

### Test Cases:
```bash
# 1. Get orders
curl -X GET http://localhost:5000/api/sales/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 2. Create order
curl -X POST http://localhost:5000/api/sales/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Nguyễn Văn A",
      "email": "customer@example.com"
    },
    "items": [
      {
        "productId": "product_id",
        "quantity": 2,
        "price": 25000000
      }
    ]
  }'
```

---

## 📊 7. Reports Management (10+ endpoints)

### Base URL: `/api/reports`

#### Report Generation (2 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| POST | `/api/reports/generate` | Tạo báo cáo | ⭐⭐⭐ |
| POST | `/api/reports/custom` | Tạo báo cáo tùy chỉnh | ⭐⭐ |

#### Templates (5 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/reports/templates` | Danh sách template | ⭐⭐ |
| GET | `/api/reports/templates/:id` | Chi tiết template | ⭐ |
| POST | `/api/reports/templates` | Tạo template mới | ⭐ |
| PUT | `/api/reports/templates/:id` | Cập nhật template | ⭐ |
| DELETE | `/api/reports/templates/:id` | Xóa template | ⭐ |

#### History (3 endpoints)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/reports/history` | Lịch sử báo cáo | ⭐⭐ |
| GET | `/api/reports/history/:id` | Chi tiết báo cáo | ⭐ |
| DELETE | `/api/reports/history/:id` | Xóa báo cáo | ⭐ |

#### Overview (1 endpoint)
| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/api/reports/overview` | Tổng quan báo cáo | ⭐⭐ |

### Test Cases:
```bash
# 1. Generate report
curl -X POST http://localhost:5000/api/reports/generate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "revenue",
    "parameters": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "format": "pdf"
  }'

# 2. Get report templates
curl -X GET http://localhost:5000/api/reports/templates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔧 8. System Endpoints (2 endpoints)

| Method | Endpoint | Description | Test Priority |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | ⭐⭐⭐ |
| GET | `/` | API info | ⭐⭐⭐ |

### Test Cases:
```bash
# 1. Health check
curl -X GET http://localhost:5000/health

# 2. API info
curl -X GET http://localhost:5000/
```

---

## 📝 Testing Strategy

### Phase 1: Critical Path Testing (⭐⭐⭐)
1. **System Health**: `/health`, `/`
2. **Authentication**: `register`, `login`, `profile`
3. **Core CRUD**: Get lists for all modules
4. **Dashboard**: Basic stats

### Phase 2: Core Functionality (⭐⭐)
1. **CRUD Operations**: Create, Update, Delete for all modules
2. **Business Logic**: Stock movements, order processing
3. **Reports**: Basic report generation

### Phase 3: Advanced Features (⭐)
1. **Advanced Reports**: Custom reports, templates
2. **Edge Cases**: Error handling, validation
3. **Performance**: Large datasets, pagination

---

## 🚀 Quick Test Commands

### 1. Test Server Status
```bash
curl -X GET http://localhost:5000/health
```

### 2. Test API Documentation
```bash
# Open in browser
start http://localhost:5000/api-docs
```

### 3. Test Authentication Flow
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456","role":"user"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### 4. Test Core Modules (với token)
```bash
# Dashboard
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"

# HR
curl -X GET http://localhost:5000/api/hr/departments \
  -H "Authorization: Bearer YOUR_TOKEN"

# Finance
curl -X GET http://localhost:5000/api/finance/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"

# Inventory
curl -X GET http://localhost:5000/api/inventory/products \
  -H "Authorization: Bearer YOUR_TOKEN"

# Sales
curl -X GET http://localhost:5000/api/sales/orders \
  -H "Authorization: Bearer YOUR_TOKEN"

# Reports
curl -X GET http://localhost:5000/api/reports/templates \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Summary

**Tổng số endpoints**: 80+ endpoints
- **Authentication**: 11 endpoints
- **Dashboard**: 6 endpoints  
- **HR Management**: 19 endpoints
- **Finance Management**: 17 endpoints
- **Inventory Management**: 15 endpoints
- **Sales Management**: 15 endpoints
- **Reports Management**: 11 endpoints
- **System**: 2 endpoints

**Test Priority**:
- ⭐⭐⭐ Critical (25 endpoints) - Test đầu tiên
- ⭐⭐ Important (35 endpoints) - Test sau
- ⭐ Nice-to-have (20+ endpoints) - Test cuối

Bạn có thể bắt đầu test từ các endpoints ⭐⭐⭐ trước, sau đó tiếp tục với ⭐⭐ và ⭐.
