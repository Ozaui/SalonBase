const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const appointmentRoutes = require("./routes/appointments");
const serviceRoutes = require("./routes/services");

const app = express();

// Trust proxy for Vercel (rate-limit için gerekli)
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// --- CORS configuration (gelişmiş) ---
const allowedOrigins = [
  "https://salon-base.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});
// --- CORS sonu ---

// Rate limiting (Vercel uyumlu)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SalonBase API is running",
    timestamp: new Date().toISOString(),
  });
});

// Temporary seed endpoint (remove after seeding)
app.get("/api/seed", async (req, res) => {
  try {
    const { seedData } = require("./scripts/seed");
    await seedData();
    res.json({
      success: true,
      message: "Database seeded successfully!",
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to seed database",
      error: error.message,
    });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/services", serviceRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      error: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Database connection (Vercel uyumlu, minimal options)
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/salonbase")
  .then((conn) => {
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

module.exports = app;
