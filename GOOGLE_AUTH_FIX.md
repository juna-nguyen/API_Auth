# Báo Cáo Xử Lý Lỗi: Google Sign-In & Firebase Admin SDK

## 1. Hiện Tượng Lỗi

Khi người dùng thực hiện đăng nhập bằng Google ở Frontend:

```text
GoogleLoginButton.jsx:30 Google Sign-In Error:
{
  statusCode: 401,
  statusText: 'Unauthorized',
  message: 'Firebase ID Token không hợp lệ',
  error: 'Unauthorized'
}
```

Kèm theo log console ở Backend:

```text
[Firebase Warning] Không thể khởi tạo Firebase Admin: Cannot read properties of undefined (reading 'cert')
```

---

## 2. Nguyên Nhân Gốc Rễ (Root Cause)

### a. Thay đổi Breaking Change trong `firebase-admin` v14 (`^14.5.0`)

1. **Kiến trúc Modular mới:** Trong các phiên bản Firebase Admin mới (v13+ và v14+), thư viện đã chuyển sang dạng mô-đun hóa:
   - `admin.credential.cert(...)` không còn tồn tại trên root export `firebase-admin` $\rightarrow$ Gây lỗi `Cannot read properties of undefined (reading 'cert')`.
   - Cần import hàm `cert()` từ `firebase-admin/app`.
2. **Không có sẵn `admin.auth()`:** `firebase-admin/auth` được tách riêng, cần gọi `getAuth(app)` thay vì gọi `admin.auth()`.

### b. Xung đột Module & Cú pháp gọi hàm

- File `API_Auth/src/config/firebase.js` ban đầu dùng cú pháp ES Module (`import`/`export default`), trong khi toàn bộ dự án backend chạy bằng CommonJS (`require`).
- `auth.controller.js` gọi `admin.auth().verifyIdToken(idToken)` trong khi đối tượng export đã là `Auth` instance hoặc bị `undefined`.

---

## 3. Giải Pháp Khắc Phục (Đã Triển Khai)

### Bước 1: Tối giản hóa cấu hình Firebase Admin

Cập nhật file [`API_Auth/src/config/firebase.js`] theo đúng chuẩn Modular của `firebase-admin` v14:

```javascript
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(serviceAccount),
    });

module.exports = getAuth(app);
```

### Bước 2: Cập nhật hàm gọi Verify Token tại Controller

Cập nhật file [`API_Auth/src/controllers/auth.controller.js`]:

- **Import:**
  ```javascript
  const firebaseAuth = require("../config/firebase");
  ```
- **Xác thực Token trong hàm `googleLogin`:**
  ```javascript
  // Dùng trực tiếp instance getAuth
  decodedToken = await firebaseAuth.verifyIdToken(idToken);
  ```
