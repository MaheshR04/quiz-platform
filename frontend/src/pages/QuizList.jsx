import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function QuizList() {

  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchQuizzes = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/quiz",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setQuizzes(response.data.quizzes);

      } catch (error) {

        console.error("Error:", error);
        alert("Failed to fetch quizzes");

      }

    };

    fetchQuizzes();

  }, []);

  return (
    <>
      <Navbar />

      <div className="p-10">

        <h1 className="text-3xl font-bold text-center mb-8">
          Available Quizzes
        </h1>

        {quizzes.length === 0 ? (

          <p className="text-center text-gray-500">
            No quizzes found
          </p>

        ) : (

          quizzes.map((quiz) => (

            <div
              key={quiz._id}
              className="border p-6 rounded mb-6 shadow hover:shadow-lg transition"
            >

              <h2 className="text-xl font-semibold mb-2">
                {quiz.title}
              </h2>

              <p className="text-gray-600 mb-4">
                {quiz.description}
              </p>

              <button
                onClick={() => navigate(`/quiz/${quiz._id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Start Quiz
              </button>

            </div>

          ))

        )}

      </div>
    </>
  );

}

export default QuizList;