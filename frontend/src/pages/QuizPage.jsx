import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function QuizPage() {

  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [submitted, setSubmitted] = useState(false);
  const [warningShown, setWarningShown] = useState(false);

  // ✅ LOAD QUIZ FROM LOCALSTORAGE (NOT MOCK)
  useEffect(() => {

    const savedQuiz = JSON.parse(localStorage.getItem("currentQuiz"));

    if (!savedQuiz) {
      alert("No quiz found!");
      navigate("/quizzes");
      return;
    }

    setQuiz(savedQuiz);
    setAnswers(new Array(savedQuiz.questions.length).fill(null));
    setTimeLeft(savedQuiz.timeLimit || 60);

  }, []);

  // TIMER
  useEffect(() => {

    if (!quiz || submitted) return;

    if (timeLeft === 5 && !warningShown) {
      alert("⚠️ Only 5 seconds left!");
      setWarningShown(true);
    }

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);

  }, [timeLeft, quiz, submitted, warningShown]);

  // SELECT ANSWER
  const handleSelect = (qIndex, optIndex) => {
    const updated = [...answers];
    updated[qIndex] = optIndex;
    setAnswers(updated);
  };

  // SUBMIT (FRONTEND ONLY)
  const handleSubmit = () => {

    if (submitted) return;

    setSubmitted(true);

    let score = 0;

    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });

    navigate("/result", {
      state: {
        score,
        total: quiz.questions.length
      }
    });
  };

  if (!quiz) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading Quiz...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="p-8 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            {quiz.title}
          </h1>

          <div
            className={`px-5 py-2 rounded-lg text-white font-semibold shadow-md
            ${timeLeft < 10 ? "bg-red-600 animate-pulse" : "bg-red-500"}
          `}
          >
            ⏱ {timeLeft}s
          </div>

        </div>

        {/* QUESTIONS */}
        <div className="space-y-6">

          {quiz.questions.map((q, index) => (

            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md"
            >

              <h2 className="text-sm text-gray-500 mb-2">
                Question {index + 1} of {quiz.questions.length}
              </h2>

              <p className="text-lg font-semibold mb-4">
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
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {option}
                  </button>

                ))}

              </div>

            </div>

          ))}

        </div>

        {/* SUBMIT */}
        <div className="text-center mt-10">

          <button
            onClick={handleSubmit}
            disabled={submitted}
            className={`px-8 py-3 rounded-lg text-white font-semibold shadow-md transition
            ${
              submitted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Submit Quiz
          </button>

        </div>

      </div>

    </div>
  );
}

export default QuizPage;