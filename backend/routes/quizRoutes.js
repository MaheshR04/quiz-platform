import express from "express";
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  startQuiz,
  submitQuiz,
  getLeaderboard,
  updateQuiz,
  deleteQuiz
} from "../controllers/quizController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create quiz
router.post("/create", protect, createQuiz);

// Get all quizzes
router.get("/", protect, getQuizzes);

// Leaderboard (must be before :id)
router.get("/leaderboard/:quizId", protect, getLeaderboard);

// Start quiz
router.post("/start/:quizId", protect, startQuiz);

// Submit quiz
router.post("/submit", protect, submitQuiz);

// Get single quiz
router.get("/:id", protect, getQuizById);

// Update quiz
router.put("/:id", protect, updateQuiz);

// Delete quiz
router.delete("/:id", protect, deleteQuiz);

export default router;