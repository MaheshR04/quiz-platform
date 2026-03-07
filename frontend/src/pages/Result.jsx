import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Result() {

  const location = useLocation();
  const navigate = useNavigate();

  const { score, total } = location.state || { score: 0, total: 0 };

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center justify-center mt-20">

        <h1 className="text-4xl font-bold mb-6">
          Quiz Result
        </h1>

        <h2 className="text-2xl mb-8">
          Your Score: {score} / {total}
        </h2>

        <div className="space-x-4">

          <button
            onClick={() => navigate("/leaderboard")}
            className="bg-blue-500 text-white px-6 py-3 rounded"
          >
            View Leaderboard
          </button>

          <button
            onClick={() => navigate("/quizzes")}
            className="bg-green-500 text-white px-6 py-3 rounded"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    </>
  );
}

export default Result;