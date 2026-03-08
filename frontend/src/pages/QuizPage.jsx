import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function QuizPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [submitted, setSubmitted] = useState(false);

  // Start Quiz
  useEffect(() => {

    const startQuiz = async () => {

      try {

        const res = await API.post(`/quiz/start/${id}`);

        setQuiz(res.data.quiz);
        setAnswers(new Array(res.data.quiz.questions.length).fill(null));

      } catch (error) {
        console.log(error);
      }

    };

    startQuiz();

  }, [id]);

  // Timer
  useEffect(() => {

    if (submitted) return;

    const timer = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {

          clearInterval(timer);

          if (!submitted) {
            handleSubmit();
          }

          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [submitted]);

  // Select Answer
  const handleSelect = (questionIndex, optionIndex) => {

    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);

  };

  // Submit Quiz
  const handleSubmit = async () => {

    if (submitted) return;

    setSubmitted(true);

    try {

      // Submit quiz answers
      const res = await API.post("/quiz/submit", {
        quizId: id,
        answers
      });

      const score = res.data.score;
      const total = res.data.totalQuestions;

      // Save attempt
      await API.post("/attempts/submit", {
        quizId: id,
        score: score,
        totalQuestions: total
      });

      // Navigate to result page
      navigate("/result", {
        state: {
          score: score,
          total: total
        }
      });

    } catch (error) {
      console.log("Submit error:", error);
    }

  };

  if (!quiz) {

    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading Quiz...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          {quiz.title}
        </h1>

        <div className={`px-4 py-2 rounded text-white font-semibold shadow
          ${timeLeft < 10 ? "bg-red-600 animate-pulse" : "bg-red-500"}
        `}>
          ⏱ {timeLeft}s
        </div>

      </div>

      {/* Questions */}
      {quiz.questions.map((q, index) => (

        <div
          key={index}
          className="bg-white p-6 mb-6 rounded-lg shadow-md"
        >

          <h2 className="font-semibold mb-3 text-gray-600">
            Question {index + 1} of {quiz.questions.length}
          </h2>

          <p className="text-lg font-medium mb-4">
            {q.question}
          </p>

          <div className="space-y-3">

            {q.options.map((option, i) => (

              <button
                key={i}
                onClick={() => handleSelect(index, i)}
                className={`w-full text-left p-3 border rounded-lg transition
                ${
                  answers[index] === i
                    ? "bg-blue-500 text-white border-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {option}
              </button>

            ))}

          </div>

        </div>

      ))}

      {/* Submit */}
      <div className="text-center mt-8">

        <button
          onClick={handleSubmit}
          disabled={submitted}
          className={`px-8 py-3 rounded text-white font-semibold
          ${
            submitted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Submit Quiz
        </button>

      </div>

    </div>

  );

}

export default QuizPage;