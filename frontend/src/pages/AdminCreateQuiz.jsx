import { useState } from "react";
import API from "../services/api";

function AdminCreateQuiz() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    }
  ]);

  // Handle question change
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // Handle option change
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  // Handle correct answer
  const handleCorrectAnswer = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = Number(value);
    setQuestions(updated);
  };

  // Add new question
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

  // Submit quiz
  const handleSubmit = async () => {

    try {

      const token = localStorage.getItem("token");

      // Remove empty questions
      const filteredQuestions = questions.filter(
        (q) => q.question.trim() !== ""
      );

      const quizData = {
        title,
        description,
        questions: filteredQuestions
      };

      await API.post(
        "/quiz/create",
        quizData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Quiz created successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0
        }
      ]);

    } catch (error) {

      console.error("Create quiz error:", error.response?.data || error);
      alert("Error creating quiz");

    }

  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">Create Quiz</h1>

      {/* Title */}
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      {/* Description */}
      <textarea
        placeholder="Quiz Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 mb-6"
      />

      {questions.map((q, qIndex) => (

        <div key={qIndex} className="border p-4 mb-6 rounded">

          <h2 className="font-semibold mb-2">
            Question {qIndex + 1}
          </h2>

          <input
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(qIndex, e.target.value)
            }
            className="w-full border p-2 mb-4"
          />

          {q.options.map((option, oIndex) => (

            <div key={oIndex} className="flex items-center mb-2">

              <input
                type="radio"
                name={`correct-${qIndex}`}
                value={oIndex}
                checked={q.correctAnswer === oIndex}
                onChange={(e) =>
                  handleCorrectAnswer(qIndex, e.target.value)
                }
                className="mr-2"
              />

              <input
                type="text"
                placeholder={`Option ${oIndex + 1}`}
                value={option}
                onChange={(e) =>
                  handleOptionChange(qIndex, oIndex, e.target.value)
                }
                className="w-full border p-2"
              />

            </div>

          ))}

        </div>

      ))}

      <button
        onClick={addQuestion}
        className="bg-blue-500 text-white px-4 py-2 mr-4 rounded"
      >
        Add Question
      </button>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Save Quiz
      </button>

    </div>
  );
}

export default AdminCreateQuiz;