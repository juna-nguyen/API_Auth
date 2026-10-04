const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.routes.js");
const setupSwagger = require("./config/swagger.js");
const cors = require("cors");

const app = express();

app.use(express.json());
connectDB();

const allowedOrigins = [
  "http://localhost:3000",

  "https://fe-auth-ngoctramnek.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép request không có Origin
      // Ví dụ: Postman, Swagger, server-to-server
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
  console.log(
    `Server running at http://localhost:${PORT}\nSwagger docs available at http://localhost:${PORT}/api-docs`,
  ),
);
