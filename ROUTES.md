# Tài liệu Routes

Tổng hợp tất cả các route trang (Next.js App Router) và API kèm ghi chú chức năng ngắn gọn.

## Mục lục
- Web Routes
  - Trang gốc
  - Auth
  - Dashboard
  - Enterprise
  - Shop
- API Routes

---

## Web Routes

### Trang gốc
- `/` — Trang chủ ứng dụng.

### Auth
- `/auth/login` — Đăng nhập người dùng.

### Dashboard (tổng quan hệ thống)
- `/dashboard` — Tổng quan hệ thống: thẻ thống kê, biểu đồ, hoạt động gần đây, sức khỏe hệ thống.
- `/dashboard/audit` — Nhật ký và thống kê audit (theo dõi hành vi hệ thống/người dùng).
- `/dashboard/business-types` — Quản lý loại hình doanh nghiệp.
- `/dashboard/currencies` — Quản lý tiền tệ, tỉ giá.
- `/dashboard/enterprises` — Danh sách/quản trị doanh nghiệp.
- `/dashboard/monitoring` — Giám sát bảo mật/đăng nhập/sự kiện.
- `/dashboard/notifications` — Quản lý thông báo và cấu hình.
- `/dashboard/reports` — Tổng hợp báo cáo, truy cập nhanh các báo cáo hệ thống.
- `/dashboard/roles` — Phân quyền và vai trò người dùng.
- `/dashboard/server` — Theo dõi server (logs, metrics).
- `/dashboard/settings` — Cài đặt hệ thống chung.
- `/dashboard/subscriptions` — Gói dịch vụ/đăng ký sử dụng.
- `/dashboard/users` — Quản lý người dùng.

### Enterprise (quản trị doanh nghiệp)
- `/enterprise/login` — Đăng nhập khu vực doanh nghiệp.
- `/enterprise/dashboard` — Dashboard doanh nghiệp: thống kê kinh doanh/nội bộ.

Tài chính
- `/enterprise/finance/invoices` — Hóa đơn/chứng từ.
- `/enterprise/finance/payroll` — Lương, bảng lương.
- `/enterprise/finance/reports` — Báo cáo tài chính.
- `/enterprise/finance/transactions` — Giao dịch thu/chi.

Nhân sự (HR)
- `/enterprise/hr/attendance` — Chấm công/giờ làm.
- `/enterprise/hr/departments` — Phòng ban/cơ cấu tổ chức.
- `/enterprise/hr/employees` — Quản lý nhân viên/hồ sơ.
- `/enterprise/hr/recruitment` — Tuyển dụng/vị trí ứng tuyển.

Kho (Inventory)
- `/enterprise/inventory/check` — Kiểm kê tồn kho.
- `/enterprise/inventory/export` — Xuất kho.
- `/enterprise/inventory/import` — Nhập kho.
- `/enterprise/inventory/reports` — Báo cáo kho.
- `/enterprise/inventory/stock` — Tồn kho hiện tại.

Báo cáo
- `/enterprise/reports` — Trung tâm báo cáo doanh nghiệp.
- `/enterprise/reports/overview` — Tổng quan báo cáo.

Bán hàng (Sales)
- `/enterprise/sales/customers` — Khách hàng.
- `/enterprise/sales/orders` — Đơn hàng.
- `/enterprise/sales/promotions` — Khuyến mãi.
- `/enterprise/sales/reports` — Báo cáo bán hàng.

Cài đặt
- `/enterprise/settings/general` — Cài đặt chung doanh nghiệp.

### Shop
Tổng quan
- `/shop` — Trang chính khu vực Shop.

Billiards
- `/shop/billiards` — Tổng quan khu vực billiards.
- `/shop/billiards/billing` — Tính giờ/tính tiền bàn.
- `/shop/billiards/history` — Lịch sử sử dụng/billing billiards.
- `/shop/billiards/menu` — Menu dịch vụ/sản phẩm kèm billiards.
- `/shop/billiards/reports` — Báo cáo hoạt động billiards.

