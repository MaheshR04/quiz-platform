import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return (

    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">

      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/quizzes")}
      >
        Quiz App
      </h1>

      <div className="space-x-4">

        <button
          onClick={() => navigate("/quizzes")}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/leaderboard")}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Leaderboard
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

    </div>

  );
}

export default Navbar;