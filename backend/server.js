import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors()); // enable CORS for frontend requests

// database connection
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Quiz App API Running");
});

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});