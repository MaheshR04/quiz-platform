import express from "express";

import {
  createQuiz,
  getQuizzes,
  getQuizById,
  startQuiz,
  submitQuiz,
  getLeaderboard,
  updateQuiz,
  deleteQuiz,
  getHistory
} from "../controllers/quizController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
==============================
ADMIN ROUTES
==============================
*/

// Create quiz (Admin only)
router.post("/create", protect, admin, createQuiz);

// Update quiz (Admin only)
router.put("/:id", protect, admin, updateQuiz);

// Delete quiz (Admin only)
router.delete("/:id", protect, admin, deleteQuiz);


/*
==============================
USER ROUTES
==============================
*/

// Get all quizzes
router.get("/", protect, getQuizzes);

// Leaderboard
router.get("/leaderboard/:quizId", protect, getLeaderboard);

// Get user quiz history
router.get("/history", protect, getHistory);

// Start quiz
router.post("/start/:quizId", protect, startQuiz);

// Submit quiz
router.post("/submit", protect, submitQuiz);

 

// Get single quiz
router.get("/:id", protect, getQuizById);

export default router;