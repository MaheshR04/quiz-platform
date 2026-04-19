import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  CheckCircle,
  Users,
  TrendingUp,
  Pencil,
  Trash2,
  Play
} from "lucide-react";

function QuizList() {

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="flex">

      {/* Sidebar */}
      <div className="w-64 min-h-screen bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-xl font-bold text-green-600 mb-6 flex items-center gap-2">
          📘 QuizMaster
        </h2>

        <div className="space-y-3">

          <button className="flex items-center gap-2 w-full p-2 rounded bg-green-100 text-green-700 font-medium">
            <LayoutDashboard size={18} /> Dashboard
          </button>

          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin/create-quiz")}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100"
            >
              <PlusCircle size={18} /> Create Quiz
            </button>
          )}

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

          <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
            <BookOpen className="text-green-500" />
            <div>
              <p className="text-gray-500 text-sm">Total Quizzes</p>
              <h2 className="text-xl font-bold">{quizzes.length}</h2>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
            <CheckCircle className="text-blue-500" />
            <div>
              <p className="text-gray-500 text-sm">Published</p>
              <h2 className="text-xl font-bold">{quizzes.length}</h2>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
            <Users className="text-purple-500" />
            <div>
              <p className="text-gray-500 text-sm">Attempts</p>
              <h2 className="text-xl font-bold">0</h2>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
            <TrendingUp className="text-yellow-500" />
            <div>
              <p className="text-gray-500 text-sm">Avg Score</p>
              <h2 className="text-xl font-bold">0%</h2>
            </div>
          </div>

        </div>

        {/* Create Button */}
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin/create-quiz")}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl mb-6 hover:bg-green-700 shadow"
          >
            <PlusCircle size={18} /> Create New Quiz
          </button>
        )}

        {/* Quiz List */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Your Quizzes</h2>

          {quizzes.length === 0 ? (
            <p className="text-gray-500">No quizzes found</p>
          ) : (
            quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="flex justify-between items-center border p-4 rounded-xl mb-3 hover:shadow transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{quiz.title}</h3>

                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      published
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {quiz.description || "No description"}
                  </p>
                </div>

                <div className="flex gap-3 items-center">

                  <button
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Play size={14} /> Start
                  </button>

                  {user?.role === "admin" && (
                    <>
                      <button
                        onClick={() => navigate(`/admin/edit-quiz/${quiz._id}`)}
                        className="p-2 rounded hover:bg-gray-100"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(quiz._id)}
                        className="p-2 rounded hover:bg-red-100 text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}

                </div>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default QuizList;