import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import all from "./routes/auth.routes.js";
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

app.use("/api/auth", all);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
