# Hướng Dẫn Tích Hợp Frontend với API Server

## Tổng Quan

Đã hoàn thành tích hợp API server Node.js với frontend Next.js cho hệ thống quản lý doanh nghiệp. Tất cả các services đã được cập nhật để sử dụng API endpoints thực tế.

## Các Thay Đổi Đã Thực Hiện

### 1. Cập Nhật API Client (`lib/api.ts`)
- Thay đổi từ `token` sang `accessToken` trong localStorage
- Tương thích với JWT token structure từ server

### 2. Cập Nhật Authentication Service (`services/authService.ts`)
- Hỗ trợ access token và refresh token
- Thêm các method mới: `refreshToken()`, `verifyEmail()`, `resendVerification()`
- Cập nhật token storage strategy

### 3. Cập Nhật Dashboard Service (`services/dashboardService.ts`)
- Tích hợp với API endpoints `/dashboard/stats`, `/dashboard/analytics`
- Giữ lại mock data cho các features chưa implement
- Backward compatibility với existing components

### 4. Tạo Mới HR Service (`services/hrService.ts`)
- Quản lý phòng ban (departments)
- Quản lý nhân viên (employees)
- Hệ thống chấm công (attendance)
- Tuyển dụng (recruitment)
- Báo cáo HR

### 5. Tạo Mới Finance Service (`services/financeService.ts`)
- Quản lý giao dịch (transactions)
- Quản lý hóa đơn (invoices)
- Hệ thống lương (payroll)
- Báo cáo tài chính
- Xuất dữ liệu

### 6. Tạo Mới Inventory Service (`services/inventoryService.ts`)
- Quản lý sản phẩm (products)
- Quản lý tồn kho (stock management)
- Quản lý nhà cung cấp (suppliers)
- Cảnh báo tồn kho (stock alerts)
- Báo cáo kho hàng

### 7. Tạo Mới Sales Service (`services/salesService.ts`)
- Quản lý đơn hàng (orders)
- Quản lý khách hàng (customers)
- Hệ thống báo giá (quotes)
- Quản lý khuyến mãi (promotions)
- Báo cáo bán hàng

## Cách Sử Dụng

### 1. Khởi Động API Server

```bash
# Di chuyển vào thư mục server
cd server

# Cài đặt dependencies
npm install

# Tạo file .env từ template
cp .env.example .env

# Chỉnh sửa .env với thông tin MongoDB của bạn
# MONGODB_URI=mongodb://localhost:27017/enterprise-management

# Khởi động server
npm run dev
```

### 2. Khởi Động Frontend

```bash
# Ở thư mục root của project
npm run dev
```

### 3. Seed Database (Tùy chọn)

```bash
# Trong thư mục server
npm run seed
```

## API Endpoints Đã Tích Hợp

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/profile` - Lấy thông tin user
- `PUT /api/auth/profile` - Cập nhật profile
- `PUT /api/auth/change-password` - Đổi mật khẩu
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Reset mật khẩu
- `POST /api/auth/refresh-token` - Refresh token

### Dashboard
- `GET /api/dashboard/stats` - Thống kê tổng quan
- `GET /api/dashboard/analytics` - Dữ liệu phân tích
- `GET /api/dashboard/recent-activities` - Hoạt động gần đây

### HR Management
- `GET /api/hr/departments` - Danh sách phòng ban
- `POST /api/hr/departments` - Tạo phòng ban
- `GET /api/hr/employees` - Danh sách nhân viên
- `POST /api/hr/employees` - Thêm nhân viên
- `GET /api/hr/attendance` - Dữ liệu chấm công
- `POST /api/hr/attendance/checkin` - Check in
- `POST /api/hr/attendance/checkout` - Check out

### Finance Management
- `GET /api/finance/transactions` - Danh sách giao dịch
- `POST /api/finance/transactions` - Tạo giao dịch
- `GET /api/finance/invoices` - Danh sách hóa đơn
- `POST /api/finance/invoices` - Tạo hóa đơn
- `GET /api/finance/payroll` - Danh sách lương
- `POST /api/finance/payroll` - Tạo bảng lương

### Inventory Management
- `GET /api/inventory/products` - Danh sách sản phẩm
- `POST /api/inventory/products` - Thêm sản phẩm
- `GET /api/inventory/stock` - Tình trạng tồn kho
- `POST /api/inventory/stock/in` - Nhập kho
- `POST /api/inventory/stock/out` - Xuất kho
- `GET /api/inventory/suppliers` - Danh sách nhà cung cấp

### Sales Management
- `GET /api/sales/orders` - Danh sách đơn hàng
- `POST /api/sales/orders` - Tạo đơn hàng
- `GET /api/sales/customers` - Danh sách khách hàng
- `POST /api/sales/customers` - Thêm khách hàng
- `GET /api/sales/promotions` - Danh sách khuyến mãi
- `POST /api/sales/promotions` - Tạo khuyến mãi

## Sử Dụng Services Trong Components

### Ví Dụ: Sử Dụng HR Service

```typescript
import { HRService } from '@/services/hrService';

// Trong component
const [employees, setEmployees] = useState([]);

useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const response = await HRService.getEmployees({
        page: 1,
        limit: 10,
        status: 'active'
      });
      
      if (response.status === 'success') {
        setEmployees(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  fetchEmployees();
}, []);
```

### Ví Dụ: Sử Dụng Finance Service

```typescript
import { FinanceService } from '@/services/financeService';

// Tạo giao dịch mới
const createTransaction = async (transactionData) => {
  try {
    const response = await FinanceService.createTransaction(transactionData);
    
    if (response.status === 'success') {
      // Xử lý thành công
      toast.success('Tạo giao dịch thành công!');
    }
  } catch (error) {
    toast.error('Lỗi khi tạo giao dịch');
  }
};
```

## Error Handling

Tất cả services đều sử dụng cấu trúc response thống nhất:

```typescript
interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
```

## Authentication Flow

1. User đăng nhập → Nhận access token và refresh token
2. Access token được lưu trong localStorage
3. Mọi API request đều tự động include access token
4. Khi token hết hạn → Tự động refresh token
5. Nếu refresh token hết hạn → Redirect về login

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/enterprise-management
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
```

## Testing

### Test API Endpoints

```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Test protected endpoint
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### 1. CORS Issues
- Đảm bảo server đã cấu hình CORS cho frontend URL
- Kiểm tra `server/src/app.js` có cors middleware

### 2. Authentication Issues
- Kiểm tra JWT secret trong .env
- Verify token format trong localStorage
- Check token expiration

### 3. Database Connection
- Đảm bảo MongoDB đang chạy
- Kiểm tra MONGODB_URI trong .env
- Test connection với MongoDB client

### 4. API Not Found
- Kiểm tra server đang chạy trên port 5000
- Verify API endpoints trong server routes
- Check network requests trong browser DevTools

## Next Steps

1. **Testing**: Implement unit tests cho services
2. **Error Boundaries**: Thêm error boundaries cho components
3. **Loading States**: Implement loading states cho API calls
4. **Caching**: Thêm caching strategy với React Query
5. **Real-time**: Implement WebSocket cho real-time updates
6. **File Upload**: Thêm file upload functionality
7. **Notifications**: Implement push notifications
8. **Mobile**: Optimize cho mobile devices

## Kết Luận

Hệ thống đã được tích hợp hoàn chỉnh với API server. Tất cả các modules chính (HR, Finance, Inventory, Sales) đều có services tương ứng và sẵn sàng sử dụng. Frontend có thể giao tiếp với backend thông qua các services đã được chuẩn hóa.
