import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";

dotenv.config();

const app = express();

// =============================
// Middleware
// =============================
app.use(cors());
app.use(express.json());

// =============================
// Database Connection
// =============================
connectDB();

// =============================
// API Routes
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/attempts", attemptRoutes);

// =============================
// Test Route
// =============================
app.get("/", (req, res) => {
  res.send("🚀 Quiz App API Running Successfully");
});

// =============================
// Server Start
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});