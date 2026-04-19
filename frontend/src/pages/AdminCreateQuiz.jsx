 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Sparkles } from "lucide-react";

function AdminCreateQuiz() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  // ➕ Add Question
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

  // ❌ Delete Question
  const deleteQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  // ✏️ Question change
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // ✏️ Option change
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // ✅ Select correct answer
  const handleCorrectAnswer = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = optIndex;
    setQuestions(updated);
  };

  // 💾 SAVE QUIZ
  const handleSaveQuiz = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("❌ Please login as admin");
        return;
      }

      if (!title || questions.length === 0) {
        alert("❌ Add title and at least one question");
        return;
      }

      const quizData = {
        title,
        description,
        questions
      };

      const res = await fetch("http://localhost:5000/api/quiz/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(quizData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create quiz");
      }

      alert("✅ Quiz created successfully!");
      navigate("/quizzes");

    } catch (error) {
      console.error("CREATE QUIZ ERROR:", error);
      alert("❌ " + error.message);
    }
  };

  return (
    <div className="flex">

      {/* Sidebar */}
      <div className="w-64 min-h-screen bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-xl font-bold text-green-600 mb-6">
          📘 QuizMaster
        </h2>

        <button onClick={() => navigate("/quizzes")} className="block mb-2">
          Dashboard
        </button>

        <button className="bg-green-100 p-2 rounded">
          Create Quiz
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 bg-gray-100 p-6">

        <h1 className="text-2xl font-bold mb-6">
          Create New Quiz
        </h1>

        {/* Quiz Details */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">

          <input
            placeholder="Quiz Title"
            className="p-3 border rounded w-full mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full p-3 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

        </div>

        {/* AI Generator */}
        <div className="bg-white p-6 rounded-xl shadow mb-6 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles /> AI Question Generator
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Generate Questions
          </button>
        </div>

        {/* Questions */}
        <div className="bg-white p-6 rounded-xl shadow">

          <div className="flex justify-between items-center mb-4">
            <h2>Questions ({questions.length})</h2>

            <button
              onClick={addQuestion}
              className="flex items-center gap-2 border px-4 py-2 rounded"
            >
              <PlusCircle size={16} /> Add Question
            </button>
          </div>

          {questions.length === 0 && (
            <p className="text-gray-500">
              No questions added yet
            </p>
          )}

          {questions.map((q, index) => (
            <div key={index} className="border p-4 rounded mb-4">

              <div className="flex justify-between mb-2">
                <span className="font-semibold">Q{index + 1}</span>

                <button onClick={() => deleteQuestion(index)}>
                  <Trash2 className="text-red-500" />
                </button>
              </div>

              <textarea
                placeholder="Enter question"
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

        <div className="flex gap-4 mt-6">

          <button className="px-5 py-2 border rounded hover:bg-gray-100">
            💾 Save Draft
          </button>

          <button
            onClick={handleSaveQuiz}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            🚀 Publish Quiz
          </button>

        </div>

      </div>
    </div>
  );
}

export default AdminCreateQuiz;
