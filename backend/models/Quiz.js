import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    enum: ["multiple_choice", "multiple_select", "true_false", "fill_in_blank", "dropdown"],
    default: "multiple_choice"
  },

  options: {
    type: [String],
    required: function () {
      return this.type !== "fill_in_blank";
    },
    validate: {
      validator: function (value) {
        if (this.type === "fill_in_blank") return true;
        if (this.type === "true_false") return value.length === 2;
        return value.length >= 2 && value.length <= 10;
      },
      message: "A question must have between 2 and 10 options"
    }
  },

  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // index, array of indices, or string
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