import { useNavigate } from "react-router-dom";

function Settings() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-10 flex justify-center">

      <div className="w-full max-w-md bg-white rounded-lg shadow">

        <h1 className="text-2xl font-bold text-center py-4">
          Settings
        </h1>

        {/* Profile Settings */}
        <div
          onClick={() => navigate("/profile-settings")}
          className="p-4 border-b cursor-pointer hover:bg-gray-100 flex justify-between"
        >
          <span>👤 Profile Settings</span>
          <span>›</span>
        </div>

        {/* Logout */}
        <div
          onClick={handleLogout}
          className="p-4 cursor-pointer text-red-500 hover:bg-gray-100"
        >
          🚪 Logout
        </div>

      </div>

    </div>
  );
}

export default Settings;