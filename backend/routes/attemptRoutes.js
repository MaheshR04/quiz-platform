import express from "express";
import Attempt from "../models/Attempt.js";

const router = express.Router();

// Save quiz attempt
router.post("/submit", async (req, res) => {
  try {

    const { quizId, score, totalQuestions } = req.body;

    const attempt = new Attempt({
      quizId,
      score,
      totalQuestions
    });

    await attempt.save();

    res.json({
      message: "Attempt saved successfully",
      attempt
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all attempts
router.get("/", async (req, res) => {
  try {

    const attempts = await Attempt.find();

    res.json(attempts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;