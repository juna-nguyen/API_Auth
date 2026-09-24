const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const authorizeRoles = require("../middleware/role.middleware.js");
const {
  register,
  login,
  googleLogin,
  getMe,
  changePassword,
  logout,
  googleLogin,
} = require("../controllers/auth.controller.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Các API đăng ký, đăng nhập và đăng xuất
 *   - name: User Profile
 *     description: Các API xem và cập nhật thông tin cá nhân
 *   - name: Admin
 *     description: Các API yêu cầu quyền quản trị viên (Admin)
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng ký thành công"
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Dữ liệu gửi lên không hợp lệ hoặc password < 6 ký tự
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingFields:
 *                 summary: Thiếu thông tin bắt buộc
 *                 value:
 *                   message: "Name, email và password là bắt buộc"
 *                   error: "BadRequest"
 *                   statusCode: 400
 *               shortPassword:
 *                 summary: Mật khẩu quá ngắn
 *                 value:
 *                   message: "Password phải có ít nhất 6 ký tự"
 *                   error: "BadRequest"
 *                   statusCode: 400
 *       409:
 *         description: Email đã tồn tại trong hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Email đã được đăng ký"
 *               error: "Conflict"
 *               statusCode: 409
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công và trả về JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng nhập thành công"
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 expiresIn:
 *                   type: string
 *                   example: "1d"
 *       400:
 *         description: Thiếu email hoặc password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Email và password là bắt buộc"
 *               error: "BadRequest"
 *               statusCode: 400
 *       401:
 *         description: Email hoặc mật khẩu không chính xác
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Email hoặc mật khẩu không đúng"
 *               error: "Unauthorized"
 *               statusCode: 401
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin tài khoản hiện tại
 *     tags: [User Profile]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin thành công"
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Không có token, token không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: Không tìm thấy token
 *                 value:
 *                   message: "Không tìm thấy token"
 *                   error: "Unauthorized"
 *                   statusCode: 401
 *               invalidToken:
 *                 summary: Token sai hoặc hết hạn
 *                 value:
 *                   message: "Token không hợp lệ hoặc đã hết hạn"
 *                   error: "Unauthorized"
 *                   statusCode: 401
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Không tìm thấy người dùng"
 *               error: "NotFound"
 *               statusCode: 404
 */
router.post("/google-login", googleLogin);
router.get("/me", authMiddleware, getMe);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Đổi mật khẩu tài khoản
 *     tags: [User Profile]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đổi mật khẩu thành công"
 *       400:
 *         description: Thiếu dữ liệu hoặc mật khẩu mới ít hơn 6 ký tự
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingFields:
 *                 summary: Thiếu oldPassword hoặc newPassword
 *                 value:
 *                   message: "oldPassword và newPassword là bắt buộc"
 *                   error: "BadRequest"
 *                   statusCode: 400
 *               shortPassword:
 *                 summary: Mật khẩu mới quá ngắn
 *                 value:
 *                   message: "Password mới phải có ít nhất 6 ký tự"
 *                   error: "BadRequest"
 *                   statusCode: 400
 *       401:
 *         description: Mật khẩu hiện tại không đúng hoặc chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Mật khẩu hiện tại không đúng"
 *               error: "Unauthorized"
 *               statusCode: 401
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Không tìm thấy người dùng"
 *               error: "NotFound"
 *               statusCode: 404
 */
router.put("/change-password", authMiddleware, changePassword);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất tài khoản
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng xuất thành công"
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/admin/dashboard:
 *   get:
 *     summary: Trang thông tin Dashboard Admin
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy dữ liệu quản trị thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chào mừng Admin. Đây là dữ liệu tuyệt mật."
 *       401:
 *         description: Chưa xác thực token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Không tìm thấy token"
 *               error: "Unauthorized"
 *               statusCode: 401
 *       403:
 *         description: Không có quyền truy cập (yêu cầu role admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Bạn không có quyền truy cập"
 *               error: "Forbidden"
 *               statusCode: 403
 */
router.get(
  "/admin/dashboard",
  authMiddleware,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Chào mừng Admin. Đây là dữ liệu tuyệt mật." });
  },
);

module.exports = router;
