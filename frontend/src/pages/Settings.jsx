import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">

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
          className="p-4 cursor-pointer hover:bg-gray-100 flex justify-between text-red-500"
        >
          <span>🚪 Logout</span>
        </div>

      </div>
    </div>
  );
}