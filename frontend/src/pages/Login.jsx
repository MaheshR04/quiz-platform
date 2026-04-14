import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false); // 👁️ NEW

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      navigate("/quizzes");

    } catch (error) {

      console.error(error);
      alert(error.response?.data?.message || "Login failed");

    }

  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-gray-200">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome Back 👋
        </h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          required
        />

        {/* Password Field with Eye Icon */}
        <div className="relative mb-2">

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full border p-3 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />

          {/* 👁️ Icon */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>

        </div>

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-blue-500 cursor-pointer hover:underline"
          >
            Forgot Password?
          </span>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded font-semibold hover:bg-green-600 transition"
        >
          Login
        </button>

        {/* Register */}
        <p className="text-center text-sm mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;