import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function QuizPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer

  // Start Quiz
  useEffect(() => {

    const startQuiz = async () => {

      try {

        const res = await API.post(`/quiz/start/${id}`);
        setQuiz(res.data.quiz);

      } catch (error) {

        console.log(error);

      }

    };

    startQuiz();

  }, [id]);

  // Timer Logic
  useEffect(() => {

    const timer = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev === 1) {

          clearInterval(timer);
          handleSubmit(); // auto submit when time finishes

        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // Select Answer
  const handleSelect = (questionIndex, optionIndex) => {

    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);

  };

  // Submit Quiz
  const handleSubmit = async () => {

    try {

      const res = await API.post("/quiz/submit", {
        quizId: id,
        answers
      });

      navigate("/result", {
        state: {
          score: res.data.score,
          total: res.data.totalQuestions
        }
      });

    } catch (error) {

      console.log(error);

    }

  };

  if (!quiz) {
    return <h2 className="text-center mt-10">Loading Quiz...</h2>;
  }

  return (

  <div className="min-h-screen bg-gray-100 p-10">

    {/* Timer */}
    <div className="flex justify-end mb-4">
      <div className="bg-red-500 text-white px-4 py-2 rounded shadow">
        Time Left: {timeLeft}s
      </div>
    </div>

    {/* Quiz Title */}
    <h1 className="text-3xl font-bold mb-8 text-center">
      {quiz.title}
    </h1>

      {/* Questions */}
      {quiz.questions.map((q, index) => (

        <div
          key={index}
          className="bg-white p-6 mb-6 rounded shadow"
        >

          {/* Question */}
          <h2 className="font-semibold mb-4">
            Question {index + 1} of {quiz.questions.length}
          </h2>

          <p className="mb-4">
            {q.question}
          </p>

          {/* Options */}
          <div className="space-y-2">

            {q.options.map((option, i) => (

              <button
                key={i}
                onClick={() => handleSelect(index, i)}
                className={`block w-full text-left p-3 border rounded transition
                ${
                  answers[index] === i
                    ? "bg-blue-200 border-blue-400"
                    : "hover:bg-gray-100"
                }`}
              >
                {option}
              </button>

            ))}

          </div>

        </div>

      ))}

      {/* Submit Button */}
      <div className="text-center">

        <button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded"
        >
          Submit Quiz
        </button>

      </div>

    </div>

  );

}

export default QuizPage;