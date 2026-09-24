# BỘ PROMPT AI THIẾT KẾ GIAO DIỆN (UI/UX) CHO HỆ THỐNG API AUTH

Tài liệu này chứa các prompt được chuẩn hoá, chi tiết và tối ưu để đưa vào các công cụ AI như **v0.dev, Bolt.new, Lovable, Cursor, ChatGPT, Claude, Figma AI, Midjourney** nhằm tạo giao diện người dùng (Frontend Web App) tích hợp hoàn chỉnh với backend API hiện tại.

---

## 1. TỔNG QUAN HỆ THỐNG VÀ LUỒNG DỮ LIỆU

### Danh sách Endpoint API sẵn có:

- `POST /api/auth/register` - Đăng ký tài khoản mới (`name`, `email`, `password`)
- `POST /api/auth/login` - Đăng nhập nhận JWT Token (`email`, `password`)
- `GET /api/auth/me` - Lấy thông tin user hiện tại (`Bearer Token`)
- `PUT /api/auth/change-password` - Đổi mật khẩu (`oldPassword`, `newPassword`)
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/admin/dashboard` - Dashboard quản trị viên (`role: admin`)

### Tech-stack Frontend khuyến nghị:

- **Framework**: React.js / Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI + Lucide React Icons
- **State & API**: Axios/Fetch + React Query / Zustand + React Hook Form + Zod

---

## 2. MASTER PROMPT (Dành cho v0.dev / Bolt.new / Lovable / Cursor)

> **Hướng dẫn sử dụng:** Copy toàn bộ prompt dưới đây dán vào `v0.dev`, `bolt.new`, `lovable.dev` hoặc AI Assistant (Claude 3.5 Sonnet / GPT-4o) để tạo trọn bộ ứng dụng Frontend.

```text
Build a modern, production-ready Fullstack/Frontend Web Application for an Authentication & Authorization System using Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI components, and Lucide Icons.

### Design Style & Theme:
- Modern SaaS look, clean aesthetics, subtle gradients, soft borders, glassmorphism accents.
- Responsive layout (Mobile-first, Tablet, Desktop).
- Support Dark Mode and Light Mode toggling.
- High contrast, accessible form inputs, clear validation error states, smooth loading skeletons, and interactive toast notifications (Sonner/Toast).

