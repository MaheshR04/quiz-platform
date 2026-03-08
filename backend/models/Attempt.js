import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz"
  },
  score: Number,
  totalQuestions: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Attempt", attemptSchema);