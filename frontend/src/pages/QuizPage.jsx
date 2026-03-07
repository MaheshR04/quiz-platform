import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function QuizPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);

  const [answers, setAnswers] = useState([]);

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

  const handleSelect = (questionIndex, optionIndex) => {

    const newAnswers = [...answers];

    newAnswers[questionIndex] = optionIndex;

    setAnswers(newAnswers);

  };

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

      <h1 className="text-3xl font-bold mb-8 text-center">
        {quiz.title}
      </h1>

      {quiz.questions.map((q, index) => (

        <div
          key={index}
          className="bg-white p-6 mb-6 rounded shadow"
        >

          <h2 className="font-semibold mb-4">
            {index + 1}. {q.question}
          </h2>

          <div className="space-y-2">

            {q.options.map((option, i) => (

              <button
                key={i}
                onClick={() => handleSelect(index, i)}
                className={`block w-full text-left p-2 border rounded 
                ${answers[index] === i ? "bg-blue-200" : ""}`}
              >
                {option}
              </button>

            ))}

          </div>

        </div>

      ))}

      <div className="text-center">

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-3 rounded"
        >
          Submit Quiz
        </button>

      </div>

    </div>

  );
}

export default QuizPage;