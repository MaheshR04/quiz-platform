import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlusCircle, Trash2 } from "lucide-react";

import API from "../services/api";

function sanitizeQuestions(rawQuestions = []) {
  if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
    return [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0
      }
    ];
  }

  return rawQuestions.map((question) => {
    const options = Array.isArray(question.options) && question.options.length > 0
      ? question.options
      : ["", "", "", ""];

    return {
      question: question.question || "",
      options,
      correctAnswer: Number.isInteger(question.correctAnswer) ? question.correctAnswer : 0
    };
  });
}

function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await API.get(`/quiz/${id}`);
        const quiz = response.data?.quiz;

        if (!quiz) {
          alert("Quiz not found.");
          navigate("/quizzes");
          return;
        }

        setTitle(quiz.title || "");
        setDescription(quiz.description || "");
        setTimeLimit(quiz.timeLimit || 60);
        setQuestions(sanitizeQuestions(quiz.questions));
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load quiz");
        navigate("/quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0
      }
    ]);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) {
      alert("At least one question is required.");
      return;
    }
    setQuestions((prev) => prev.filter((_, questionIndex) => questionIndex !== index));
  };

  const updateQuestion = (index, questionText) => {
    setQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index ? { ...question, question: questionText } : question
      )
    );
  };

  const updateOption = (questionIndex, optionIndex, optionText) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) => {
        if (qIndex !== questionIndex) return question;

        const options = [...question.options];
        options[optionIndex] = optionText;
        return { ...question, options };
      })
    );
  };

  const updateCorrectOption = (questionIndex, optionIndex) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) =>
        qIndex === questionIndex ? { ...question, correctAnswer: optionIndex } : question
      )
    );
  };

  const validateQuiz = () => {
    if (!title.trim()) return "Quiz title is required.";

    for (const [questionIndex, question] of questions.entries()) {
      if (!question.question.trim()) {
        return `Question ${questionIndex + 1} is empty.`;
      }

      const emptyOption = question.options.findIndex((option) => !option.trim());
      if (emptyOption !== -1) {
        return `Question ${questionIndex + 1}, option ${emptyOption + 1} is empty.`;
      }
    }

    return "";
  };

  const handleUpdate = async () => {
    const validationError = validateQuiz();
    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);
    try {
      await API.put(`/quiz/${id}`, {
        title,
        description,
        timeLimit: Number(timeLimit) || 60,
        questions
      });

      alert("Quiz updated successfully.");
      navigate("/quizzes");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update quiz");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-8 text-center text-slate-600 shadow-sm">
        Loading quiz...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
        <h2 className="mb-1 text-2xl font-semibold text-slate-900">Edit Quiz</h2>
        <p className="mb-6 text-sm text-slate-500">Update title, questions, and correct answers.</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Time Limit (seconds)</label>
            <input
              type="number"
              min={15}
              value={timeLimit}
              onChange={(event) => setTimeLimit(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Questions ({questions.length})</h3>
          <button
            onClick={addQuestion}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <PlusCircle size={16} />
            Add Question
          </button>
        </div>

        {questions.map((question, questionIndex) => (
          <article
            key={`question-${questionIndex}`}
            className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Question {questionIndex + 1}
              </h4>
              <button
                onClick={() => deleteQuestion(questionIndex)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>

            <textarea
              rows={2}
              value={question.question}
              onChange={(event) => updateQuestion(questionIndex, event.target.value)}
              className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />

            <div className="grid gap-3 md:grid-cols-2">
              {question.options.map((option, optionIndex) => (
                <label
                  key={`option-${questionIndex}-${optionIndex}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <input
                    type="radio"
                    checked={question.correctAnswer === optionIndex}
                    onChange={() => updateCorrectOption(questionIndex, optionIndex)}
                    name={`correct-option-${questionIndex}`}
                    className="h-4 w-4 accent-teal-600"
                  />
                  <input
                    value={option}
                    onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                    className="w-full border-none bg-transparent text-sm text-slate-700 outline-none"
                  />
                </label>
              ))}
            </div>
          </article>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/quizzes")}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Updating..." : "Update Quiz"}
        </button>
      </div>
    </div>
  );
}

export default EditQuiz;
