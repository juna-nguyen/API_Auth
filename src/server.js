const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.routes.js");
const setupSwagger = require("./config/swagger.js");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
connectDB();

const allowedOrigins = [
  "http://localhost:3002",

  "https://fe-auth-ngoctramnek.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép request không có origin (như Postman hoặc mobile app) hoặc nằm trong danh sách cho phép
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
