import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import setupSwagger from "./config/swagger.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
connectDB();

const allowedOrigins = [
  "http://localhost:3002",
  // Vercel frontend
  "https://fe-crud-user-omega.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép request không có Origin (Postman, Swagger, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  }),
);

// Swagger Documentation Route
setupSwagger(app);

// API Routes
app.use("/api/auth", authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Lỗi Server Nội Bộ",
    error: err.name || "ServerError",
    statusCode: err.statusCode || 500,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}\nSwagger docs available at http://localhost:${PORT}/api-docs`),
);
