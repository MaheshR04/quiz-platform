import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditQuiz() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const token = localStorage.getItem("token");

  // Load quiz data
  useEffect(() => {

    const fetchQuiz = async () => {
      try {

        const res = await axios.get(
          `http://localhost:5000/api/quiz/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const quiz = res.data.quiz;

        setTitle(quiz.title);
        setDescription(quiz.description);
        setQuestions(quiz.questions);

      } catch (error) {
        console.error(error);
        alert("Error loading quiz");
      }
    };

    fetchQuiz();

  }, [id, token]);

  // Update question
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // Update option
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  // Update correct answer
  const handleCorrectAnswer = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = Number(value);
    setQuestions(updated);
  };

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

  // ❌ Delete Question (SAFE)
  const deleteQuestion = (index) => {

    if (questions.length === 1) {
      alert("At least one question is required!");
      return;
    }

    const confirmDelete = window.confirm("Delete this question?");
    if (!confirmDelete) return;

    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  // Save update
  const handleUpdate = async () => {
    try {

      await axios.put(
        `http://localhost:5000/api/quiz/${id}`,
        { title, description, questions },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Quiz updated successfully!");
      navigate("/quizzes");

    } catch (error) {
      console.error(error);
      alert("Error updating quiz");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">Edit Quiz</h1>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 mb-6"
      />

      {/* Questions */}
      {questions.map((q, qIndex) => (

        <div
          key={qIndex}
          className="border p-4 mb-6 rounded relative bg-white shadow"
        >

          <div className="flex justify-between items-center mb-2">

            <h2 className="font-semibold">
              Question {qIndex + 1}
            </h2>

            {/* ❌ Delete Button */}
            <button
              onClick={() => deleteQuestion(qIndex)}
              className="text-red-600 text-sm font-semibold hover:underline"
            >
              Delete
            </button>

          </div>

          <input
            type="text"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(qIndex, e.target.value)
            }
            className="w-full border p-2 mb-4"
          />

          {q.options.map((opt, oIndex) => (

            <div key={oIndex} className="flex items-center mb-2">

              <input
                type="radio"
                name={`correct-${qIndex}`}
                checked={q.correctAnswer === oIndex}
                onChange={() =>
                  handleCorrectAnswer(qIndex, oIndex)
                }
                className="mr-2"
              />

              <input
                type="text"
                value={opt}
                onChange={(e) =>
                  handleOptionChange(qIndex, oIndex, e.target.value)
                }
                className="w-full border p-2"
              />

            </div>

          ))}

        </div>

      ))}

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-8">

        <button
          onClick={addQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ➕ Add Question
        </button>

        <button
          onClick={handleUpdate}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Update Quiz
        </button>

      </div>

    </div>
  );
}

export default EditQuiz;