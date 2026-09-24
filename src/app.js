const express = require("express");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Lỗi Server Nội Bộ",
    error: err.name || "ServerError",
    statusCode: err.statusCode || 500,
  });
});

module.exports = app;
