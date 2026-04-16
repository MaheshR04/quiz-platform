import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function QuizList() {

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const navigate = useNavigate();

  // Get user from token
  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    user = JSON.parse(atob(token.split(".")[1]));
  }

  useEffect(() => {

    const fetchQuizzes = async () => {

      try {

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

  }, [navigate, token]);

  // Toggle menu
  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  // Edit quiz
  const handleEdit = (id) => {
    navigate(`/admin/edit-quiz/${id}`);
  };

  // Delete quiz
  const handleDelete = async (id) => {
    try {

      const confirmDelete = window.confirm("Are you sure you want to delete?");
      if (!confirmDelete) return;

      await axios.delete(
        `http://localhost:5000/api/quiz/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Quiz deleted successfully");

      setQuizzes(quizzes.filter((q) => q._id !== id));

    } catch (error) {

      console.error("Delete error:", error);
      alert("Error deleting quiz");

    }
  };


  if (loading) {
    return (
      <p className="text-center mt-10 text-lg">Loading quizzes...</p>
    );
  }


  return (
    <div className="p-10 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Available Quizzes
        </h1>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin/create-quiz")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Create Quiz
          </button>
        )}

      </div>


      {quizzes.length === 0 ? (

        <p className="text-center text-gray-500">
          No quizzes found
        </p>

      ) : (

        quizzes.map((quiz) => (

          <div
            key={quiz._id}
            className="relative border p-6 rounded-lg mb-6 shadow hover:shadow-lg transition bg-white"
          >

            {/* Admin Menu */}
            {user?.role === "admin" && (
              <div className="absolute top-4 right-4">

                <button
                  onClick={() => toggleMenu(quiz._id)}
                  className="text-xl font-bold"
                >
                  ⋮
                </button>

                {openMenu === quiz._id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow">

                    <button
                      onClick={() => handleEdit(quiz._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(quiz._id)}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Delete
                    </button>

                  </div>
                )}

              </div>
            )}

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
  );
}

export default QuizList;