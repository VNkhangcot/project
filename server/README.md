# Enterprise Management API Server

API server Node.js cho hệ thống quản lý doanh nghiệp với MongoDB và Express.js.

## 🚀 Tính năng

- **Authentication & Authorization**: JWT-based với role-based permissions
- **HR Management**: Quản lý nhân sự, phòng ban, chấm công
- **Finance Management**: Quản lý tài chính, thu chi, lương thưởng
- **Inventory Management**: Quản lý kho hàng, sản phẩm, tồn kho
- **Sales Management**: Quản lý bán hàng, đơn hàng, khách hàng
- **Reports**: Tạo báo cáo tự động và tùy chỉnh
- **Dashboard**: Thống kê và phân tích dữ liệu
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Rate limiting, input validation, error handling
- **Logging**: Winston-based logging system

## 📋 Yêu cầu hệ thống

- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm >= 8.0.0

## 🛠️ Cài đặt

### 1. Clone repository và cài đặt dependencies

```bash
cd server
npm install
```

### 2. Cấu hình môi trường

Sao chép file `.env.example` thành `.env` và cập nhật các giá trị:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường quan trọng:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/enterprise-management

# JWT Secrets (thay đổi trong production)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Khởi động MongoDB

Đảm bảo MongoDB đang chạy trên hệ thống:

```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS với Homebrew
brew services start mongodb-community

# Windows
net start MongoDB
```

### 4. Khởi tạo dữ liệu mặc định

```bash
npm run seed
```

### 5. Khởi động server

```bash
# Development mode với hot reload
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API Documentation

Sau khi khởi động server, truy cập Swagger documentation tại:
`http://localhost:5000/api-docs`

## 🔧 Scripts

```bash
# Khởi động development server với nodemon
npm run dev

# Khởi động production server
npm start

# Chạy tests
npm test

# Chạy tests với coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Khởi tạo dữ liệu mặc định
npm run seed

# Backup database
npm run backup

# Restore database
npm run restore
```

## 🏗️ Cấu trúc thư mục

```
server/
├── src/
│   ├── config/          # Cấu hình database, JWT, swagger
│   ├── controllers/     # Controllers xử lý business logic
│   ├── middleware/      # Middleware cho auth, validation, error handling
│   ├── models/          # MongoDB models với Mongoose
│   ├── routes/          # API routes definition
│   ├── services/        # Business services
│   └── utils/           # Utility functions và helpers
├── tests/               # Test files
├── docs/                # Additional documentation
├── logs/                # Log files (tự động tạo)
├── uploads/             # File uploads (tự động tạo)
├── .env                 # Environment variables
├── .env.example         # Environment template
├── package.json         # Dependencies và scripts
└── server.js            # Entry point
```

## 🔐 Authentication

API sử dụng JWT (JSON Web Tokens) cho authentication:

### 1. Đăng ký/Đăng nhập

```bash
# Đăng ký
POST /api/auth/register
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "Password123!"
}

# Đăng nhập
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### 2. Sử dụng token

Thêm token vào header của các request:

```
Authorization: Bearer <your-jwt-token>
```

## 🛡️ Security Features

- **Rate Limiting**: Giới hạn số request per IP
- **Input Validation**: Joi validation cho tất cả inputs
- **Password Hashing**: bcrypt với salt rounds cao
- **JWT Security**: Secure token generation và verification
- **CORS Protection**: Cấu hình CORS cho frontend
- **Error Handling**: Không expose sensitive information
- **Audit Logging**: Log tất cả các hoạt động quan trọng

## 📊 Database Schema

### Core Collections

- **users**: Thông tin người dùng và authentication
- **roles**: Vai trò và quyền hạn
- **enterprises**: Thông tin doanh nghiệp
- **departments**: Phòng ban
- **employees**: Nhân viên

### Module Collections

- **transactions**: Giao dịch tài chính
- **invoices**: Hóa đơn
- **products**: Sản phẩm
- **orders**: Đơn hàng
- **customers**: Khách hàng

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/profile` - Lấy thông tin profile
- `PUT /api/auth/profile` - Cập nhật profile

### Dashboard
- `GET /api/dashboard/stats` - Thống kê tổng quan
- `GET /api/dashboard/analytics` - Dữ liệu phân tích
- `GET /api/dashboard/recent-activities` - Hoạt động gần đây

### HR Management
- `GET /api/hr/departments` - Danh sách phòng ban
- `POST /api/hr/departments` - Tạo phòng ban mới
- `GET /api/hr/employees` - Danh sách nhân viên
- `POST /api/hr/employees` - Thêm nhân viên mới

### Finance Management
- `GET /api/finance/transactions` - Danh sách giao dịch
- `POST /api/finance/transactions` - Tạo giao dịch mới
- `GET /api/finance/reports/income-statement` - Báo cáo thu chi

### Inventory Management
- `GET /api/inventory/products` - Danh sách sản phẩm
- `POST /api/inventory/products` - Thêm sản phẩm mới
- `GET /api/inventory/stock` - Tình trạng tồn kho

### Sales Management
- `GET /api/sales/orders` - Danh sách đơn hàng
- `POST /api/sales/orders` - Tạo đơn hàng mới
- `GET /api/sales/customers` - Danh sách khách hàng

## 🧪 Testing

```bash
# Chạy tất cả tests
npm test

# Chạy tests với coverage
npm run test:coverage

# Chạy tests cho module cụ thể
npm test -- --grep "Auth"
```

## 📝 Logging

Hệ thống sử dụng Winston cho logging với các levels:

- **error**: Lỗi hệ thống
- **warn**: Cảnh báo
- **info**: Thông tin chung
- **debug**: Debug information

Logs được lưu trong thư mục `logs/`:
- `app.log`: Tất cả logs
- `error.log`: Chỉ error logs
- `auth.log`: Authentication logs

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production

```bash
# Build và start
npm start

# Hoặc sử dụng PM2
npm install -g pm2
pm2 start ecosystem.config.js
```

### Docker

```bash
# Build image
docker build -t enterprise-api .

# Run container
docker run -p 5000:5000 --env-file .env enterprise-api
```

## 🔧 Environment Variables

Xem file `.env.example` để biết tất cả các biến môi trường có thể cấu hình.

### Quan trọng cho Production

```env
NODE_ENV=production
JWT_SECRET=<strong-secret-key>
JWT_REFRESH_SECRET=<strong-refresh-secret>
MONGODB_URI=<production-mongodb-uri>
CORS_ORIGIN=<production-frontend-url>
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- Email: support@yourcompany.com
- Documentation: [API Docs](http://localhost:5000/api-docs)
- Issues: [GitHub Issues](https://github.com/yourrepo/issues)
