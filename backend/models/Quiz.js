import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },

  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (value) {
        return value.length >= 2 && value.length <= 6;
      },
      message: "A question must have between 2 and 6 options"
    }
  },

  correctAnswer: {
    type: Number, // index of correct option
    required: true
  },

  points: {
    type: Number,
    default: 1
  }
});


const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    timeLimit: {
      type: Number,
      default: 60 // seconds
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    questions: {
      type: [questionSchema],
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }

  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);