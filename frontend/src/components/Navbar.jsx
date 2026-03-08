import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">

      <h1 className="text-xl font-bold">
        Quiz App
      </h1>

      <div className="flex gap-3">

        <Link to="/quizzes">
          <button className="bg-blue-500 px-4 py-2 rounded">
            Dashboard
          </button>
        </Link>

        <Link to="/leaderboard">
          <button className="bg-green-500 px-4 py-2 rounded">
            Leaderboard
          </button>
        </Link>

        <Link to="/history">
          <button className="bg-purple-500 px-4 py-2 rounded">
            History
          </button>
        </Link>

        <button
          className="bg-red-500 px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;