### Color Palette:
- Primary: Indigo/Violet (#6366F1 / #4F46E5)
- Secondary/Accent: Emerald (#10B981) for success, Rose (#F43F5E) for errors
- Neutral: Slate/Zinc neutral tones for background and surface cards

### App Structure & Pages:
1. /login: Clean login card with email, password, toggle password visibility, "Remember me", link to Register, inline error messages, and loading spinners.
2. /register: Registration card with name, email, password (with real-time password strength meter), password confirmation, terms acceptance, and redirect link to Login.
3. /profile (User Dashboard):
   - User profile card displaying Name, Email, Role badge (User/Admin), Account creation date, and Avatar placeholder with initials.
   - "Change Password" tab/card: Form with old password, new password, confirmation, and strength meter.
   - Activity/Session status, and "Logout" button with confirmation modal.
4. /admin/dashboard (Admin Protected View):
   - Top navbar with user info and switch between user/admin view.
   - Metrics cards (Total Users, Active Sessions, Security Alerts, Growth Rate).
   - User management data table with search, role filters (User/Admin), status badges, and action dropdowns (Edit Role, Deactivate, View Details).
   - System log / recent login activity feed.

### API Integration Specs:
- Base URL: http://localhost:3001/api/auth (or production URL: https://api-auth-sjc4.onrender.com/api/auth)
- Endpoints:
  * POST /register { name, email, password }
  * POST /login { email, password } -> returns { message, user: { _id, name, email, role }, token }
  * GET /me (Headers: Authorization: Bearer <token>)
  * PUT /change-password { oldPassword, newPassword } (Headers: Authorization: Bearer <token>)
  * POST /logout (Headers: Authorization: Bearer <token>)
  * GET /admin/dashboard (Requires role == "admin")

### State Management & Guards:
- Save JWT token to HttpOnly Cookie or Secure LocalStorage.
- Auth Provider context with login, logout, user, and role-checking state.
- Route protection middleware (redirect unauthenticated users to /login, and non-admins from /admin to /profile with an unauthorized toast warning).

Provide complete, cleanly structured, production-grade components.
```

---

## 3. PROMPT CHI TIẾT THEO TỪNG MÀN HÌNH

### 3.1. Màn hình Đăng nhập (`/login`)

```text
Design a high-converting, modern Login page component using React, Tailwind CSS, Lucide React, and Shadcn UI.

Features:
- Split screen or centered elegant glassmorphism card.
- Left/Background: Subtle modern gradient or abstract tech pattern with a hero tagline "Secure Access to Your Workspace".
- Form fields:
  * Email input with mail icon and autofocus.
  * Password input with lock icon and show/hide password toggle.
  * "Remember me" checkbox and "Forgot password?" link.
  * Submit button with hover effect and loading state ("Signing in...").
- Social login placeholder buttons (Google, GitHub).
- Footer text: "Don't have an account? Sign up".
- Validation with Zod (valid email format, password required >= 6 chars) and toast notifications for invalid credentials (401) or missing fields (400).
```

### 3.2. Màn hình Đăng ký (`/register`)

```text
Design a sleek User Registration page component using React, Tailwind CSS, and Shadcn UI.

Features:
- Card container with logo and welcome header: "Create your account".
- Form fields:
  * Full Name (user icon, trim whitespace).
  * Email address (email icon, checks valid format).
  * Password (with real-time password strength meter: Weak/Medium/Strong based on length and complexity).
  * Confirm Password (must match password).
  * "I agree to Terms & Conditions" checkbox.
- Submit button with dynamic loading state.
- Error alerts for email conflict (409 Conflict) and input validation errors.
- Footer: "Already have an account? Log in".
```

### 3.3. Màn hình Profile & Đổi mật khẩu (`/profile`)

```text
Design a comprehensive User Profile & Settings dashboard view in React + Tailwind CSS.

Components:
1. Header Bar: Breadcrumbs, user greeting, notifications bell, Dark Mode switch, and user dropdown avatar.
2. Profile Summary Card:
   - Avatar with initials generator or image upload trigger.
   - User details: Full Name, Email, Role badge (Green for User, Purple for Admin with crown icon), Member since formatted date (createdAt).
   - "Edit Profile" modal button.
3. Security & Password Tab:
   - Form for "Change Password": Old Password, New Password (min 6 chars), Confirm New Password.
   - Helper guidelines for a secure password.
   - "Update Password" button with loading spinner and success toast on 200 OK.
4. Danger Zone:
   - "Log Out of All Devices" / "Sign Out" button with confirmation alert dialog.
```

### 3.4. Màn hình Admin Dashboard (`/admin/dashboard`)

```text
Design a professional Admin Dashboard page for role-based authentication management using React, Tailwind CSS, Lucide Icons, and Recharts/Shadcn UI.

Components:
1. Top KPI Stat Cards:
   - Total Registered Users (+ percentage trend badge).
   - Active Users today.
   - Admin Accounts count.
   - API Health / System Status (Online indicator).
2. User Management Table:
   - Search bar by name or email + Role filter dropdown (All, Admin, User).
   - Columns: User (Avatar + Name + Email), Role (Badge), Joined Date, Status (Active/Inactive), Actions (Edit, Delete, Change Role).
   - Pagination and rows-per-page selector.
3. Access Control Banner:
   - If current user role is not "admin", display a 403 Forbidden Access denied screen with button "Return to Profile".
4. Recent Security Logs / Activity Feed:
   - Timestamped list of recent logins, password changes, and new registrations.
```

---

## 4. PROMPT TẠO ẢNH MOCKUP / CONCEPT UI (Midjourney / DALL-E 3)

### Prompt cho Midjourney v6:

```text
Modern web app dashboard UI for a user authentication and management platform, clean SaaS design system, dark mode with vibrant indigo and violet neon accents, glassmorphism cards, user profile widgets, login stats, beautiful typography, UI/UX design, Figma showcase style, 8k resolution, award-winning UI on Dribbble and Behance --ar 16:9 --v 6.0
```

### Prompt cho DALL-E 3:

```text
A sleek, modern desktop web UI design for a SaaS user authentication dashboard. The screen displays a minimalist layout with a dark theme, deep slate background, glowing indigo buttons, a user profile card showing name and role badge, an analytics card, and a change password modal. Professional Figma mockup style, clean typography, hyper-detailed UI/UX.
```

---

## 5. PROMPT CHO FIGMA AI / PROTOTYPING

```text
Create a comprehensive UI Design System & Wireframe in Figma for an Auth & RBAC (Role-Based Access Control) Web Application:

1. Color Styles:
   - Background: #0F172A (Dark), #F8FAFC (Light)
   - Primary: #6366F1 (Indigo-500), Hover: #4F46E5 (Indigo-600)
   - Success: #10B981, Danger: #EF4444, Warning: #F59E0B
   - Text: #F1F5F9 (Heading), #94A3B8 (Subtext)

2. Typography Scale:
   - Font Family: Inter or Plus Jakarta Sans
   - H1: 32px / Bold, H2: 24px / SemiBold, Body: 14px / Regular, Caption: 12px / Medium

3. Components & Variants:
   - Button (Primary, Secondary, Outline, Danger, Ghost; States: Default, Hover, Focused, Loading, Disabled)
   - Input Field (Default, Filled, Error, Disabled, Password with Eye toggle)
   - Role Badges (Admin: Purple filled, User: Emerald outline)
   - Modal Dialog & Toast Notifications

4. Screens to generate:
   - Auth - Sign In & Sign Up (Desktop 1440px & Mobile 390px)
   - User - Profile & Change Password (Desktop & Mobile)
   - Admin - User Management & Overview Dashboard (Desktop)
```

---

## 6. HƯỚNG DẪN TÍCH HỢP FRONTEND VỚI BACKEND

Khi sử dụng code UI do AI sinh ra, cấu hình file kết nối API như sau:

```typescript
// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động đính kèm Token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```