Cafe
- `/shop/cafe` — Tổng quan khu vực cafe.
- `/shop/cafe/billing` — Tính tiền/hoá đơn khu vực cafe.
- `/shop/cafe/menu` — Quản lý menu đồ uống/đồ ăn.
- `/shop/cafe/orders` — Đơn hàng gọi món.
- `/shop/cafe/reports` — Báo cáo hoạt động cafe.

Giỏ hàng & thanh toán
- `/shop/cart` — Giỏ hàng.
- `/shop/checkout` — Thanh toán.

Shop-Enterprise
- `/shop/enterprise/dashboard` — Dashboard cho doanh nghiệp trong hệ shop.
- `/shop/enterprise/register` — Đăng ký doanh nghiệp.

Hàng hóa & tồn kho
- `/shop/inventory` — Tổng quan tồn kho shop.
- `/shop/inventory/export` — Xuất kho.
- `/shop/inventory/import` — Nhập kho.
- `/shop/inventory/reports` — Báo cáo kho.
- `/shop/inventory/stocktake` — Kiểm kê tồn kho.

Tuyển dụng
- `/shop/jobs` — Danh sách công việc.
- `/shop/jobs/applications` — Ứng tuyển/đơn ứng tuyển.

Đơn hàng
- `/shop/orders` — Danh sách đơn hàng.
- `/shop/orders/[id]` — Chi tiết đơn hàng theo ID (route động).

POS (Điểm bán)
- `/shop/pos` — Điểm bán hàng.
- `/shop/pos/customers` — Khách hàng POS.
- `/shop/pos/invoices` — Hóa đơn POS.
- `/shop/pos/promotions` — Khuyến mãi tại POS.
- `/shop/pos/sales` — Bán hàng POS.

Khác
- `/shop/products` — Danh mục sản phẩm.
- `/shop/profile` — Hồ sơ người dùng shop.
- `/shop/reviews` — Đánh giá sản phẩm/dịch vụ.
- `/shop/wishlist` — Danh sách yêu thích.

Workspace
- `/shop/workspace` — Không gian làm việc.
- `/shop/workspace/calendar` — Lịch làm việc/sự kiện.
- `/shop/workspace/documents` — Tài liệu/chia sẻ file.
- `/shop/workspace/employees` — Nhân sự nội bộ workspace.
- `/shop/workspace/messages` — Tin nhắn/liên lạc nội bộ.
- `/shop/workspace/reports` — Báo cáo theo team/workspace.
- `/shop/workspace/tasks` — Nhiệm vụ/công việc.

---

## API Routes

Currencies
- `GET /api/currencies` — Lấy danh sách tiền tệ (hỗ trợ tham số search, isActive).
- `POST /api/currencies` — Tạo tiền tệ mới (đảm bảo base currency duy nhất, nếu isBaseCurrency thì rate=1).

Currency by ID
- `GET /api/currencies/[id]` — Lấy chi tiết tiền tệ theo ID.
- `PUT /api/currencies/[id]` — Cập nhật thông tin tiền tệ (nếu đặt isBaseCurrency thì auto rate=1 và vô hiệu base khác).
- `DELETE /api/currencies/[id]` — Xóa tiền tệ (không cho phép xóa base currency).

Exchange Rate History
- `GET /api/currencies/history` — Lịch sử tỉ giá (lọc theo currencyCode, startDate, endDate; sort, limit).
- `POST /api/currencies/history` — Thêm bản ghi lịch sử tỉ giá.

---

Ghi chú
- Các route trang được suy ra từ cấu trúc thư mục `app/**/page.tsx`.
- Các route động sử dụng tham số trong dấu ngoặc, ví dụ: `/shop/orders/[id]`.
- Danh sách trên phản ánh trạng thái hiện tại của mã nguồn trong thư mục `app/` và `app/api/`.
