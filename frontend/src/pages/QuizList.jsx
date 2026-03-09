import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function QuizList() {

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchQuizzes = async () => {

      try {

        const token = localStorage.getItem("token");

        // Redirect if not logged in
        if (!token) {
          navigate("/login");
          return;
        }

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

        console.error("Error fetching quizzes:", error);
        alert("Failed to fetch quizzes");

      } finally {

        setLoading(false);

      }

    };

    fetchQuizzes();

  }, [navigate]);


  if (loading) {
    return (
      <>
        <Navbar />
        <p className="text-center mt-10 text-lg">Loading quizzes...</p>
      </>
    );
  }


  return (
    <>
      <Navbar />

      <div className="p-10 max-w-4xl mx-auto">

        {/* Header + Create Quiz Button */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            Available Quizzes
          </h1>

          <button
            onClick={() => navigate("/admin/create-quiz")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Create Quiz
          </button>

        </div>


        {quizzes.length === 0 ? (

          <p className="text-center text-gray-500">
            No quizzes found
          </p>

        ) : (

          quizzes.map((quiz) => (

            <div
              key={quiz._id}
              className="border p-6 rounded-lg mb-6 shadow hover:shadow-lg transition bg-white"
            >

              <h2 className="text-xl font-semibold mb-2">
                {quiz.title}
              </h2>

              <p className="text-gray-600 mb-4">
                {quiz.description}
              </p>

              <button
                onClick={() => navigate(`/quiz/${quiz._id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
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