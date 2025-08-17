const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173", // during local dev
  "https://books-library-management-app-2.onrender.com/api", // your deployed frontend
];
app.use(cors({
  origin: allowedOrigins, // frontend origin
 methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ===== Routes =====
const authRoutes = require("./routes/authRoutes");
const booksRoutes = require("./routes/booksRoutes");
const myBooksRoutes = require("./routes/myBooksRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/mybooks", myBooksRoutes);

// ===== Health Check =====
app.get("/ping", (req, res) => {
  res.send("pong");
});

module.exports = app;
