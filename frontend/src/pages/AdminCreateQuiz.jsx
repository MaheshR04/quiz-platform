import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Sparkles } from "lucide-react";

function AdminCreateQuiz() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0
      }
    ]);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswer = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = optIndex;
    setQuestions(updated);
  };

  const handleSaveQuiz = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/quiz/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          subject,
          description,
          timeLimit,
          questions
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Quiz created!");
      navigate("/quizzes");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef5f3]">

      <div className="max-w-6xl mx-auto p-8">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/quizzes")}
            className="text-gray-600"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-semibold">
            Create New Quiz
          </h1>
        </div>

        {/* QUIZ DETAILS */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

          <h2 className="font-semibold mb-4">Quiz Details</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">

            <div>
              <label className="text-sm font-medium">Title *</label>
              <input
                placeholder="e.g. Biology Chapter 5"
                className="mt-1 w-full p-3 border rounded-lg bg-gray-50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Subject *</label>
              <input
                placeholder="e.g. Biology"
                className="mt-1 w-full p-3 border rounded-lg bg-gray-50"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

          </div>

          <div className="mb-4">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Optional description..."
              className="mt-1 w-full p-3 border rounded-lg bg-gray-50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Time Limit (min)
            </label>
            <input
              type="number"
              className="mt-1 w-32 p-3 border rounded-lg bg-gray-50"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </div>

        </div>

        {/* AI GENERATOR */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-green-500">

          <div className="flex items-center gap-2 mb-4 font-semibold">
            <Sparkles size={18} />
            AI Question Generator
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">

            <input
              placeholder="e.g. Photosynthesis, World War II..."
              className="p-3 border rounded-lg bg-gray-50"
            />

            <input
              type="number"
              defaultValue={5}
              className="p-3 border rounded-lg bg-gray-50"
            />

          </div>

          <button className="bg-green-600 text-white px-5 py-2 rounded-lg">
            Generate Questions
          </button>

        </div>

        {/* QUESTIONS */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">
              Questions ({questions.length})
            </h2>

            <button
              onClick={addQuestion}
              className="flex items-center gap-2 border px-4 py-2 rounded-lg"
            >
              <PlusCircle size={16} />
              Add Question
            </button>
          </div>

          {questions.length === 0 && (
            <p className="text-gray-500">
              Questions will appear here...
            </p>
          )}

          {questions.map((q, index) => (
            <div key={index} className="border p-4 rounded-lg mb-4">

              <div className="flex justify-between mb-2">
                <span className="font-medium">Q{index + 1}</span>

                <button onClick={() => deleteQuestion(index)}>
                  <Trash2 className="text-red-500" />
                </button>
              </div>

              <textarea
                placeholder="Enter question text..."
                className="w-full p-2 border rounded mb-3"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(index, e.target.value)
                }
              />

              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">

                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={q.correctAnswer === i}
                    onChange={() => handleCorrectAnswer(index, i)}
                  />

                  <input
                    placeholder={`Option ${i + 1}`}
                    className="w-full p-2 border rounded"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(index, i, e.target.value)
                    }
                  />

                </div>
              ))}

            </div>
          ))}

        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex gap-4">

          <button className="px-5 py-2 border rounded-lg">
            💾 Save Draft
          </button>

          <button
            onClick={handleSaveQuiz}
            className="px-5 py-2 bg-green-600 text-white rounded-lg"
          >
            🚀 Publish Quiz
          </button>

        </div>

      </div>
    </div>
  );
}

export default AdminCreateQuiz;