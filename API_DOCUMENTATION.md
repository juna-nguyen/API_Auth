# Tài liệu API & Tích hợp Frontend (API Auth)

Tài liệu chi tiết toàn bộ các API endpoint, payload, response (thành công & lỗi) và hướng dẫn tích hợp dành cho Frontend (FE).

---

## 1. Thông tin chung (General Information)

- **Base URL (Local)**: `http://localhost:3001`
- **Base URL (Production)**: `https://api-auth-sjc4.onrender.com`
- **Swagger UI**: `/api-docs` (Ví dụ: `http://localhost:3001/api-docs`)
- **OpenAPI JSON**: `/api-docs.json`
- **Default Headers cho request gửi JSON**:
  ```http
  Content-Type: application/json
  ```
- **Cơ chế xác thực (Authentication)**:
  - Sử dụng **JWT (JSON Web Token)** với thời hạn hết hạn là **1 ngày** (`1d`).
  - Gửi token qua header:
    ```http
    Authorization: Bearer <access_token>
    ```

---

## 2. Cấu trúc dữ liệu chung (Data Models)

### 2.1. Đối tượng người dùng (`User`)
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string; // ISO 8601 string (VD: "2026-09-24T08:30:00.000Z")
  updatedAt: string; // ISO 8601 string
}
```

### 2.2. Cấu trúc Response lỗi chung (`ErrorResponse`)
Tất cả các lỗi trả về đều có định dạng chuẩn:
```typescript
interface ApiErrorResponse {
  message: string;
  error: string; // "BadRequest" | "Unauthorized" | "Forbidden" | "NotFound" | "Conflict" | "ServerError"
  statusCode: number;
}
```

---

## 3. Danh sách các API Endpoints

| STT | Phương thức | Endpoint | Yêu cầu Auth | Role | Mô tả |
|---|---|---|---|---|---|
| 1 | `POST` | `/api/auth/register` | Không | All | Đăng ký tài khoản mới |
| 2 | `POST` | `/api/auth/login` | Không | All | Đăng nhập lấy JWT Token |
| 3 | `GET` | `/api/auth/me` | Có (Bearer Token) | All | Lấy thông tin tài khoản hiện tại |
| 4 | `PUT` | `/api/auth/change-password` | Có (Bearer Token) | All | Đổi mật khẩu tài khoản |
| 5 | `POST` | `/api/auth/logout` | Không bắt buộc | All | Đăng xuất tài khoản |
| 6 | `GET` | `/api/auth/admin/dashboard` | Có (Bearer Token) | `admin` | Lấy dữ liệu quản trị (Admin Dashboard) |

---

## 4. Chi tiết từng Route

### 4.1. Đăng ký tài khoản (`POST /api/auth/register`)

- **Mục đích**: Đăng ký một tài khoản người dùng mới (mặc định role là `user`).
- **Headers**:
  ```http
  Content-Type: application/json
  ```

- **Request Body**:
  ```json
  {
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
  *Quy tắc validate:*
  - `name`: bắt buộc (String, trim khoảng trắng).
  - `email`: bắt buộc, định dạng email (tự động lowercase + trim).
  - `password`: bắt buộc, tối thiểu 6 ký tự.

- **Response thành công (`201 Created`)**:
  ```json
  {
    "message": "Đăng ký thành công",
    "user": {
      "_id": "6790a1b2c3d4e5f6a7b8c9d0",
      "name": "Nguyen Van A",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2026-09-24T08:30:00.000Z",
      "updatedAt": "2026-09-24T08:30:00.000Z"
    }
  }
  ```

- **Response lỗi**:
  - `400 Bad Request` (Thiếu thông tin bắt buộc):
    ```json
    {
      "message": "Name, email và password là bắt buộc",
      "error": "BadRequest",
      "statusCode": 400
    }
    ```
  - `400 Bad Request` (Password quá ngắn):
    ```json
    {
      "message": "Password phải có ít nhất 6 ký tự",
      "error": "BadRequest",
      "statusCode": 400
    }
    ```
  - `409 Conflict` (Email đã tồn tại):
    ```json
    {
      "message": "Email đã được đăng ký",
      "error": "Conflict",
      "statusCode": 409
    }
    ```

---

### 4.2. Đăng nhập (`POST /api/auth/login`)

- **Mục đích**: Xác thực người dùng, trả về thông tin user và access token.
- **Headers**:
  ```http
  Content-Type: application/json
  ```

- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **Response thành công (`200 OK`)**:
  ```json
  {
    "message": "Đăng nhập thành công",
    "user": {
      "_id": "6790a1b2c3d4e5f6a7b8c9d0",
      "name": "Nguyen Van A",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2026-09-24T08:30:00.000Z",
      "updatedAt": "2026-09-24T08:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N...fQ.abc123xyz...",
    "expiresIn": "1d"
  }
  ```

- **Response lỗi**:
  - `400 Bad Request` (Thiếu email hoặc mật khẩu):
    ```json
    {
      "message": "Email và password là bắt buộc",
      "error": "BadRequest",
      "statusCode": 400
    }
    ```
  - `401 Unauthorized` (Sai email hoặc mật khẩu):
    ```json
    {
      "message": "Email hoặc mật khẩu không đúng",
      "error": "Unauthorized",
      "statusCode": 401
    }
    ```

---

### 4.3. Lấy thông tin cá nhân (`GET /api/auth/me`)

- **Mục đích**: Lấy dữ liệu profile của người dùng đang đăng nhập dựa trên token.
- **Headers**:
  ```http
  Authorization: Bearer <access_token>
  ```

- **Request Body**: *Không có*

- **Response thành công (`200 OK`)**:
  ```json
  {
    "message": "Lấy thông tin thành công",
    "user": {
      "_id": "6790a1b2c3d4e5f6a7b8c9d0",
      "name": "Nguyen Van A",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2026-09-24T08:30:00.000Z",
      "updatedAt": "2026-09-24T08:30:00.000Z"
    }
  }
  ```

- **Response lỗi**:
  - `401 Unauthorized` (Không gửi token):
    ```json
    {
      "message": "Không tìm thấy token",
      "error": "Unauthorized",
      "statusCode": 401
    }
    ```
  - `401 Unauthorized` (Token hết hạn hoặc không hợp lệ):
    ```json
    {
      "message": "Token không hợp lệ hoặc đã hết hạn",
      "error": "Unauthorized",
      "statusCode": 401
    }
    ```
  - `404 Not Found` (Người dùng không còn tồn tại trong DB):
    ```json
    {
      "message": "Không tìm thấy người dùng",
      "error": "NotFound",
      "statusCode": 404
    }
    ```

---

### 4.4. Đổi mật khẩu (`PUT /api/auth/change-password`)

- **Mục đích**: Thay đổi mật khẩu người dùng hiện tại.
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer <access_token>
  ```

- **Request Body**:
  ```json
  {
    "oldPassword": "password123",
    "newPassword": "newSecretPassword123"
  }
  ```
  *Quy tắc validate:*
  - `oldPassword`: bắt buộc.
  - `newPassword`: bắt buộc, tối thiểu 6 ký tự.

- **Response thành công (`200 OK`)**:
  ```json
  {
    "message": "Đổi mật khẩu thành công"
  }
  ```

- **Response lỗi**:
  - `400 Bad Request` (Thiếu field):
    ```json
    {
      "message": "oldPassword và newPassword là bắt buộc",
      "error": "BadRequest",
      "statusCode": 400
    }
    ```
  - `400 Bad Request` (Mật khẩu mới ngắn hơn 6 ký tự):
    ```json
    {
      "message": "Password mới phải có ít nhất 6 ký tự",
      "error": "BadRequest",
      "statusCode": 400
    }
    ```
  - `401 Unauthorized` (Mật khẩu hiện tại không chính xác):
    ```json
    {
      "message": "Mật khẩu hiện tại không đúng",
      "error": "Unauthorized",
      "statusCode": 401
    }
    ```
  - `401 Unauthorized` (Không có token / token không hợp lệ):
    ```json
    {
      "message": "Token không hợp lệ hoặc đã hết hạn",
      "error": "Unauthorized",
      "statusCode": 401
    }
    ```
  - `404 Not Found` (Người dùng không tồn tại):
    ```json
    {
      "message": "Không tìm thấy người dùng",
      "error": "NotFound",
      "statusCode": 404
    }
    ```

---

### 4.5. Đăng xuất (`POST /api/auth/logout`)

- **Mục đích**: Thông báo đăng xuất tài khoản.
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body**: *Không có*

- **Response thành công (`200 OK`)**:
  ```json
  {
    "message": "Đăng xuất thành công"
  }
  ```
  *Lưu ý cho FE:* Phía client cần chủ động xóa token đã lưu (trong `localStorage`, `sessionStorage` hoặc Cookie/State).

---

### 4.6. Admin Dashboard (`GET /api/auth/admin/dashboard`)

- **Mục đích**: Trang quản trị kiểm tra phân quyền (Chỉ tài khoản có `role === "admin"` mới được truy cập).
- **Headers**:
  ```http
  Authorization: Bearer <access_token>
  ```

- **Request Body**: *Không có*

- **Response thành công (`200 OK`)**:
  ```json
  {
    "message": "Chào mừng Admin. Đây là dữ liệu tuyệt mật."
  }
  ```

- **Response lỗi**:
  - `401 Unauthorized` (Chưa gửi token hoặc token không hợp lệ):
    ```json
    {
      "message": "Không tìm thấy token",
      "error": "Unauthorized",
      "statusCode": 401
    }
    ```
  - `403 Forbidden` (User không có quyền `admin`):
    ```json
    {
      "message": "Bạn không có quyền truy cập",
      "error": "Forbidden",
      "statusCode": 403
    }
    ```

---

## 5. Hướng dẫn tích hợp cho Frontend (Code mẫu)

### 5.1. Axios Client Instance với Interceptor
```typescript
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Gắn token vào Authorization Header cho mỗi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi tập trung (VD: token hết hạn -> redirect login)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      // Có thể chuyển hướng về /login nếu cần
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;
```

### 5.2. Các hàm gọi API (Auth Service)
```typescript
import apiClient from "./apiClient";

export const authApi = {
  // Đăng ký
  register: async (payload: { name: string; email: string; password: string }) => {
    const res = await apiClient.post("/api/auth/register", payload);
    return res.data;
  },

  // Đăng nhập
  login: async (payload: { email: string; password: string }) => {
    const res = await apiClient.post("/api/auth/login", payload);
    return res.data;
  },

  // Lấy user profile
  getMe: async () => {
    const res = await apiClient.get("/api/auth/me");
    return res.data;
  },

  // Đổi mật khẩu
  changePassword: async (payload: { oldPassword: string; newPassword: string }) => {
    const res = await apiClient.put("/api/auth/change-password", payload);
    return res.data;
  },

  // Đăng xuất
  logout: async () => {
    const res = await apiClient.post("/api/auth/logout");
    return res.data;
  },

  // Admin Dashboard
  getAdminDashboard: async () => {
    const res = await apiClient.get("/api/auth/admin/dashboard");
    return res.data;
  },
};
```
