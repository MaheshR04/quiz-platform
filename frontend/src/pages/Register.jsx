import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await API.post("/auth/register", form);

      alert("Registered successfully!");
      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-gray-200">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create Account 🚀
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          required
        />

        {/* Phone Number */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          pattern="[0-9]{10}"
          title="Enter 10 digit phone number"
          required
        />

        {/* Password */}
        <div className="relative mb-2">

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full border p-3 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />

          {/* 👁️ Toggle */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>

        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded mt-4 font-semibold hover:bg-blue-600 transition"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Register;