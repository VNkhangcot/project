# Hướng dẫn sử dụng Giao diện Quản lý Doanh nghiệp

## Giới thiệu

Giao diện Quản lý Doanh nghiệp là một hệ thống toàn diện giúp doanh nghiệp quản lý hiệu quả các hoạt động kinh doanh, nhân sự, tài chính và kho hàng. Hệ thống được thiết kế với giao diện thân thiện, dễ sử dụng và đáp ứng đầy đủ nhu cầu quản lý của các loại hình doanh nghiệp khác nhau.

## Cách truy cập

1. Truy cập trang đăng nhập tại: `/enterprise/login`
2. Sử dụng một trong các tài khoản test được cung cấp trong file `TEST_ACCOUNTS.md`
3. Sau khi đăng nhập, bạn sẽ được chuyển đến trang Dashboard

## Cấu trúc hệ thống

Hệ thống Quản lý Doanh nghiệp bao gồm các module chính sau:

### 1. Dashboard

- Hiển thị tổng quan về hoạt động doanh nghiệp
- Thống kê doanh thu, nhân viên, phòng ban
- Hoạt động gần đây
- Biểu đồ phân tích dữ liệu

### 2. Quản lý Nhân sự

- **Phòng ban**: Quản lý cơ cấu tổ chức, thêm/sửa/xóa phòng ban
- **Nhân viên**: Quản lý thông tin nhân viên, hợp đồng, lương thưởng
- **Tuyển dụng**: Quản lý quy trình tuyển dụng, đăng tin tuyển dụng
- **Chấm công**: Theo dõi giờ làm việc, nghỉ phép của nhân viên

### 3. Quản lý Tài chính

- **Thu chi**: Quản lý các khoản thu chi của doanh nghiệp
- **Hóa đơn**: Quản lý hóa đơn, chứng từ
- **Lương thưởng**: Tính lương, thưởng cho nhân viên
- **Báo cáo tài chính**: Tạo báo cáo tài chính theo kỳ

### 4. Quản lý Kho hàng

- **Tồn kho**: Theo dõi số lượng hàng hóa trong kho
- **Nhập kho**: Quản lý nhập hàng, nhà cung cấp
- **Xuất kho**: Quản lý xuất hàng, đơn hàng
- **Kiểm kê**: Kiểm kê định kỳ, đối chiếu số liệu

### 5. Quản lý Bán hàng

- **Đơn hàng**: Quản lý đơn hàng, trạng thái đơn hàng
- **Khách hàng**: Quản lý thông tin khách hàng, lịch sử mua hàng
- **Khuyến mãi**: Tạo và quản lý các chương trình khuyến mãi
- **Báo cáo bán hàng**: Thống kê doanh số, sản phẩm bán chạy

### 6. Báo cáo

- Tạo báo cáo tổng hợp từ các module
- Xuất báo cáo dưới nhiều định dạng
- Phân tích dữ liệu kinh doanh

### 7. Cài đặt

- Cài đặt thông tin doanh nghiệp
- Quản lý người dùng và phân quyền
- Cài đặt hệ thống

## Chức năng chính

### Quản lý nhiều doanh nghiệp

Hệ thống cho phép quản lý nhiều doanh nghiệp cùng lúc, phù hợp với các tập đoàn hoặc người dùng sở hữu nhiều doanh nghiệp. Bạn có thể dễ dàng chuyển đổi giữa các doanh nghiệp thông qua dropdown ở thanh điều hướng.

### Phân quyền chi tiết

Hệ thống phân quyền chi tiết theo vai trò:
- **Admin**: Toàn quyền quản lý hệ thống
- **Chủ doanh nghiệp**: Quản lý doanh nghiệp của mình
- **Quản lý**: Quản lý phòng ban được phân công
- **Nhân viên**: Xem thông tin và cập nhật thông tin cá nhân

### Giao diện đáp ứng

Giao diện được thiết kế đáp ứng, hoạt động tốt trên cả máy tính và thiết bị di động, giúp người dùng có thể truy cập và quản lý doanh nghiệp mọi lúc, mọi nơi.

## Hướng dẫn sử dụng chi tiết

### Đăng nhập

1. Truy cập trang đăng nhập tại `/enterprise/login`
2. Nhập email và mật khẩu
3. Tùy chọn "Ghi nhớ đăng nhập" để duy trì phiên đăng nhập
4. Nhấn "Đăng nhập"

### Chuyển đổi doanh nghiệp

1. Nhấn vào dropdown "Chọn doanh nghiệp" ở thanh điều hướng
2. Chọn doanh nghiệp muốn quản lý từ danh sách

### Quản lý phòng ban

1. Truy cập menu "Quản lý nhân sự" > "Phòng ban"
2. Xem danh sách phòng ban hiện có
3. Nhấn "Thêm phòng ban" để tạo phòng ban mới
4. Nhấn vào tên phòng ban để xem chi tiết và chỉnh sửa

### Quản lý nhân viên

1. Truy cập menu "Quản lý nhân sự" > "Nhân viên"
2. Xem danh sách nhân viên hiện có
3. Sử dụng bộ lọc để tìm kiếm nhân viên theo phòng ban, vị trí
4. Nhấn "Thêm nhân viên" để thêm nhân viên mới
5. Nhấn vào tên nhân viên để xem chi tiết và chỉnh sửa

### Tạo báo cáo

1. Truy cập menu "Báo cáo"
2. Chọn loại báo cáo muốn tạo
3. Thiết lập các tham số báo cáo (khoảng thời gian, phòng ban, v.v.)
4. Nhấn "Tạo báo cáo"
5. Xem báo cáo và tải xuống nếu cần

## Yêu cầu hệ thống

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Kết nối internet ổn định
- JavaScript được bật

## Hỗ trợ

Nếu bạn gặp vấn đề hoặc cần hỗ trợ, vui lòng liên hệ:
- Email: support@example.com
- Hotline: 1900-xxxx
