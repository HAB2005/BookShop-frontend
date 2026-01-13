# SOMS Frontend Setup Guide

## Trạng thái hiện tại
✅ Cấu trúc thư mục đã hoàn thành
✅ Dependencies đã được cài đặt
✅ Ứng dụng đang chạy thành công
✅ React Router warnings đã được fix

## Cách test ứng dụng

### 1. Khởi động Backend (Spring Boot)
Trước tiên, đảm bảo backend đang chạy:
```bash
cd system-backend
./mvnw spring-boot:run
```
Backend sẽ chạy tại: `http://localhost:8080`

### 2. Khởi động Frontend (React)
```bash
cd SOMS-frontend
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

### 3. Test Authentication Flow

#### Đăng ký tài khoản mới:
1. Truy cập `http://localhost:5173`
2. Sẽ tự động redirect đến `/login`
3. Click "Register here"
4. Điền thông tin:
   - Username: `testuser`
   - Password: `123456`
   - Confirm Password: `123456`
5. Click "Register"

#### Đăng nhập:
1. Truy cập `/login`
2. Điền thông tin:
   - Username: `testuser`
   - Password: `123456`
3. Click "Login"
4. Sẽ redirect đến Dashboard

### 4. Test các tính năng

#### Customer Role:
- ✅ Dashboard: Xem thống kê cơ bản
- ✅ Profile: Xem/chỉnh sửa thông tin cá nhân
- ✅ Change Password: Đổi mật khẩu
- ✅ Products: Trang placeholder
- ✅ Orders: Trang placeholder

#### Admin Role:
Để test admin, cần tạo user admin từ database hoặc backend:
- ✅ Admin Dashboard: Quản lý hệ thống
- ✅ User Management: Quản lý người dùng
- ✅ Tất cả tính năng của Customer

### 5. Test API Integration

#### Kiểm tra Network Tab:
1. Mở Developer Tools (F12)
2. Tab Network
3. Thực hiện login/register
4. Kiểm tra các API calls:
   - `POST /api/auth/login`
   - `POST /api/auth/register`
   - `GET /api/user/profile`
   - `POST /api/auth/logout`

#### Kiểm tra JWT Token:
1. Login thành công
2. Mở Developer Tools > Application > Local Storage
3. Kiểm tra `token` được lưu
4. Logout và kiểm tra token bị xóa

### 6. Test Responsive Design
- Desktop: ✅ Full layout với sidebar
- Mobile: ✅ Responsive design
- Tablet: ✅ Adaptive layout

## Các tính năng đã implement

### ✅ Hoàn thành:
- Authentication & Authorization
- JWT Token Management
- Protected Routes
- Role-based Access Control
- User Profile Management
- Admin User Management
- Responsive Layout
- Error Handling
- Loading States
- Toast Notifications

### 🚧 Placeholder (sẵn sàng để phát triển):
- Product Management
- Order Management
- Advanced Search & Filtering
- File Upload
- Real-time Notifications

## Troubleshooting

### Lỗi CORS:
Nếu gặp lỗi CORS, kiểm tra backend CorsConfig.java

### Lỗi 401 Unauthorized:
- Kiểm tra JWT token trong localStorage
- Kiểm tra backend có chạy không
- Kiểm tra API endpoint

### Lỗi Network:
- Kiểm tra backend đang chạy tại port 8080
- Kiểm tra .env file có đúng API_BASE_URL không

## Next Steps

1. **Implement Product Module:**
   - Product CRUD operations
   - Product search & filtering
   - Image upload

2. **Implement Order Module:**
   - Order creation & management
   - Order status tracking
   - Order history

3. **Enhanced Features:**
   - Real-time notifications
   - Advanced reporting
   - Bulk operations
   - Export functionality