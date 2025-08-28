# Giao diện Quản lý Doanh nghiệp

Đây là giao diện dành cho tài khoản đã đăng ký doanh nghiệp, nơi họ có thể quản lý tất cả mọi thứ với nghiệp vụ doanh nghiệp hiện đại.

## Tính năng chính

1. **Quản lý nhiều doanh nghiệp**
   - Tài khoản chủ có thể tạo và quản lý nhiều hồ sơ doanh nghiệp
   - Chuyển đổi nhanh chóng giữa các doanh nghiệp

2. **Dashboard chuyên nghiệp**
   - Tổng quan về tất cả doanh nghiệp
   - Biểu đồ thống kê doanh thu, nhân sự
   - Hoạt động gần đây

3. **Quản lý phòng ban**
   - Tạo và quản lý phòng ban cho từng doanh nghiệp
   - Phân bổ ngân sách cho từng phòng ban
   - Theo dõi số lượng nhân viên trong từng phòng ban

4. **Quản lý nhân sự**
   - Quản lý thông tin chi tiết của nhân viên
   - Phân công nhân viên vào các phòng ban
   - Theo dõi lịch sử công việc và thăng tiến

5. **Quản lý tài chính**
   - Theo dõi doanh thu, chi phí
   - Quản lý lương thưởng
   - Báo cáo tài chính

6. **Quản lý kho hàng**
   - Theo dõi tồn kho
   - Quản lý nhập xuất kho
   - Kiểm kê hàng hóa

7. **Quản lý bán hàng**
   - Quản lý đơn hàng
   - Quản lý khách hàng
   - Quản lý khuyến mãi

8. **Quản lý văn phòng**
   - Quản lý tài liệu
   - Lịch làm việc
   - Tin nhắn nội bộ

## Cấu trúc thư mục

```
app/enterprise/
├── dashboard/            # Trang tổng quan
├── businesses/           # Quản lý doanh nghiệp
├── hr/                   # Quản lý nhân sự
│   ├── departments/      # Quản lý phòng ban
│   ├── employees/        # Quản lý nhân viên
│   ├── recruitment/      # Tuyển dụng
│   └── attendance/       # Chấm công
├── finance/              # Quản lý tài chính
│   ├── transactions/     # Thu chi
│   ├── invoices/         # Hóa đơn
│   ├── payroll/          # Lương thưởng
│   └── reports/          # Báo cáo tài chính
├── products/             # Quản lý sản phẩm
│   ├── list/             # Danh sách sản phẩm
│   ├── categories/       # Danh mục sản phẩm
│   └── suppliers/        # Nhà cung cấp
├── inventory/            # Quản lý kho hàng
│   ├── stock/            # Tồn kho
│   ├── import/           # Nhập kho
│   ├── export/           # Xuất kho
│   └── check/            # Kiểm kê
├── sales/                # Quản lý bán hàng
│   ├── orders/           # Đơn hàng
│   ├── customers/        # Khách hàng
│   ├── promotions/       # Khuyến mãi
│   └── reports/          # Báo cáo bán hàng
├── office/               # Quản lý văn phòng
│   ├── documents/        # Tài liệu
│   ├── calendar/         # Lịch làm việc
│   ├── messages/         # Tin nhắn
│   └── tasks/            # Công việc
├── reports/              # Báo cáo tổng hợp
└── settings/             # Cài đặt
```

## Công nghệ sử dụng

- **Next.js**: Framework React cho phát triển web
- **TypeScript**: Ngôn ngữ lập trình
- **Tailwind CSS**: Framework CSS
- **Shadcn UI**: Thư viện UI components
- **Lucide React**: Thư viện icon

## Hướng dẫn sử dụng

1. Đăng nhập vào hệ thống
2. Chọn doanh nghiệp muốn quản lý từ dropdown ở header
3. Sử dụng sidebar để điều hướng đến các chức năng khác nhau
4. Sử dụng dashboard để xem tổng quan về doanh nghiệp

## Tính năng sắp tới

- Tích hợp báo cáo nâng cao với biểu đồ và thống kê
- Hệ thống thông báo và nhắc nhở
- Tích hợp với các dịch vụ bên thứ ba (kế toán, CRM, v.v.)
- Ứng dụng di động cho quản lý doanh nghiệp
