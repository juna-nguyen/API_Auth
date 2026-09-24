const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API Authentication & Authorization",
      version: "1.0.0",
      description:
        "Tài liệu API Xác thực và Phân quyền người dùng (JWT, Role-based Access Control).",
    },
    servers: [
      {
        url: "/",
        description: "Development Server (Local)",
      },
      {
        url: "https://api-auth-sjc4.onrender.com",
        description: "Production Server (Render)",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Nhập JWT Token theo định dạng: Bearer <token>",
        },
      },
      schemas: {
        UserResponse: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6790a1b2c3d4e5f6a7b8c9d0" },
            name: { type: "string", example: "Nguyen Van A" },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-09-24T08:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-09-24T08:30:00.000Z",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Nguyen Van A" },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 6,
              example: "123456",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: { type: "string", format: "password", example: "123456" },
          },
        },
        ChangePasswordRequest: {
          type: "object",
          required: ["oldPassword", "newPassword"],
          properties: {
            oldPassword: {
              type: "string",
              format: "password",
              example: "123456",
            },
            newPassword: {
              type: "string",
              format: "password",
              minLength: 6,
              example: "newPassword123",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Có lỗi xảy ra" },
            error: { type: "string", example: "BadRequest" },
            statusCode: { type: "integer", example: 400 },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
