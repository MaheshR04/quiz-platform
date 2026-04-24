import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2 } from "lucide-react";

import API from "../services/api";

const EMPTY_QUESTION = {
  question: "",
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

  const updateQuestion = (index, questionText) => {
    setQuestions((prev) =>
      prev.map((item, questionIndex) =>
        questionIndex === index ? { ...item, question: questionText } : item
      )
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
      prev.map((item, idx) => (idx === questionIndex ? { ...item, correctAnswer: optionIndex } : item))
    );
  };

  const validateBeforeSave = () => {
    if (!title.trim()) return "Quiz title is required.";

    for (const [index, question] of questions.entries()) {
      if (!question.question.trim()) {
        return `Question ${index + 1} is empty.`;
      }

      const emptyOption = question.options.findIndex((option) => !option.trim());
      if (emptyOption !== -1) {
        return `Question ${index + 1}, option ${emptyOption + 1} is empty.`;
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

            <textarea
              rows={2}
              value={question.question}
              onChange={(event) => updateQuestion(questionIndex, event.target.value)}
              placeholder="Enter question text"
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
