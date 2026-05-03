import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2 } from "lucide-react";

import API from "../services/api";

const EMPTY_QUESTION = {
  question: "",
  type: "multiple_choice",
  options: ["", "", "", ""],
  correctAnswer: 0
};

function AdminCreateQuiz() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [questions, setQuestions] = useState([{ ...EMPTY_QUESTION }]);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { ...EMPTY_QUESTION }]);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) {
      alert("At least one question is required.");
      return;
    }
    setQuestions((prev) => prev.filter((_, questionIndex) => questionIndex !== index));
  };

  const updateType = (index, type) => {
    setQuestions((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;

        let options = item.options;
        let correctAnswer = item.correctAnswer;

        if (type === "true_false") {
          options = ["True", "False"];
          correctAnswer = 0;
        } else if (type === "multiple_select") {
          options = options.length > 0 ? options : ["", "", "", ""];
          correctAnswer = [];
        } else if (type === "fill_in_blank") {
          options = [];
          correctAnswer = "";
        } else {
          // multiple_choice or dropdown
          if (!Array.isArray(options) || options.length < 2) {
            options = ["", "", "", ""];
          }
          correctAnswer = 0;
        }

        return { ...item, type, options, correctAnswer };
      })
    );
  };

  const updateOption = (questionIndex, optionIndex, optionText) => {
    setQuestions((prev) =>
      prev.map((item, idx) => {
        if (idx !== questionIndex) return item;

        const updatedOptions = [...item.options];
        updatedOptions[optionIndex] = optionText;
        return { ...item, options: updatedOptions };
      })
    );
  };

  const updateCorrectOption = (questionIndex, optionIndex) => {
    setQuestions((prev) =>
      prev.map((item, idx) => {
        if (idx !== questionIndex) return item;

        if (item.type === "multiple_select") {
          const current = Array.isArray(item.correctAnswer) ? item.correctAnswer : [];
          const updated = current.includes(optionIndex)
            ? current.filter((i) => i !== optionIndex)
            : [...current, optionIndex];
          return { ...item, correctAnswer: updated };
        }

        return { ...item, correctAnswer: optionIndex };
      })
    );
  };

  const updateCorrectAnswerText = (questionIndex, text) => {
    setQuestions((prev) =>
      prev.map((item, idx) => (idx === questionIndex ? { ...item, correctAnswer: text } : item))
    );
  };

  const validateBeforeSave = () => {
    if (!title.trim()) return "Quiz title is required.";

    for (const [index, question] of questions.entries()) {
      if (!question.question.trim()) {
        return `Question ${index + 1} is empty.`;
      }

      if (question.type === "fill_in_blank") {
        if (typeof question.correctAnswer !== "string" || !question.correctAnswer.trim()) {
          return `Question ${index + 1} requires a correct answer string.`;
        }
      } else {
        const emptyOption = question.options.findIndex((option) => !option.trim());
        if (emptyOption !== -1) {
          return `Question ${index + 1}, option ${emptyOption + 1} is empty.`;
        }

        if (question.type === "multiple_select") {
          if (!Array.isArray(question.correctAnswer) || question.correctAnswer.length === 0) {
            return `Question ${index + 1} requires at least one correct selection.`;
          }
        }
      }
    }

    return "";
  };

  const handlePublish = async () => {
    const validationError = validateBeforeSave();
    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);
    try {
      await API.post("/quiz/create", {
        title,
        description,
        timeLimit: Number(timeLimit) || 60,
        questions
      });

      alert("Quiz created successfully.");
      navigate("/quizzes");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create quiz");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
        <h2 className="mb-1 text-2xl font-semibold text-slate-900">Create New Quiz</h2>
        <p className="mb-6 text-sm text-slate-500">
          Add clear questions and mark the correct options before publishing.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: JavaScript Basics"
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
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Add short context for this quiz"
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

            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Question Type</label>
                <select
                  value={question.type}
                  onChange={(e) => updateType(questionIndex, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal-500"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="multiple_select">Multiple Select</option>
                  <option value="true_false">True / False</option>
                  <option value="fill_in_blank">Fill in the Blank</option>
                  <option value="dropdown">Dropdown</option>
                </select>
              </div>
            </div>

            <textarea
              rows={2}
              value={question.question}
              onChange={(event) =>
                setQuestions((prev) =>
                  prev.map((item, idx) =>
                    idx === questionIndex ? { ...item, question: event.target.value } : item
                  )
                )
              }
              placeholder="Enter question text"
              className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />

            {question.type === "fill_in_blank" ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Correct Answer</label>
                <input
                  value={question.correctAnswer}
                  onChange={(e) => updateCorrectAnswerText(questionIndex, e.target.value)}
                  placeholder="Enter the correct text"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={`option-${questionIndex}-${optionIndex}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <input
                      type={question.type === "multiple_select" ? "checkbox" : "radio"}
                      checked={
                        question.type === "multiple_select"
                          ? Array.isArray(question.correctAnswer) &&
                            question.correctAnswer.includes(optionIndex)
                          : question.correctAnswer === optionIndex
                      }
                      onChange={() => updateCorrectOption(questionIndex, optionIndex)}
                      name={`correct-option-${questionIndex}`}
                      className="h-4 w-4 accent-teal-600"
                    />
                    <input
                      value={option}
                      disabled={question.type === "true_false"}
                      onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="w-full border-none bg-transparent text-sm text-slate-700 outline-none disabled:opacity-70"
                    />
                  </label>
                ))}
              </div>
            )}
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
          onClick={handlePublish}
          disabled={saving}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Publishing..." : "Publish Quiz"}
        </button>
      </div>
    </div>
  );
}

export default AdminCreateQuiz;
