import { Link, useNavigate } from "react-router-dom";
import { Settings as SettingsIcon } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ SAFE parsing (prevents crash)
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  if (!token) return null;

  return (
    <div className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md relative">

      {/* LEFT */}
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/quizzes")}
      >
        Quiz App
      </h1>

      {/* CENTER ROLE BADGE */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        {user.role === "admin" && (
          <span className="bg-yellow-400 text-black px-4 py-1 rounded-full font-semibold shadow">
            👑 ADMIN ACCESS
          </span>
        )}
        {user.role === "user" && (
          <span className="bg-green-400 text-black px-4 py-1 rounded-full font-semibold shadow">
            👤 USER ACCESS
          </span>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex gap-3 items-center">

        <Link to="/quizzes">
          <button className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">
            Quizzes
          </button>
        </Link>

        {user.role === "admin" && (
          <>
            <Link to="/leaderboard">
              <button className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded">
                Leaderboard
              </button>
            </Link>

            <Link to="/history">
              <button className="bg-purple-500 hover:bg-purple-700 px-4 py-2 rounded">
                History
              </button>
            </Link>
          </>
        )}

        <button
          onClick={() => navigate("/settings")}
          className="p-2 rounded-full hover:bg-blue-500"
        >
          <SettingsIcon size={22} />
        </button>

      </div>
    </div>
  );
}

export default Navbar;