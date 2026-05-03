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

// Leaderboard (Admin only)
router.get("/leaderboard/:quizId", protect, admin, getLeaderboard);

// Get quiz history (Admin can see all, but currently controller filters by user.id)
// Actually, if we want admin to see all, we need a different controller or logic.
// For now, let's allow users to see their own history.
router.get("/history", protect, getHistory);


/*
==============================
USER ROUTES
==============================
*/

// Get all quizzes
router.get("/", protect, getQuizzes);


// Start quiz
router.post("/start/:quizId", protect, startQuiz);

// Submit quiz
router.post("/submit", protect, submitQuiz);


 

// Get single quiz
router.get("/:id", protect, getQuizById);

export default router;