import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";

/* CREATE QUIZ (Admin) */
export const createQuiz = async (req, res) => {
  try {

    const { title, description, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        message: "Title and at least one question are required"
      });
    }

    // Validate each question
    for (const q of questions) {

      if (!q.question || !q.options || q.options.length < 2) {
        return res.status(400).json({
          message: "Each question must have a question and at least 2 options"
        });
      }

      if (q.correctAnswer === undefined) {
        return res.status(400).json({
          message: "Each question must have a correct answer"
        });
      }

    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Quiz created successfully",
      quiz
    });

  } catch (error) {

    console.error("Create Quiz Error:", error);

    res.status(500).json({
      message: "Error creating quiz"
    });

  }
};


/* GET ALL QUIZZES */
export const getQuizzes = async (req, res) => {
  try {

    const quizzes = await Quiz
      .find()
      .select("-questions.correctAnswer")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Quizzes fetched successfully",
      quizzes
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};


/* GET SINGLE QUIZ */
export const getQuizById = async (req, res) => {
  try {

    const quiz = await Quiz
      .findById(req.params.id)
      .select("-questions.correctAnswer");

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    res.status(200).json({
      message: "Quiz fetched successfully",
      quiz
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};


/* START QUIZ */
export const startQuiz = async (req, res) => {
  try {

    const quiz = await Quiz
      .findById(req.params.quizId)
      .select("-questions.correctAnswer");

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    res.status(200).json({
      message: "Quiz started",
      quiz
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};


/* SUBMIT QUIZ */
export const submitQuiz = async (req, res) => {
  try {

    const { quizId, answers } = req.body;

    if (!quizId || !answers) {
      return res.status(400).json({
        message: "Quiz ID and answers are required"
      });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    await Result.create({
      userId: req.user.id,
      quizId,
      score,
      totalQuestions: quiz.questions.length
    });

    res.status(200).json({
      message: "Quiz submitted successfully",
      totalQuestions: quiz.questions.length,
      score
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};


/* LEADERBOARD */
export const getLeaderboard = async (req, res) => {
  try {

    const { quizId } = req.params;

    const results = await Result.find({ quizId })
      .populate("userId", "name")
      .sort({ score: -1 })
      .limit(10);

    const leaderboard = results.map((r) => ({
      user: r.userId ? r.userId.name : "Unknown User",
      score: r.score,
      totalQuestions: r.totalQuestions
    }));

    res.status(200).json({
      message: "Leaderboard fetched successfully",
      leaderboard
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};


/* USER HISTORY */
export const getHistory = async (req, res) => {
  try {

    const history = await Result.find({
      userId: req.user.id
    })
      .populate("quizId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      history
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};


/* UPDATE QUIZ (Admin) */
export const updateQuiz = async (req, res) => {
  try {

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    res.status(200).json({
      message: "Quiz updated successfully",
      quiz
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};


/* DELETE QUIZ (Admin) */
export const deleteQuiz = async (req, res) => {
  try {

    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    res.status(200).json({
      message: "Quiz deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};